
import React from 'react';
import { useBubbleSort } from '../hooks/useBubbleSort';

const BUBBLE_SORT_CODE = [
  'function bubbleSort(arr) {',
  '  for (let i = 0; i < arr.length - 1; i++) {',
  '    let swapped = false;',
  '    for (let j = 0; j < arr.length - i - 1; j++) {',
  '      if (arr[j] > arr[j + 1]) {',
  '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];',
  '        swapped = true;',
  '      }',
  '    }',
  '    if (!swapped) break;',
  '  }',
  '  return arr;',
  '}',
];

const CodeExplanation: React.FC = () => {
  const { currentStep, isSorted } = useBubbleSort();
  
  const highlightedLine = isSorted ? BUBBLE_SORT_CODE.length - 1 : currentStep?.codeLine ?? -1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-sky-400">Algorithm Explanation</h3>
        <div className="space-y-4 text-gray-300">
          <p>
            Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.
          </p>
          <p>
            The algorithm gets its name because smaller elements "bubble" to the top of the list, while larger elements "sink" to the bottom.
          </p>
          <div>
            <h4 className="font-semibold text-gray-100">Time Complexity:</h4>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Worst Case:</strong> O(n²)</li>
              <li><strong>Average Case:</strong> O(n²)</li>
              <li><strong>Best Case:</strong> O(n)</li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold text-gray-100">Space Complexity:</h4>
            <p className="ml-4">O(1)</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg font-mono">
         <h3 className="text-xl font-semibold mb-4 text-sky-400 font-sans">Code Execution</h3>
        <pre className="text-sm">
          <code>
            {BUBBLE_SORT_CODE.map((line, index) => (
              <div
                key={index}
                className={`px-4 py-1 rounded transition-colors duration-200 ${
                  highlightedLine === index + 1 ? 'bg-sky-900/50 text-white' : 'text-gray-400'
                }`}
              >
                <span className="mr-4 select-none text-gray-600">{index + 1}</span>
                {line}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExplanation;
