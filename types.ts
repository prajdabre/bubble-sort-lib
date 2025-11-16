export enum BarState {
  Default,
  Comparing,
  Swapping,
  Sorted,
  FinalHighlight,
}

export interface Bar {
  id: number;
  value: number;
  state: BarState;
}

export interface BubbleSortStep {
  array: Bar[];
  comparing: [number, number] | [];
  swapped: boolean;
  sortedIndex: number | null;
  codeLine: number;
  swapCount: number;
  playSound?: 'swap' | 'passComplete';
}