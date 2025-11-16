
import React from 'react';
import { useBubbleSort } from '../hooks/useBubbleSort';
import { Bar, BarState } from '../types';

const BUBBLE_SIZE = 64; // Corresponds to w-16, h-16
const BUBBLE_GAP = 16;  // Corresponds to gap-4

const Bubble: React.FC<{ bubble: Bar; index: number }> = ({ bubble, index }) => {
  const getBubbleStyle = (state: BarState) => {
    switch (state) {
      case BarState.Comparing:
        return 'bg-yellow-500 text-black ring-4 ring-yellow-300 scale-110';
      case BarState.Swapping:
        return 'bg-red-600 text-white ring-4 ring-red-400 scale-110';
      case BarState.Sorted:
        return 'bg-green-600 text-white';
      case BarState.FinalHighlight:
        return 'bg-teal-400 text-black ring-4 ring-teal-200 scale-125';
      case BarState.Default:
      default:
        return 'bg-sky-600 text-white';
    }
  };

  const position = index * (BUBBLE_SIZE + BUBBLE_GAP);

  return (
    <div
      className={`absolute rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl transition-all duration-300 ease-in-out ${getBubbleStyle(bubble.state)}`}
      style={{
        transform: `translateX(${position}px)`,
      }}
      aria-label={`Value ${bubble.value}`}
    >
      <span>{bubble.value}</span>
    </div>
  );
};

const BubbleSortVisualizer: React.FC = () => {
  const { array } = useBubbleSort();
  
  const totalWidth = array.length * BUBBLE_SIZE + (array.length > 0 ? (array.length - 1) * BUBBLE_GAP : 0);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner min-h-[400px] h-full flex justify-center items-center overflow-x-auto">
      <div className="relative" style={{ width: totalWidth, height: BUBBLE_SIZE }}>
        {array.map((bubble, index) => (
          <Bubble key={bubble.id} bubble={bubble} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;