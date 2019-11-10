export interface IQueueItem {
    Task: () => void | Promise<void>;
    Priority: number;
}

export class PriorityQueue {
    private Length = 0;
    private List: IQueueItem[] = [];

    public Insert(Task: IQueueItem): void {
        let Low = 0;
        let High = this.List.length;

        while (Low < High) {
            const Mid = (Low + High) >>> 1;
            if (this.List[Mid].Priority > Task.Priority) Low = Mid + 1;
            else High = Mid;
        }

        while (Low < this.Length && Task.Priority === this.List[Low].Priority) Low++;

        this.List.splice(Low, 0, Task);
        this.Length++;
    }

    public Dequeue(): IQueueItem | undefined {
        return this.Length--, this.List.shift();
    }

    public Count = (): number => this.Length;
}
