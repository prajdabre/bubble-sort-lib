
import React from 'react';
import { BubbleSortProvider } from './hooks/useBubbleSort';
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import Controls from './components/Controls';
import CodeExplanation from './components/CodeExplanation';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <BubbleSortProvider>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col gap-8">
          <Controls />
          <BubbleSortVisualizer />
          <CodeExplanation />
        </main>
        <Footer />
      </div>
    </BubbleSortProvider>
  );
};

export default App;