import React from 'react';
import { Layers, Play, Cpu, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const isOnline = backendStatus?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand section */}
        <div className="brand-section">
          <div className="brand-icon">
            <Layers size={22} />
          </div>
          <div className="brand-titles">
            <h1>
              Parallel Sorting Visualizer
              <span className="academic-badge">B.E. CSE Project</span>
            </h1>
            <p className="brand-subtitle">
              Parallel Computing & Multiprocessing Performance Demonstration
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            id="tab-playground"
            className={`nav-tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
            onClick={() => setActiveTab('playground')}
          >
            <Play size={16} />
            Sorting Playground
          </button>

          <button
            id="tab-parallel"
            className={`nav-tab-btn ${activeTab === 'parallel' ? 'active' : ''}`}
            onClick={() => setActiveTab('parallel')}
          >
            <Cpu size={16} />
            Parallel Execution
          </button>

          <button
            id="tab-performance"
            className={`nav-tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <TrendingUp size={16} />
            Performance Analysis
          </button>
        </nav>

        {/* Backend Status indicator */}
        <div className="status-pill" title={backendStatus?.message || 'Flask Multiprocessing API'}>
          <span className={`status-dot ${isOnline ? 'online' : ''}`} />
          <span>
            {isOnline
              ? `Backend Active (${backendStatus.cpu_count} Cores)`
              : 'Connecting Backend...'}
          </span>
        </div>
      </div>
    </header>
  );
}
