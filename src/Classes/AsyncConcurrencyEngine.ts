import { IQueueItem, PriorityQueue } from './PriorityQueue';

export class AsyncConcurrencyEngine<T = unknown> {
    private Inflight = 0;
    private Queue = new PriorityQueue<T>();
    private Running = false;

    private Deferred: Promise<void>;
    private Resolver: () => void;

    public constructor(private Concurrency: number = 1) {}

    public Add(...Tasks: IQueueItem<T>[]): this {
        const TasksLen = Tasks.length;

        for (let i = 0; i < TasksLen; i++) {
            const Task = Tasks[i];
            const Sign = Math.sign(Task.Priority);

            if (isNaN(Sign) || Math.sign(Sign) < 0) throw new Error('Invalid Argument Priority: Must be 0 or above!');
            else this.Queue.Insert(Task);
        }

        return this;
    }

    public async Start(): Promise<void> {
        if (!this.Running) {
            this.Deferred = new Promise(Resolve => (this.Resolver = Resolve));
            this.Running = true;
            this.Run();
        }

        return this.Deferred;
    }

    public Stop(): void {
        this.Running = false;
    }

    public get isRunning(): boolean {
        return this.Running;
    }

    private Run() {
        while (this.Running && this.Inflight < this.Concurrency && this.Queue.Count() > 0) {
            const { Task } = this.Queue.Dequeue();
            ++this.Inflight;

            Task().finally(() => {
                --this.Inflight;
                if (this.Queue.Count() === 0 && this.Inflight === 0) {
                    this.Running = false;
                    this.Resolver();
                } else this.Run();
            });
        }
    }
}
