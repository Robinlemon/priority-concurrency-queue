export interface IQueueItem {
    Task: () => Promise<void>;
    Priority: number;
}

export class PriorityQueue {
    private Length = 0;
    private List: IQueueItem[] = [];

    public Insert(Task: IQueueItem): void {
        let InsertionIndex = 0;

        while (InsertionIndex < this.Length && Task.Priority <= this.List[InsertionIndex].Priority) InsertionIndex++;

        this.List.splice(InsertionIndex, 0, Task);
        this.Length++;
    }

    public Dequeue(): IQueueItem | undefined {
        return this.Length--, this.List.shift();
    }

    public Count = (): number => this.Length;
}
