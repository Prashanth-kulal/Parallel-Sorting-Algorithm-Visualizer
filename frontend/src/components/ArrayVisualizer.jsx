import React from 'react';
import BubbleSortView from './AlgorithmVisualizer/BubbleSortView';
import SelectionSortView from './AlgorithmVisualizer/SelectionSortView';
import InsertionSortView from './AlgorithmVisualizer/InsertionSortView';
import MergeSortView from './AlgorithmVisualizer/MergeSortView';
import QuickSortView from './AlgorithmVisualizer/QuickSortView';
import ParallelMergeSortView from './AlgorithmVisualizer/ParallelMergeSortView';

export default function ArrayVisualizer({
  array = [],
  algorithm = 'bubble',
  comparing = [],
  swapping = [],
  sorted = new Set(),
  // Step meta:
  stepMeta = {}
}) {
  if (!array || array.length === 0) {
    return (
      <div className="array-boxes-container" style={{ alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          No array data loaded. Enter integers or generate an array to begin.
        </p>
      </div>
    );
  }

  // Render algorithm-specific dedicated view
  switch (algorithm) {
    case 'bubble':
      return (
        <BubbleSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          sortedBoundary={stepMeta.sortedBoundary}
        />
      );

    case 'selection':
      return (
        <SelectionSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          targetIdx={stepMeta.targetIdx}
          minCandidate={stepMeta.minCandidate}
          minVal={stepMeta.minVal}
          scanPointer={stepMeta.scanPointer}
        />
      );

    case 'insertion':
      return (
        <InsertionSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          sortedBoundary={stepMeta.sortedBoundary}
          keyVal={stepMeta.keyVal}
          keyOriginalIndex={stepMeta.keyOriginalIndex}
          emptySlot={stepMeta.emptySlot}
          shiftingIndex={stepMeta.shiftingIndex}
        />
      );

    case 'merge':
      return (
        <MergeSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          subrange={stepMeta.subrange}
          leftSubarray={stepMeta.leftSubarray || []}
          rightSubarray={stepMeta.rightSubarray || []}
          leftPointer={stepMeta.leftPointer}
          rightPointer={stepMeta.rightPointer}
          mergedBuffer={stepMeta.mergedBuffer || []}
        />
      );

    case 'quick':
      return (
        <QuickSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          pivotIndex={stepMeta.pivotIndex}
          pivotVal={stepMeta.pivotVal}
          low={stepMeta.low}
          high={stepMeta.high}
          boundaryI={stepMeta.boundaryI}
          scanJ={stepMeta.scanJ}
        />
      );

    case 'parallel_merge':
      return (
        <ParallelMergeSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
          workerChunks={stepMeta.workerChunks || []}
          activeWorkerId={stepMeta.activeWorkerId}
          reductionRound={stepMeta.reductionRound}
        />
      );

    default:
      return (
        <BubbleSortView
          array={array}
          comparing={comparing}
          swapping={swapping}
          sorted={sorted}
        />
      );
  }
}
