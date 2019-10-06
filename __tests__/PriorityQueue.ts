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
        test('Should have Insert', () => {
            expect(new PriorityQueue().Insert).toBeDefined();
        });

        test('Should have Dequeue', () => {
            expect(new PriorityQueue().Dequeue).toBeDefined();
        });
    });

    test('Insertion Should Add By Priority Index', () => {
        const Queue = new PriorityQueue<number>();
        const Task1: IQueueItem<number> = {
            Priority: 1,
            Task: async () => 1,
        };
        const Task2: IQueueItem<number> = {
            Priority: 1,
            Task: async () => 1,
        };
        const Task3: IQueueItem<number> = {
            Priority: 2,
            Task: async () => 1,
        };

        Queue.Insert(Task1);
        Queue.Insert(Task3);
        expect(Queue.Count()).toBe(2);
        Queue.Insert(Task2);

        const Extracted: unknown[] = [];
        while (Queue.Count() > 0) Extracted.push(Queue.Dequeue());

        expect(JSON.stringify(Extracted)).toBe(JSON.stringify([Task1, Task2, Task3]));
    });

    test('Dequeue Should Work in Priority Order', () => {
        const Queue = new PriorityQueue<number>();
        const Iterations = 100;

        for (let i = 0; i < Iterations; i++)
            Queue.Insert({
                Priority: i,
                Task: async () => i,
            });

        const LastT: number = Iterations + 1;
        for (let i = 0; i < Iterations; i++) expect(Queue.Dequeue().Priority).toBeLessThan(LastT);

        expect(Queue.Count()).toBe(0);
    });
});
