import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Predictor from './components/Predictor';
import ClassificationReport from './components/ClassificationReport';
import EdaDashboard from './components/EdaDashboard';
import BatchAnalysis from './components/BatchAnalysis';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'predictor' && <Predictor />}
          {activeTab === 'report' && <ClassificationReport />}
          {activeTab === 'eda' && <EdaDashboard />}
          {activeTab === 'batch' && <BatchAnalysis />}
        </main>
      </div>

      <Footer />
    </div>
  );
}
