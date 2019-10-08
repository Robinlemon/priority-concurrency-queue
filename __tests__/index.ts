import { AsyncQueue } from '../src';

describe('AsyncPQueue', () => {
    test('Should Construct Normally', () => {
        expect(() => new AsyncQueue()).not.toThrow();
    });
});
