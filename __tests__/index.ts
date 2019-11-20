import { AsyncQueue } from '../src';

describe('AsyncQueue', () => {
    test('Should Construct Normally', () => {
        expect(() => new AsyncQueue()).not.toThrow();
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

    test.each([NaN, 'test', -1, -Infinity])('Should Throw on Bad Priority: %s', async Arg => {
        expect(() => new AsyncQueue().Add({ Priority: (Arg as unknown) as number, Task: async () => undefined })).toThrow();
    });

    test('Should Work Concurrently', async () => {
        const Iter = 100;
        const TimeoutDuration = 10;

        const Queue = new AsyncQueue(Iter);
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

    test('Should Clear Task Queue', async () => {
        const Queue = new AsyncQueue(1);

        for (let i = 0; i < 100; i++)
            Queue.Add({
                Priority: i % 10,
                Task: async () => {},
            });
        expect(Queue.Tasks).toBe(100);
        Queue.Clear();
        expect(Queue.Tasks).toBe(0);
    });

    test('Should Clear Task Queue At Priority', async () => {
        const Queue = new AsyncQueue(1);

        for (let i = 0; i < 100; i++)
            Queue.Add({
                Priority: i % 10,
                Task: async () => {},
            });
        expect(Queue.Tasks).toBe(100);
        Queue.ClearPriority(0);
        expect(Queue.Tasks).toBe(90);
    });

    test('Should Wait for Inflight when Clear(true)', async () => {
        const Concurrecy = 10;
        const Queue = new AsyncQueue(Concurrecy);
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
        expect(Called).toBe(Concurrecy);
        expect(Queue.Tasks).toBe(0);
    });
});
