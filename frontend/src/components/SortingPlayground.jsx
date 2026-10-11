import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  BarChart2,
  Clock,
  ArrowRightLeft,
  Sliders,
  Info,
  CheckCircle2,
  Shuffle,
  Gauge
} from 'lucide-react';
import ArrayVisualizer from './ArrayVisualizer';
import TeachingPanel from './TeachingPanel';
import StatsCard from './StatsCard';
import { generateSortingSteps } from '../algorithms/sortingGenerators';

const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', desc: 'Compares adjacent elements and bubbles largest to the right.' },
  { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)', desc: 'Scans for minimum element in unsorted section and swaps into place.' },
  { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', desc: 'Extracts Key and shifts larger elements rightward to insert into gap.' },
  { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)', desc: 'Recursively divides into halves, then merges sorted subarrays.' },
  { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)', desc: 'Selects pivot, partitions elements into ≤ and > zones, places pivot.' },
  { id: 'parallel_merge', name: 'Parallel Merge Sort', complexity: 'O((n/P) log(n/P) + n log P)', desc: 'Distributes chunks to concurrent worker processes, then merges tree.' }
];

const PRESETS = [
  { id: 'example', label: 'College Sample: 8, 3, 6, 1, 9, 2, 5, 4' },
  { id: 'random', label: 'Random Array' },
  { id: 'reversed', label: 'Reverse Sorted (Worst Case)' },
  { id: 'nearly', label: 'Nearly Sorted' },
  { id: 'duplicates', label: 'Array with Duplicates' },
  { id: 'negatives', label: 'Array with Negative Numbers' }
];

const SPEED_PRESETS = [
  { label: 'Very Slow (2.5s)', delay: 2500 },
  { label: 'Slow (1.5s)', delay: 1500 },
  { label: 'Normal (0.8s)', delay: 800 },
  { label: 'Fast (0.3s)', delay: 300 }
];

export default function SortingPlayground() {
  // Input State
  const [arrayInput, setArrayInput] = useState('8, 3, 6, 1, 9, 2, 5, 4');
  const [currentArray, setCurrentArray] = useState([8, 3, 6, 1, 9, 2, 5, 4]);
  const [initialArray, setInitialArray] = useState([8, 3, 6, 1, 9, 2, 5, 4]);
  const [arraySize, setArraySize] = useState(8);
  const [selectedAlgo, setSelectedAlgo] = useState('bubble'); // Bubble Sort by default
  const [workerCount, setWorkerCount] = useState(4);
  const [delayMs, setDelayMs] = useState(1500); // Default Slow (1.5s) for teaching

  // Playback & State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Active Visual Highlights & Algorithm Specific State
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedSet, setSortedSet] = useState(new Set());
  const [stepMeta, setStepMeta] = useState({});

  // Teaching Explanation State
  const [teachingInfo, setTeachingInfo] = useState({
    operation: 'Ready to sort',
    elementsInvolved: 'Array: [8, 3, 6, 1, 9, 2, 5, 4]',
    why: 'Click "Start Sorting" for automatic playback, or use "Next Step" to step through one operation at a time for your lecture.',
    whatChanged: 'Initial array loaded.',
    whatNext: 'Begin sorting with the selected algorithm.'
  });

  // Step Progress
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Live Metrics
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Engine Refs
  const stepsRef = useRef([]);
  const stepIndexRef = useRef(0);
  const timerRef = useRef(null);
  const runTickRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedOffsetRef = useRef(0);
  const delayRef = useRef(delayMs);

  // Synchronize delayRef with state
  useEffect(() => {
    delayRef.current = delayMs;
  }, [delayMs]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Parse helper
  const parseInputArray = useCallback((text) => {
    const parsed = text
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map((x) => {
        const num = parseInt(x, 10);
        if (isNaN(num)) throw new Error(`"${x}" is not a valid integer`);
        return num;
      });

    if (parsed.length === 0) throw new Error('Array cannot be empty');
    if (parsed.length > 80) throw new Error('Maximum 80 elements allowed for visualization');
    return parsed;
  }, []);

  // Stop running animation
  const stopAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Render a specific step snapshot
  const renderStep = useCallback((step, stepNum, total) => {
    if (!step) return;

    setCurrentArray(step.array);
    setComparing(step.comparing || []);
    setSwapping(step.swapping || []);
    setSortedSet(step.sorted ? new Set(step.sorted) : new Set());
    setStepMeta(step);

    setTeachingInfo({
      operation: step.operation || 'Processing',
      elementsInvolved: step.elementsInvolved || '—',
      why: step.why || '—',
      whatChanged: step.whatChanged || '—',
      whatNext: step.whatNext || '—'
    });

    setCurrentStep(stepNum);
    setProgressPercent(Math.round((stepNum / total) * 100));
  }, []);

  // Reset visualization
  const handleReset = useCallback(() => {
    stopAnimation();
    stepIndexRef.current = 0;
    stepsRef.current = [];
    setCurrentArray([...initialArray]);
    setComparing([]);
    setSwapping([]);
    setSortedSet(new Set());
    setStepMeta({});
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    elapsedOffsetRef.current = 0;
    setCurrentStep(0);
    setTotalSteps(0);
    setProgressPercent(0);
    setIsPaused(false);
    setIsFinished(false);
    setTeachingInfo({
      operation: 'Reset to Initial State',
      elementsInvolved: `Array: [${initialArray.join(', ')}]`,
      why: 'Animation reset to the original input array.',
      whatChanged: 'Restored original array order.',
      whatNext: 'Press "Start Sorting" or "Next Step" to begin.'
    });
  }, [initialArray, stopAnimation]);

  // Step tick loop implementation
  runTickRef.current = () => {
    const steps = stepsRef.current;
    const idx = stepIndexRef.current;

    if (!steps || idx >= steps.length) {
      // Finished all steps
      stopAnimation();
      setIsFinished(true);
      setComparing([]);
      setSwapping([]);
      setSortedSet(new Set(Array.from({ length: currentArray.length }, (_, i) => i)));
      setProgressPercent(100);
      setTeachingInfo({
        operation: 'Sorting Completed Successfully',
        elementsInvolved: `Final Array: [${currentArray.join(', ')}]`,
        why: 'All algorithm steps finished. The array is strictly verified in ascending order.',
        whatChanged: 'Entire array locked as sorted (Green).',
        whatNext: 'Algorithm complete. You can reset or test another algorithm.'
      });
      return;
    }

    const step = steps[idx];
    renderStep(step, idx + 1, steps.length);

    if (startTimeRef.current) {
      setElapsedTime(elapsedOffsetRef.current + Math.round(performance.now() - startTimeRef.current));
    }

    stepIndexRef.current = idx + 1;

    // Schedule next step with exact delay
    timerRef.current = setTimeout(() => {
      if (runTickRef.current) runTickRef.current();
    }, delayRef.current);
  };

  // START / AUTO-PLAY
  const handleStart = () => {
    stopAnimation();

    let targetArray;
    try {
      targetArray = parseInputArray(arrayInput);
      setInitialArray(targetArray);
    } catch (err) {
      alert(`Invalid array format: ${err.message}`);
      return;
    }

    // Pre-generate deterministic teaching steps
    const steps = generateSortingSteps(selectedAlgo, targetArray, workerCount);
    stepsRef.current = steps;
    stepIndexRef.current = 0;
    setTotalSteps(steps.length);
    setCurrentStep(0);
    setProgressPercent(0);

    // Reset metrics
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    elapsedOffsetRef.current = 0;
    startTimeRef.current = performance.now();

    setIsPlaying(true);
    setIsPaused(false);
    setIsFinished(false);

    // Render first step immediately, then schedule tick
    if (steps.length > 0) {
      renderStep(steps[0], 1, steps.length);
      stepIndexRef.current = 1;
    }

    timerRef.current = setTimeout(() => {
      if (runTickRef.current) runTickRef.current();
    }, delayRef.current);
  };

  // PAUSE
  const handlePause = () => {
    if (!isPlaying) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (startTimeRef.current) {
      elapsedOffsetRef.current += Math.round(performance.now() - startTimeRef.current);
    }
    setIsPlaying(false);
    setIsPaused(true);
  };

  // RESUME
  const handleResume = () => {
    if (!isPaused || stepsRef.current.length === 0) return;
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = performance.now();
    timerRef.current = setTimeout(() => {
      if (runTickRef.current) runTickRef.current();
    }, delayRef.current);
  };

  // MANUAL: NEXT STEP (Step Forward)
  const handleNextStep = () => {
    // If playing, pause first
    if (isPlaying) {
      handlePause();
    }

    // Initialize steps if not generated yet
    if (!stepsRef.current || stepsRef.current.length === 0) {
      let targetArray;
      try {
        targetArray = parseInputArray(arrayInput);
        setInitialArray(targetArray);
      } catch (err) {
        alert(`Invalid array format: ${err.message}`);
        return;
      }
      const steps = generateSortingSteps(selectedAlgo, targetArray, workerCount);
      stepsRef.current = steps;
      stepIndexRef.current = 0;
      setTotalSteps(steps.length);
    }

    const steps = stepsRef.current;
    let idx = stepIndexRef.current;

    if (idx < steps.length) {
      const step = steps[idx];
      renderStep(step, idx + 1, steps.length);
      stepIndexRef.current = idx + 1;
      setIsPaused(true);
      if (idx + 1 === steps.length) {
        setIsFinished(true);
      }
    }
  };

  // MANUAL: PREVIOUS STEP (Step Backward)
  const handlePrevStep = () => {
    if (isPlaying) {
      handlePause();
    }

    const steps = stepsRef.current;
    if (!steps || steps.length === 0 || stepIndexRef.current <= 1) {
      return;
    }

    // Move back one step
    const targetIdx = stepIndexRef.current - 2;
    if (targetIdx >= 0) {
      const step = steps[targetIdx];
      renderStep(step, targetIdx + 1, steps.length);
      stepIndexRef.current = targetIdx + 1;
      setIsPaused(true);
      setIsFinished(false);
    }
  };

  // Algorithm Change
  const handleAlgoChange = (newAlgo) => {
    stopAnimation();
    setSelectedAlgo(newAlgo);
    handleReset();
  };

  // Preset Array Handler
  const handlePresetChange = (presetId) => {
    stopAnimation();
    let newArr = [];

    switch (presetId) {
      case 'example':
        newArr = [8, 3, 6, 1, 9, 2, 5, 4];
        break;
      case 'random':
        newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 95) + 5);
        break;
      case 'reversed':
        newArr = Array.from({ length: arraySize }, (_, i) => (arraySize - i) * 6 + 4);
        break;
      case 'nearly':
        newArr = Array.from({ length: arraySize }, (_, i) => (i + 1) * 5);
        if (newArr.length > 4) {
          [newArr[2], newArr[3]] = [newArr[3], newArr[2]];
          [newArr[newArr.length - 2], newArr[newArr.length - 3]] = [newArr[newArr.length - 3], newArr[newArr.length - 2]];
        }
        break;
      case 'duplicates':
        newArr = Array.from({ length: arraySize }, () => [12, 28, 45, 60, 80][Math.floor(Math.random() * 5)]);
        break;
      case 'negatives':
        newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 120) - 60);
        break;
      default:
        newArr = [8, 3, 6, 1, 9, 2, 5, 4];
    }

    setArrayInput(newArr.join(', '));
    setInitialArray(newArr);
    setCurrentArray(newArr);
    handleReset();
  };

  const currentAlgoObj = ALGORITHMS.find((a) => a.id === selectedAlgo) || ALGORITHMS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Configuration & Playback Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Sliders size={20} color="var(--accent-primary)" />
              Classroom Teaching & Presentation Controls
            </div>
            <div className="card-subtitle">
              True slow-motion playback with step-by-step lecture stepping (Prev/Next) and pedagogical explanations.
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* Step Backward (◀ Prev) */}
            <button
              id="btn-prev-step"
              className="btn btn-outline"
              onClick={handlePrevStep}
              disabled={currentStep <= 1 && !isFinished}
              title="Step backward to previous operation"
            >
              <SkipBack size={16} />
              Prev Step
            </button>

            {/* Play / Pause / Resume */}
            {!isPlaying && !isPaused && (
              <button
                id="btn-start-sort"
                className="btn btn-primary"
                onClick={handleStart}
              >
                <Play size={16} />
                Start Auto-play
              </button>
            )}

            {isPlaying && (
              <button
                id="btn-pause-sort"
                className="btn btn-warning"
                onClick={handlePause}
              >
                <Pause size={16} />
                Pause
              </button>
            )}

            {isPaused && (
              <button
                id="btn-resume-sort"
                className="btn btn-success"
                onClick={handleResume}
              >
                <Play size={16} />
                Resume
              </button>
            )}

            {/* Step Forward (Next ▶) */}
            <button
              id="btn-next-step"
              className="btn btn-outline"
              onClick={handleNextStep}
              disabled={isFinished}
              title="Step forward to next operation"
            >
              Next Step
              <SkipForward size={16} />
            </button>

            {/* Reset */}
            <button
              id="btn-reset-sort"
              className="btn btn-outline"
              onClick={handleReset}
              title="Reset array to original state"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {/* Algorithm selector */}
          <div className="form-group">
            <label className="form-label">Sorting Algorithm</label>
            <select
              id="select-algorithm"
              className="form-select"
              value={selectedAlgo}
              onChange={(e) => handleAlgoChange(e.target.value)}
              disabled={isPlaying}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} ({algo.complexity})
                </option>
              ))}
            </select>
          </div>

          {/* Preset dataset */}
          <div className="form-group">
            <label className="form-label">Preset Dataset</label>
            <select
              id="select-preset"
              className="form-select"
              onChange={(e) => handlePresetChange(e.target.value)}
              disabled={isPlaying}
              defaultValue="example"
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Presets */}
          <div className="form-group">
            <label className="form-label">Slow-Motion Speed Presets</label>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {SPEED_PRESETS.map((sp) => (
                <button
                  key={sp.delay}
                  className={`btn btn-sm ${delayMs === sp.delay ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.55rem' }}
                  onClick={() => setDelayMs(sp.delay)}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Slider */}
          <div className="form-group">
            <label className="form-label">
              Exact Delay: <strong style={{ color: 'var(--accent-primary)' }}>{delayMs} ms</strong> per step
            </label>
            <div className="slider-container">
              <input
                id="slider-speed"
                type="range"
                min="100"
                max="3000"
                step="100"
                value={delayMs}
                className="range-slider"
                onChange={(e) => setDelayMs(parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {/* Parallel Worker Count */}
          {selectedAlgo === 'parallel_merge' && (
            <div className="form-group">
              <label className="form-label">Worker Processes ({workerCount} Workers)</label>
              <select
                id="select-workers-playground"
                className="form-select"
                value={workerCount}
                onChange={(e) => {
                  stopAnimation();
                  setWorkerCount(parseInt(e.target.value, 10));
                }}
                disabled={isPlaying}
              >
                <option value={2}>2 Worker Processes</option>
                <option value={4}>4 Worker Processes</option>
                <option value={8}>8 Worker Processes</option>
              </select>
            </div>
          )}
        </div>

        {/* Custom Input Bar */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.65rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '280px' }}>
            <label className="form-label">Custom Integer Array (comma/space separated):</label>
            <input
              id="input-custom-array"
              type="text"
              className="form-input"
              value={arrayInput}
              onChange={(e) => {
                setArrayInput(e.target.value);
                try {
                  const parsed = parseInputArray(e.target.value);
                  setInitialArray(parsed);
                  setCurrentArray(parsed);
                } catch {
                  // Wait for user to finish typing
                }
              }}
              placeholder="e.g. 8, 3, 6, 1, 9, 2, 5, 4"
              disabled={isPlaying}
            />
          </div>
          <button
            id="btn-random-generate"
            className="btn btn-outline"
            onClick={() => handlePresetChange('random')}
            disabled={isPlaying}
            title="Generate a random array"
          >
            <Shuffle size={15} />
            Random Array
          </button>
        </div>
      </div>

      {/* Live Metrics Row */}
      <div className="stats-grid">
        <StatsCard
          icon={ArrowRightLeft}
          color="orange"
          label="Comparisons"
          value={comparisons}
          subtext="Comparison operations"
        />
        <StatsCard
          icon={Sparkles}
          color="blue"
          label="Swaps / Writes"
          value={swaps}
          subtext="Array updates & writes"
        />
        <StatsCard
          icon={Clock}
          color="green"
          label="Step Speed"
          value={`${delayMs} ms`}
          subtext={delayMs >= 2000 ? 'Very Slow (Lecture)' : delayMs >= 1000 ? 'Slow Motion' : 'Normal'}
        />
        <StatsCard
          icon={BarChart2}
          color="purple"
          label="Current Step"
          value={totalSteps > 0 ? `${currentStep} / ${totalSteps}` : 'Ready'}
          subtext={`Progress: ${progressPercent}%`}
        />
      </div>

      {/* Main Algorithm Visualization Board */}
      <div className="visualizer-board">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {currentAlgoObj.name} — Visual Demonstration
          </span>

          <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
            {currentAlgoObj.complexity}
          </span>
        </div>

        {/* Algorithm-Specific Dedicated Visualizer */}
        <ArrayVisualizer
          array={currentArray}
          algorithm={selectedAlgo}
          comparing={comparing}
          swapping={swapping}
          sorted={sortedSet}
          stepMeta={stepMeta}
        />

        {/* Status Banner */}
        <div className="status-banner" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div className="status-message">
              {isFinished ? (
                <CheckCircle2 size={16} color="var(--accent-success)" />
              ) : (
                <Info size={16} color="var(--accent-primary)" />
              )}
              <span>{teachingInfo.operation}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Step: <span style={{ color: 'var(--accent-primary)' }}>{currentStep} / {totalSteps || '—'}</span> ({progressPercent}%)
          </div>

          {/* Step Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Teaching Mode: Step-by-Step Educational Explanation Panel */}
      <TeachingPanel
        stepNumber={currentStep}
        totalSteps={totalSteps}
        operation={teachingInfo.operation}
        elementsInvolved={teachingInfo.elementsInvolved}
        why={teachingInfo.why}
        whatChanged={teachingInfo.whatChanged}
        whatNext={teachingInfo.whatNext}
        algorithmName={currentAlgoObj.name}
      />
    </div>
  );
}
