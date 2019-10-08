export interface IQueueItem<T> {
    Task: () => Promise<T>;
    Priority: number;
}

export class PriorityQueue<T = unknown> {
    private Length = 0;
    private List: IQueueItem<T>[] = [];

    public Insert(Task: IQueueItem<T>): void {
        let InsertionIndex = 0;

        while (InsertionIndex < this.Length && Task.Priority <= this.List[InsertionIndex].Priority) InsertionIndex++;

        this.List.splice(InsertionIndex, 0, Task);
        this.Length++;
    }

    public Dequeue(): IQueueItem<T> {
        return this.Length--, this.List.shift();
    }

    public Count = (): number => this.Length;
}
