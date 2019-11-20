import { IQueueItem, PriorityQueue } from '../src/Classes/PriorityQueue';

describe('PriorityQueue', () => {
    describe('Should Construct Normally', () => {
        test("Shouldn't Throw on Construction", () => {
            expect(() => new PriorityQueue()).not.toThrow();
        });

        test('Should Have 0 Length', () => {
            expect(new PriorityQueue().Count()).toBe(0);
        });
    });

    describe('Valid Methods', () => {
        test('Insertion Should Add By Priority Index', () => {
            const Queue = new PriorityQueue();

            const Task1: IQueueItem = {
                Priority: 1,
                Task: async () => {},
            };
            const Task2: IQueueItem = {
                Priority: 1,
                Task: async () => {},
            };
            const Task3: IQueueItem = {
                Priority: 2,
                Task: async () => {},
            };

            Queue.Insert(Task1);
            Queue.Insert(Task3);
            expect(Queue.Count()).toBe(2);
            Queue.Insert(Task2);

            const Extracted: IQueueItem[] = [];
            while (Queue.Count() > 0) Extracted.push(Queue.Dequeue()!);

            expect(JSON.stringify(Extracted)).toBe(JSON.stringify([Task3, Task2, Task1]));
        });

        test('Dequeue Should Work in Priority Order', () => {
            const Queue = new PriorityQueue();
            const Iterations = 100;

            for (let i = 0; i < Iterations; i++)
                Queue.Insert({
                    Priority: i,
                    Task: async () => {},
                });

            const LastT: number = Iterations + 1;
            for (let i = 0; i < Iterations; i++) expect(Queue.Dequeue()!.Priority).toBeLessThan(LastT);

            expect(Queue.Count()).toBe(0);
        });

        test('RemoveAt Should filter Tasks', () => {
            const Queue = new PriorityQueue();
            const Iterations = 100;

            for (let i = 0; i < Iterations; i++)
                Queue.Insert({
                    Priority: i % 10,
                    Task: async () => {},
                });

            Queue.RemoveAt(0);

            expect(Queue.Count()).toBe(90);
        });
    });
});
