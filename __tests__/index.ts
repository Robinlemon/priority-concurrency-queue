import { AsyncQueue } from '../src';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type CtorArgs = (typeof AsyncQueue extends new (...args: infer U) => any ? U : never)[0];

describe('AsyncQueue', () => {
    describe('Construction', () => {
        describe('Expected Arguments', () => {
            test.each([undefined, {}, { Concurrency: 10 }, { AutoStart: true }, { AutoStart: true, Concurrency: 10 }] as (Partial<CtorArgs> | undefined)[])(
                '%o',
                Options => {
                    expect(() => new AsyncQueue((Options as unknown) as CtorArgs)).not.toThrow();
                },
            );
        });

        describe('Concurrency', () => {
            test.each([0, -1, -Infinity, 'test', NaN, Infinity] as number[])('%s', Concurrency => {
                expect(() => new AsyncQueue({ Concurrency })).toThrow();
            });
        });

        describe('AutoStart', () => {
            test.each(([0, -1, -Infinity, 'test', NaN, Infinity] as unknown) as boolean[])('%s', AutoStart => {
                expect(() => new AsyncQueue({ AutoStart, Concurrency: 10 })).toThrow();
            });
        });
    });

    test('Should Execute Queue', async () => {
        const Queue = new AsyncQueue();
        const Mock = jest.fn();
        const Iter = 30;

        expect(Queue.isRunning).toBeFalsy();

        Queue.Add(Array.from({ length: Iter }, () => ({ Priority: 1, Task: async (): Promise<void> => Mock() })));
        Queue.Start();

        expect(Queue.isRunning).toBeTruthy();
        await Queue.Start();
        expect(Queue.isRunning).toBeFalsy();

        expect(Mock.mock.calls.length).toBe(30);
    });

    test('Should Stop Tasks', () => {
        const Queue = new AsyncQueue();
        const Mock = jest.fn();
        const Iter = 30;

        Queue.Add(Array.from({ length: Iter }, () => ({ Priority: 1, Task: async (): Promise<void> => Mock() })));
        expect(Queue.isRunning).toBeFalsy();

        Queue.Start();
        expect(Queue.isRunning).toBeTruthy();
        Queue.Stop();

        expect(Queue.isRunning).toBeFalsy();
        expect(Mock.mock.calls.length).toBeLessThan(Iter);
    });

    describe('#Add', () => {
        describe('Should throw on bad priority', () => {
            test.each([NaN, 'test', -1, -Infinity])('%s', async Arg => {
                expect(() => new AsyncQueue().Add({ Priority: (Arg as unknown) as number, Task: async () => undefined })).toThrow();
            });
        });
    });

    test('Should work concurrently', async () => {
        const Iter = 100;
        const TimeoutDuration = 10;

        const Queue = new AsyncQueue({ Concurrency: Iter });
        const Sleep = (ms: number): Promise<void> => new Promise((Resolve): NodeJS.Timeout => setTimeout(Resolve, ms));
        const Mock = jest.fn();

        const Time = process.hrtime();

        Queue.Add(
            Array.from({ length: Iter }, () => ({
                Priority: 1,
                Task: async (): Promise<void> => {
                    await Sleep(TimeoutDuration);
                    Mock();
                },
            })),
        );
        await Queue.Start();

        const Diff = process.hrtime(Time);

        expect(Queue.isRunning).toBeFalsy();
        expect(Mock.mock.calls.length).toBe(Iter);
        expect(Diff[0] * 1e3 + Diff[1] / 1e6).toBeLessThan(Iter * TimeoutDuration);
    });

    test('Should clear task queue', async () => {
        const Queue = new AsyncQueue({ Concurrency: 1 });

        for (let i = 0; i < 100; i++)
            Queue.Add({
                Priority: i % 10,
                Task: async () => {},
            });

        expect(Queue.Tasks).toBe(100);
        Queue.Clear();
        expect(Queue.Tasks).toBe(0);
    });

    describe('#ClearPriority', () => {
        test('Should clear the queue', async () => {
            const Queue = new AsyncQueue({ Concurrency: 1 });

            for (let i = 0; i < 100; i++)
                Queue.Add({
                    Priority: i % 10,
                    Task: async () => {},
                });

            expect(Queue.Tasks).toBe(100);
            Queue.ClearPriority(0);
            expect(Queue.Tasks).toBe(90);
        });
    });

    describe('#Clear', () => {
        test('Should not wait for inflight tasks', async () => {
            const Concurrency = 10;
            const Tasks = 100;
            const Queue = new AsyncQueue({ Concurrency });
            let Called = 0;

            for (let i = 0; i < Tasks; i++)
                Queue.Add({
                    Priority: i % 10,
                    Task: async () => {
                        await new Promise(r => setTimeout(r, 10000));
                        ++Called;
                    },
                });

            expect(Queue.Tasks).toBe(Tasks);
            Queue.Start();
            Queue.Clear();
            expect(Called).toBeLessThan(Concurrency);
            expect(Queue.Tasks).toBe(0);
        });

        test('Should wait for inflight tasks', async () => {
            const Concurrency = 10;
            const Queue = new AsyncQueue({ Concurrency });
            let Called = 0;

            for (let i = 0; i < 100; i++)
                Queue.Add({
                    Priority: i % 10,
                    Task: async () => {
                        ++Called;
                    },
                });
            expect(Queue.Tasks).toBe(100);
            Queue.Start();
            await Queue.Clear(true);
            expect(Called).toBe(Concurrency);
            expect(Queue.Tasks).toBe(0);
        });
    });

    test('AutoStart should auto handle new tasks', async () => {
        const Concurrency = 10;
        const Queue = new AsyncQueue({ AutoStart: true, Concurrency });
        let Called = 0;

        for (let i = 0; i < Concurrency; i++)
            Queue.Add({
                Priority: 1,
                Task: async () => {
                    ++Called;
                },
            });

        expect(Queue.isRunning).toBeTruthy();
        await Queue.Start();
        expect(Called).toBe(Concurrency);
        expect(Queue.Tasks).toBe(0);
    });
});
