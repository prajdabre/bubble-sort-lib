import { Bar, BarState, BubbleSortStep } from '../types';

function createInitialStep(array: Bar[]): BubbleSortStep {
  return {
    array: JSON.parse(JSON.stringify(array)),
    comparing: [],
    swapped: false,
    sortedIndex: null,
    codeLine: 1,
    swapCount: 0,
  };
}

export function* bubbleSortGenerator(initialArray: Bar[]): Generator<BubbleSortStep> {
  const arr = JSON.parse(JSON.stringify(initialArray));
  const n = arr.length;
  let i, j;
  let swapCount = 0;

  yield createInitialStep(arr);

  for (i = 0; i < n - 1; i++) {
    yield {
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      swapped: false,
      sortedIndex: n - i,
      codeLine: 2,
      swapCount,
    };

    let swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      yield {
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [j, j + 1],
        swapped: false,
        sortedIndex: n - i,
        codeLine: 4,
        swapCount,
      };
      arr[j].state = BarState.Comparing;
      arr[j + 1].state = BarState.Comparing;

      if (arr[j].value > arr[j + 1].value) {
        yield {
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [j, j + 1],
          swapped: false,
          sortedIndex: n - i,
          codeLine: 5,
          swapCount,
        };
        
        swapped = true;
        swapCount++;
        arr[j].state = BarState.Swapping;
        arr[j + 1].state = BarState.Swapping;
        yield {
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [j, j + 1],
          swapped: true,
          sortedIndex: n - i,
          codeLine: 6,
          swapCount,
        };

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        yield {
          array: JSON.parse(JSON.stringify(arr)),
          comparing: [j, j + 1],
          swapped: true,
          sortedIndex: n - i,
          codeLine: 6,
          swapCount,
          playSound: 'swap',
        };
      }
      
      arr[j].state = BarState.Default;
      if(j+1 < n - i - 1) {
          arr[j + 1].state = BarState.Default;
      }
    }
    arr[n - i - 1].state = BarState.Sorted;

    yield {
      array: JSON.parse(JSON.stringify(arr)),
      comparing: [],
      swapped: false,
      sortedIndex: n - i,
      codeLine: 9,
      swapCount,
      playSound: 'passComplete'
    };

    if (!swapped) {
      yield {
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [],
        swapped: false,
        sortedIndex: n - i,
        codeLine: 9,
        swapCount,
      };
      
      // Mark all remaining as sorted
      for(let k = 0; k < n - i; k++) {
          arr[k].state = BarState.Sorted;
      }
      
      yield {
        array: JSON.parse(JSON.stringify(arr)),
        comparing: [],
        swapped: false,
        sortedIndex: 0,
        codeLine: 10,
        swapCount,
      };
      break;
    }
  }

  // Final state: all sorted
  if (arr.length > 0) {
    arr.forEach(bar => bar.state = BarState.Sorted);
  }
  yield {
    array: JSON.parse(JSON.stringify(arr)),
    comparing: [],
    swapped: false,
    sortedIndex: 0,
    codeLine: 13,
    swapCount,
  };
}

// =================================================================
// --- Self-testing Suite ---
// This is not run in the application but serves as a verifiable
// test suite for the sorting algorithm's logic.
// =================================================================

function runBubbleSortTests() {
  const testCases: { name: string; fn: () => void }[] = [];
  
  function it(name: string, fn: () => void) {
    testCases.push({ name, fn });
  }

  function assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  function assertDeepEqual(a: any, b: any, message: string) {
      if(JSON.stringify(a) !== JSON.stringify(b)) {
          throw new Error(`${message}. Expected ${JSON.stringify(b)}, but got ${JSON.stringify(a)}`);
      }
  }

  const createBarArray = (values: number[]): Bar[] =>
    values.map((value, id) => ({ id, value, state: BarState.Default }));
  
  const runGeneratorToEnd = (generator: Generator<BubbleSortStep>): BubbleSortStep => {
    let lastStep: BubbleSortStep | undefined;
    for (const step of generator) {
      lastStep = step;
    }
    if (!lastStep) {
        throw new Error("Generator produced no steps.");
    }
    return lastStep;
  }

  // Test cases
  it('should correctly sort a basic unsorted array', () => {
    const arr = createBarArray([3, 1, 2]);
    const lastStep = runGeneratorToEnd(bubbleSortGenerator(arr));
    const sortedValues = lastStep.array.map(b => b.value);
    assertDeepEqual(sortedValues, [1, 2, 3], 'Array should be sorted');
    assert(lastStep.swapCount === 2, `Expected 2 swaps, but got ${lastStep.swapCount}`);
  });

  it('should handle an empty array', () => {
    const arr = createBarArray([]);
    const lastStep = runGeneratorToEnd(bubbleSortGenerator(arr));
    assertDeepEqual(lastStep.array, [], 'Array should remain empty');
    assert(lastStep.swapCount === 0, 'Swap count should be 0 for an empty array');
  });

  it('should handle an already sorted array', () => {
    const arr = createBarArray([10, 20, 30, 40]);
    const lastStep = runGeneratorToEnd(bubbleSortGenerator(arr));
    const sortedValues = lastStep.array.map(b => b.value);
    assertDeepEqual(sortedValues, [10, 20, 30, 40], 'Array should remain sorted');
    assert(lastStep.swapCount === 0, 'Swap count should be 0 for a sorted array');
  });

  it('should correctly sort a reverse-sorted array', () => {
    const arr = createBarArray([5, 4, 3, 2, 1]);
    const lastStep = runGeneratorToEnd(bubbleSortGenerator(arr));
    const sortedValues = lastStep.array.map(b => b.value);
    assertDeepEqual(sortedValues, [1, 2, 3, 4, 5], 'Array should be sorted');
    assert(lastStep.swapCount === 10, `Expected 10 swaps, but got ${lastStep.swapCount}`);
  });

  it('should handle an array with duplicate elements', () => {
    const arr = createBarArray([5, 2, 8, 2, 5]);
    const lastStep = runGeneratorToEnd(bubbleSortGenerator(arr));
    const sortedValues = lastStep.array.map(b => b.value);
    assertDeepEqual(sortedValues, [2, 2, 5, 5, 8], 'Array with duplicates should be sorted');
  });

  // Run all tests
  console.log('--- Running Bubble Sort Tests ---');
  let passed = 0;
  testCases.forEach(t => {
    try {
      t.fn();
      console.log(`✅ PASS: ${t.name}`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL: ${t.name}`);
      console.error(e);
    }
  });
  console.log(`--- Test Run Complete: ${passed}/${testCases.length} passed ---`);
}

// To run tests, you could uncomment the following line and check the browser console.
// runBubbleSortTests();
