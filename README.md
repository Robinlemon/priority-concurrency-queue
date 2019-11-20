<p align="center">
  <h3 align="center">Priority Concurrency Queue</h3>
  <p align="center">A fast promise queue with priority and concurrency options.</p>

  <p align="center">
    <a href="https://www.npmjs.com/package/@robinlemon/priority-concurrency-queue"><img src="https://img.shields.io/npm/v/@robinlemon/priority-concurrency-queue.svg" alt="NPM Package" /></a>
    <a href="https://travis-ci.com/Robinlemon/priority-concurrency-queue"><img src="https://travis-ci.com/Robinlemon/priority-concurrency-queue.svg?branch=master" alt="Build Status" /></a>
    <a href="https://codecov.io/gh/Robinlemon/priority-concurrency-queue"><img src="https://codecov.io/gh/Robinlemon/priority-concurrency-queue/branch/master/graph/badge.svg" alt="Coverage Status" /></a>
    <a href="https://github.com/codechecks/typecov"><img src="https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https://raw.githubusercontent.com/Robinlemon/priority-concurrency-queue/master/package.json" alt="TypeCov" /></a>
    <a href="https://codechecks.io"><img src="https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-green.svg?sanitize=true" alt="Codechecks" /></a>
  </p>
</p>

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @robinlemon/priority-concurrency-queue
```

## Usage

Sorted highest priority first, then by time added for those of the same priority.

Short Example:

```ts
import { AsyncQueue, IQueueItem } from '@robinlemon/priority-concurrency-queue';

await(new AsyncQueue(10).Add({
    Task: async () => {};
    Priority: 1;
}).Start());

console.log('Tasks Complete!');
```

Long Example:

```ts
import { AsyncQueue, IQueueItem } from '@robinlemon/priority-concurrency-queue';

const Concurrency = 10;
const Queue = new AsyncQueue(Concurrency);
const Item: IQueueItem = {
    Task: async () => {};
    Priority: 1;
};

Queue.Add(Item);

console.log(Queue.isRunning); // false
Queue.Start(); // start the queue
console.log(Queue.isRunning); // true
await Queue.Start(); // wait until complete
console.log(Queue.isRunning); // false

/**
 *  Since the concurrency is 10,
 *  only 10 tasks will be processed
 *  and the rest will be idle.
 */
for(let i = 0; i < 100; i++) Queue.Add(Item);
Queue.Start();
Queue.Stop();

console.log('Tasks Complete!');
```

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE.md)
