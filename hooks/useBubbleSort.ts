import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Bar, BarState, BubbleSortStep } from '../types';
import { bubbleSortGenerator } from '../services/sortingService';
import { AudioService } from '../services/audioService';

const DEFAULT_ARRAY_SIZE = 10;
const DEFAULT_SPEED = 3;

// Maps speed level (1-5) to delay in milliseconds
const getDelayFromSpeed = (speed: number) => {
  return [500, 250, 100, 50, 25][speed - 1];
};

interface BubbleSortContextType {
  array: Bar[];
  isSorting: boolean;
  isSorted: boolean;
  isPaused: boolean;
  currentStep: BubbleSortStep | null;
  arraySize: number;
  speed: number;
  swapCount: number;
  startSorting: () => void;
  pauseSorting: () => void;
  resumeSorting: () => void;
  reset: () => void;
  setArraySize: (size: number) => void;
  setSpeed: (speed: number) => void;
  generateNewArray: () => void;
}

const BubbleSortContext = createContext<BubbleSortContextType | undefined>(undefined);

let nextId = 0;
const createRandomArray = (size: number): Bar[] => {
  return Array.from({ length: size }, () => ({
    id: nextId++,
    value: Math.floor(Math.random() * 90) + 10,
    state: BarState.Default,
  }));
};

export const BubbleSortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [initialArray, setInitialArray] = useState<Bar[]>(() => createRandomArray(arraySize));
  const [array, setArray] = useState<Bar[]>(initialArray);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<BubbleSortStep | null>(null);
  const [swapCount, setSwapCount] = useState(0);

  const sortGenerator = useRef<Generator<BubbleSortStep> | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const animationDelay = useRef(getDelayFromSpeed(DEFAULT_SPEED));
  const audioService = useRef<AudioService | null>(null);
  const completionTimeouts = useRef<number[]>([]);

  const cleanupTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const cleanupCompletionAnimation = () => {
    completionTimeouts.current.forEach(clearTimeout);
    completionTimeouts.current = [];
  };

  const generateNewArray = useCallback(() => {
    cleanupTimeout();
    cleanupCompletionAnimation();
    setIsSorting(false);
    setIsSorted(false);
    setIsPaused(false);
    setCurrentStep(null);
    setSwapCount(0);
    const newArr = createRandomArray(arraySize);
    setInitialArray(newArr);
    setArray(newArr);
  }, [arraySize]);
  
  // Initialize with the default size
  useEffect(() => {
    generateNewArray();
  }, [arraySize, generateNewArray]);


  const reset = useCallback(() => {
    cleanupTimeout();
    cleanupCompletionAnimation();
    setIsSorting(false);
    setIsSorted(false);
    setIsPaused(false);
    setCurrentStep(null);
    setSwapCount(0);
    sortGenerator.current = null;
    setArray(initialArray.map(item => ({ ...item, state: BarState.Default })));
  }, [initialArray]);

  const runNextStep = useCallback(() => {
    if (!sortGenerator.current) return;

    const next = sortGenerator.current.next();
    if (!next.done) {
      const step = next.value;
      setCurrentStep(step);
      setArray(step.array);
      setSwapCount(step.swapCount);

      if (audioService.current) {
        if (step.playSound === 'swap') {
          audioService.current.playSwapSound();
        } else if (step.playSound === 'passComplete') {
          audioService.current.playPassCompleteSound();
        }
      }

      timeoutRef.current = window.setTimeout(runNextStep, animationDelay.current);
    } else {
      setIsSorting(false);
      setIsSorted(true);
      setCurrentStep(null);
      // Ensure final sorted state is shown
      setArray(prev => prev.map(bar => ({ ...bar, state: BarState.Sorted })));
    }
  }, []);

  const startSorting = useCallback(() => {
    if (isSorting || isSorted) return;

    if (!audioService.current) {
      audioService.current = new AudioService();
    }
    audioService.current.init();
    
    animationDelay.current = getDelayFromSpeed(speed);
    setIsSorting(true);
    setIsPaused(false);
    setSwapCount(0);
    sortGenerator.current = bubbleSortGenerator(array);
    runNextStep();
  }, [isSorting, isSorted, array, runNextStep, speed]);
  
  const pauseSorting = useCallback(() => {
    if (!isSorting || isPaused) return;
    cleanupTimeout();
    setIsPaused(true);
  }, [isSorting, isPaused]);

  const resumeSorting = useCallback(() => {
    if (!isSorting || !isPaused) return;
    setIsPaused(false);
    runNextStep();
  }, [isSorting, isPaused, runNextStep]);

  // Final "sorted" animation
  useEffect(() => {
    if (isSorted) {
      const runCompletionAnimation = () => {
        if (!audioService.current) return;

        const timeouts: number[] = [];
        for (let i = 0; i < array.length; i++) {
          const timeoutId = window.setTimeout(() => {
            setArray(prev => {
              const newArray = [...prev];
              if (i > 0) newArray[i - 1] = { ...newArray[i - 1], state: BarState.Sorted };
              newArray[i] = { ...newArray[i], state: BarState.FinalHighlight };
              return newArray;
            });
            audioService.current?.playSortedSound(i, array.length);
          }, i * 75);
          timeouts.push(timeoutId);
        }

        const finalTimeoutId = window.setTimeout(() => {
          setArray(prev => prev.map(bar => ({ ...bar, state: BarState.Sorted })));
        }, array.length * 75 + 75);
        timeouts.push(finalTimeoutId);

        completionTimeouts.current = timeouts;
      };

      runCompletionAnimation();
    }
    return () => {
      cleanupCompletionAnimation();
    };
  }, [isSorted, array.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimeout();
      cleanupCompletionAnimation();
    };
  }, []);

  const value = {
    array,
    isSorting,
    isSorted,
    isPaused,
    currentStep,
    arraySize,
    speed,
    swapCount,
    startSorting,
    pauseSorting,
    resumeSorting,
    reset,
    setArraySize,
    setSpeed,
    generateNewArray,
  };

  return React.createElement(BubbleSortContext.Provider, { value }, children);
};

export const useBubbleSort = (): BubbleSortContextType => {
  const context = useContext(BubbleSortContext);
  if (context === undefined) {
    throw new Error('useBubbleSort must be used within a BubbleSortProvider');
  }
  return context;
};
