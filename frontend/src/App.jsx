import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SortingPlayground from './components/SortingPlayground';
import ParallelExecution from './components/ParallelExecution';
import PerformanceAnalysis from './components/PerformanceAnalysis';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [backendStatus, setBackendStatus] = useState(null);

  // Poll backend health status on mount
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await checkBackendHealth();
      if (isMounted) setBackendStatus(status);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // Check every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* Main Dynamic View */}
      <main className="main-content">
        {activeTab === 'playground' && <SortingPlayground />}
        {activeTab === 'parallel' && <ParallelExecution />}
        {activeTab === 'performance' && <PerformanceAnalysis />}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Parallel Sorting Algorithm Visualizer</strong> — B.E. Computer Science & Engineering
          </div>
          <div>
            Subject: <strong style={{ color: 'var(--text-primary)' }}>Parallel Computing</strong> | Python Multiprocessing & React + Vite
          </div>
          <div>
            Designed for Academic Evaluation & Performance Benchmarking
          </div>
        </div>
      </footer>
    </div>
  );
}
