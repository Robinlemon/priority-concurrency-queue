import { AsyncConcurrencyEngine } from '../src/Classes/AsyncConcurrencyEngine';

describe('AsyncConcurrencyEngine', () => {
    test('Should Construct Normally', () => {
        expect(() => new AsyncConcurrencyEngine()).not.toThrow();
    });

    test('Should Execute Queue', async () => {
        const Queue = new AsyncConcurrencyEngine();
        const Mock = jest.fn();
        const Iter = 30;

        expect(Queue.isRunning).toBeFalsy();

        Queue.Add(...Array.from({ length: Iter }, () => ({ Priority: 1, Task: async () => Mock() })));

        Queue.Start();
        expect(Queue.isRunning).toBeTruthy();
        await Queue.Start();
        expect(Queue.isRunning).toBeFalsy();

        expect(Mock.mock.calls.length).toBe(30);
    });

    test('Should Stop Tasks', () => {
        const Queue = new AsyncConcurrencyEngine();
        const Mock = jest.fn();
        const Iter = 30;

        Queue.Add(...Array.from({ length: Iter }, () => ({ Priority: 1, Task: async () => Mock() })));
        expect(Queue.isRunning).toBeFalsy();

        Queue.Start();
        expect(Queue.isRunning).toBeTruthy();
        Queue.Stop();

        expect(Queue.isRunning).toBeFalsy();
        expect(Mock.mock.calls.length).toBeLessThan(Iter);
    });

    test.each([NaN, 'test', -1, -Infinity])('Should Throw on Bad Priority: %s', async Arg => {
        expect(() => new AsyncConcurrencyEngine().Add({ Priority: (Arg as unknown) as number, Task: async () => undefined })).toThrow();
    });

    test('Should Work Concurrently', async () => {
        const Iter = 100;
        const TimeoutDuration = 10;

        const Queue = new AsyncConcurrencyEngine(Iter);
        const Sleep = (ms: number) => new Promise(Resolve => setTimeout(Resolve, ms));
        const Mock = jest.fn();

        const Time = process.hrtime();

        Queue.Add(
            ...Array.from({ length: Iter }, () => ({
                Priority: 1,
                Task: async () => {
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
});
