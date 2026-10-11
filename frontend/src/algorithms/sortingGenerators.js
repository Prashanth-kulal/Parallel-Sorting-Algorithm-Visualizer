/**
 * sortingGenerators.js
 * ====================
 * High-pedagogical, classroom-presentation grade step generation engine.
 * Every step contains:
 * - array: Array snapshot
 * - operation: Clear operation title
 * - elementsInvolved: Exact values and indices
 * - why: Pedagogical explanation of why this step occurs
 * - whatChanged: Exactly what changed in this step
 * - whatNext: What the algorithm will do in the next step
 * - Algorithm-specific state for custom visualizer modes
 */

export const WORKER_COLORS = [
  '#38BDF8', // Worker 1: Sky Blue
  '#22C55E', // Worker 2: Emerald Green
  '#FBBF24', // Worker 3: Amber
  '#A855F7', // Worker 4: Purple
  '#EC4899', // Worker 5: Pink
  '#06B6D4', // Worker 6: Cyan
  '#F97316', // Worker 7: Orange
  '#6366F1'  // Worker 8: Indigo
];

const clone = (arr) => [...arr];

/**
 * 1. BUBBLE SORT - TEACHING GRADE
 */
export function generateBubbleSortSteps(initialArr) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set();
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    algorithm: 'bubble',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    sortedBoundary: n,
    operation: 'Algorithm Initialization',
    elementsInvolved: `Array with ${n} elements: [${arr.join(', ')}]`,
    why: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    whatChanged: 'Initialized unsorted array.',
    whatNext: 'Begin Pass 1 by comparing the first two elements (indices 0 and 1).'
  });

  if (n <= 1) {
    if (n === 1) sorted.add(0);
    steps.push({
      algorithm: 'bubble',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      sortedBoundary: 0,
      operation: 'Complete',
      elementsInvolved: 'Entire array',
      why: 'Single-element or empty array is already sorted.',
      whatChanged: 'Array marked sorted.',
      whatNext: 'Algorithm terminates.'
    });
    return steps;
  }

  for (let i = 0; i < n; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const val1 = arr[j];
      const val2 = arr[j + 1];

      // Step 1: Compare adjacent
      steps.push({
        algorithm: 'bubble',
        array: clone(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: new Set(sorted),
        sortedBoundary: n - i,
        operation: 'Comparing Adjacent Elements',
        elementsInvolved: `array[${j}] (${val1}) vs array[${j + 1}] (${val2})`,
        why: `Bubble Sort checks if the left element (${val1}) is greater than the right element (${val2}).`,
        whatChanged: `Inspecting adjacent pair at indices [${j}, ${j + 1}].`,
        whatNext: val1 > val2
          ? `Since ${val1} > ${val2}, they are out of order and must be swapped.`
          : `Since ${val1} ≤ ${val2}, they are in correct relative order. No swap needed.`
      });

      if (val1 > val2) {
        swaps++;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedInPass = true;

        // Step 2: Animate Swap
        steps.push({
          algorithm: 'bubble',
          array: clone(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: new Set(sorted),
          sortedBoundary: n - i,
          operation: 'Swapping Out-of-Order Elements',
          elementsInvolved: `Exchanged ${val1} at index ${j} with ${val2} at index ${j + 1}`,
          why: `${val1} is greater than ${val2}, so swapping moves the larger value toward the right.`,
          whatChanged: `Array order updated: array[${j}] = ${arr[j]}, array[${j + 1}] = ${arr[j + 1]}.`,
          whatNext: j + 1 < n - i - 1
            ? `Move forward to compare next adjacent pair at indices [${j + 1}, ${j + 2}].`
            : `End of Pass ${i + 1}. The largest element in this pass has bubbled to position ${n - 1 - i}.`
        });
      }
    }

    // Lock settled position
    sorted.add(n - 1 - i);
    steps.push({
      algorithm: 'bubble',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      sortedBoundary: n - 1 - i,
      operation: 'Settled Element in Sorted Partition',
      elementsInvolved: `array[${n - 1 - i}] = ${arr[n - 1 - i]}`,
      why: `At the end of Pass ${i + 1}, the largest remaining unsorted value (${arr[n - 1 - i]}) is guaranteed to be in its permanent position.`,
      whatChanged: `Index ${n - 1 - i} locked in green as sorted.`,
      whatNext: i + 1 < n - 1 && swappedInPass
        ? `Begin Pass ${i + 2} on the remaining unsorted sublist (indices 0 to ${n - 2 - i}).`
        : `Array is fully sorted.`
    });

    if (!swappedInPass) {
      for (let k = 0; k < n; k++) sorted.add(k);
      steps.push({
        algorithm: 'bubble',
        array: clone(arr),
        comparing: [],
        swapping: [],
        sorted: new Set(sorted),
        sortedBoundary: 0,
        operation: 'Early Termination Check Passed',
        elementsInvolved: 'All elements',
        why: `No swaps were performed during Pass ${i + 1}. This proves the entire array is already in sorted order!`,
        whatChanged: 'All elements marked sorted.',
        whatNext: 'Algorithm terminates early, saving unnecessary comparisons.'
      });
      break;
    }
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'bubble',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    sortedBoundary: 0,
    operation: 'Bubble Sort Completed',
    elementsInvolved: `Final array: [${arr.join(', ')}]`,
    why: 'All passes completed. The array is strictly ascending.',
    whatChanged: 'Array sorting verified.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * 2. SELECTION SORT - TEACHING GRADE
 */
export function generateSelectionSortSteps(initialArr) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set();
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    algorithm: 'selection',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    targetIdx: 0,
    minCandidate: 0,
    minVal: arr[0],
    scanPointer: null,
    operation: 'Algorithm Initialization',
    elementsInvolved: `Array with ${n} elements: [${arr.join(', ')}]`,
    why: 'Selection Sort divides the array into a Sorted prefix and an Unsorted suffix. In each pass, it finds the minimum element in the unsorted suffix and places it at the front.',
    whatChanged: 'Initialized unsorted section [0..${n - 1}].',
    whatNext: 'Begin Pass 1 to find the absolute minimum in the entire array.'
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    steps.push({
      algorithm: 'selection',
      array: clone(arr),
      comparing: [i],
      swapping: [],
      sorted: new Set(sorted),
      targetIdx: i,
      minCandidate: i,
      minVal: arr[i],
      scanPointer: i,
      operation: 'Setting New Search Target',
      elementsInvolved: `Target index ${i} with initial minimum value ${arr[i]}`,
      why: `Pass ${i + 1}: Assume element at index ${i} (${arr[i]}) is the candidate minimum, then scan the rest of the unsorted section.`,
      whatChanged: `Candidate minimum set to index ${i} (${arr[i]}).`,
      whatNext: `Scan subsequent indices (${i + 1} to ${n - 1}) to check if any smaller element exists.`
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const currentMin = arr[minIdx];
      const candidate = arr[j];

      // Comparison step
      steps.push({
        algorithm: 'selection',
        array: clone(arr),
        comparing: [minIdx, j],
        swapping: [],
        sorted: new Set(sorted),
        targetIdx: i,
        minCandidate: minIdx,
        minVal: currentMin,
        scanPointer: j,
        operation: 'Scanning Candidate for Minimum',
        elementsInvolved: `Current Min: ${currentMin} (index ${minIdx}) vs Candidate: ${candidate} (index ${j})`,
        why: `Check whether candidate ${candidate} is smaller than current minimum ${currentMin}.`,
        whatChanged: `Examining index ${j}.`,
        whatNext: candidate < currentMin
          ? `Found smaller value! Update candidate minimum to index ${j} (${candidate}).`
          : `${candidate} is not smaller than ${currentMin}. Keep current minimum and proceed.`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          algorithm: 'selection',
          array: clone(arr),
          comparing: [minIdx],
          swapping: [],
          sorted: new Set(sorted),
          targetIdx: i,
          minCandidate: minIdx,
          minVal: arr[minIdx],
          scanPointer: j,
          operation: 'New Minimum Found',
          elementsInvolved: `New minimum: ${arr[minIdx]} at index ${minIdx}`,
          why: `Since ${candidate} < ${currentMin}, index ${minIdx} is the new minimum discovered so far.`,
          whatChanged: `Updated candidate minimum to index ${minIdx} (${arr[minIdx]}).`,
          whatNext: j + 1 < n
            ? `Continue scanning remaining elements from index ${j + 1}.`
            : `Reached end of unsorted section. Prepare to place minimum into target index ${i}.`
        });
      }
    }

    // Final swap of pass
    if (minIdx !== i) {
      swaps++;
      const placedVal = arr[minIdx];
      const replacedVal = arr[i];
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

      steps.push({
        algorithm: 'selection',
        array: clone(arr),
        comparing: [],
        swapping: [i, minIdx],
        sorted: new Set(sorted),
        targetIdx: i,
        minCandidate: i,
        minVal: arr[i],
        scanPointer: null,
        operation: 'Placing Minimum into Target Position',
        elementsInvolved: `Swapped minimum (${placedVal} from index ${minIdx}) with (${replacedVal} at target index ${i})`,
        why: `The search is finished. ${placedVal} is the smallest element in unsorted range [${i}..${n - 1}], so it moves into sorted slot ${i}.`,
        whatChanged: `array[${i}] is now ${placedVal}.`,
        whatNext: `Mark index ${i} as permanently sorted.`
      });
    } else {
      steps.push({
        algorithm: 'selection',
        array: clone(arr),
        comparing: [i],
        swapping: [],
        sorted: new Set(sorted),
        targetIdx: i,
        minCandidate: i,
        minVal: arr[i],
        scanPointer: null,
        operation: 'Minimum Already in Target Position',
        elementsInvolved: `array[${i}] = ${arr[i]}`,
        why: `The element already at index ${i} (${arr[i]}) was the smallest in the unsorted section. No swap needed!`,
        whatChanged: `Confirmed position ${i}.`,
        whatNext: `Mark index ${i} as permanently sorted.`
      });
    }

    sorted.add(i);
    steps.push({
      algorithm: 'selection',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      targetIdx: i,
      minCandidate: null,
      minVal: null,
      scanPointer: null,
      operation: 'Sorted Section Expanded',
      elementsInvolved: `Sorted partition: [0..${i}]`,
      why: `Index ${i} (${arr[i]}) is confirmed sorted.`,
      whatChanged: `Sorted section now spans indices 0 to ${i}.`,
      whatNext: i + 1 < n
        ? `Advance to Pass ${i + 2} to find the next minimum from index ${i + 1}.`
        : `All passes complete.`
    });
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'selection',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    operation: 'Selection Sort Completed',
    elementsInvolved: `Final array: [${arr.join(', ')}]`,
    why: 'All minimum elements have been placed in order.',
    whatChanged: 'Entire array verified sorted.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * 3. INSERTION SORT - TEACHING GRADE
 */
export function generateInsertionSortSteps(initialArr) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set([0]);
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    algorithm: 'insertion',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    sortedBoundary: 1,
    keyVal: null,
    keyOriginalIndex: null,
    emptySlot: null,
    shiftingIndex: null,
    operation: 'Algorithm Initialization',
    elementsInvolved: `First element array[0] (${arr[0]})`,
    why: 'Insertion Sort builds the sorted array one element at a time. A sublist of length 1 (array[0]) is trivially sorted.',
    whatChanged: 'Index 0 initialized as the sorted partition.',
    whatNext: 'Extract element at index 1 as the first Key to insert.'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Step 1: Extract Key
    steps.push({
      algorithm: 'insertion',
      array: clone(arr),
      comparing: [i],
      swapping: [],
      sorted: new Set(sorted),
      sortedBoundary: i,
      keyVal: key,
      keyOriginalIndex: i,
      emptySlot: i,
      shiftingIndex: null,
      operation: 'Extracting Key Element',
      elementsInvolved: `Key = ${key} (extracted from index ${i})`,
      why: `Take array[${i}] (${key}) out as the Key to insert into the sorted partition [0..${i - 1}].`,
      whatChanged: `Key (${key}) extracted into floating holding slot.`,
      whatNext: `Compare Key (${key}) with sorted elements from right to left starting at index ${i - 1}.`
    });

    while (j >= 0) {
      comparisons++;
      const currentSortedVal = arr[j];

      // Step 2: Compare Key with sorted element
      steps.push({
        algorithm: 'insertion',
        array: clone(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: new Set(sorted),
        sortedBoundary: i,
        keyVal: key,
        keyOriginalIndex: i,
        emptySlot: j + 1,
        shiftingIndex: j,
        operation: 'Comparing Key with Sorted Subarray',
        elementsInvolved: `Key (${key}) vs array[${j}] (${currentSortedVal})`,
        why: `Check whether sorted element ${currentSortedVal} is greater than Key (${key}).`,
        whatChanged: `Inspecting slot ${j}.`,
        whatNext: currentSortedVal > key
          ? `Since ${currentSortedVal} > ${key}, shift ${currentSortedVal} one position right to make room.`
          : `Since ${currentSortedVal} ≤ ${key}, correct insertion position found at index ${j + 1}.`
      });

      if (currentSortedVal > key) {
        swaps++;
        arr[j + 1] = arr[j];

        // Step 3: Shift element rightwards
        steps.push({
          algorithm: 'insertion',
          array: clone(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: new Set(sorted),
          sortedBoundary: i,
          keyVal: key,
          keyOriginalIndex: i,
          emptySlot: j,
          shiftingIndex: j,
          operation: 'Shifting Element Rightwards',
          elementsInvolved: `Shifted ${currentSortedVal} from index ${j} to index ${j + 1}`,
          why: `${currentSortedVal} is larger than Key (${key}), so it must sit to the right of Key.`,
          whatChanged: `Slot ${j + 1} now holds ${currentSortedVal}. Open gap created at index ${j}.`,
          whatNext: j - 1 >= 0
            ? `Compare Key (${key}) with preceding element array[${j - 1}].`
            : `Reached front of array! Insert Key into index 0.`
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sorted.add(i);

    // Step 4: Insert Key into slot
    steps.push({
      algorithm: 'insertion',
      array: clone(arr),
      comparing: [],
      swapping: [j + 1],
      sorted: new Set(sorted),
      sortedBoundary: i + 1,
      keyVal: key,
      keyOriginalIndex: i,
      emptySlot: j + 1,
      shiftingIndex: null,
      operation: 'Inserting Key into Sorted Gap',
      elementsInvolved: `Key (${key}) placed into index ${j + 1}`,
      why: `Position ${j + 1} is the exact sorted position where all elements to the left are ≤ ${key} and all elements to the right are > ${key}.`,
      whatChanged: `array[${j + 1}] set to ${key}. Sorted partition expanded to [0..${i}].`,
      whatNext: i + 1 < n
        ? `Proceed to extract next Key from index ${i + 1}.`
        : `All elements inserted into sorted order.`
    });
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'insertion',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    sortedBoundary: n,
    keyVal: null,
    operation: 'Insertion Sort Completed',
    elementsInvolved: `Final array: [${arr.join(', ')}]`,
    why: 'All elements have been inserted into their appropriate sorted positions.',
    whatChanged: 'Entire array is sorted.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * 4. MERGE SORT - TEACHING GRADE (Divide & Merge Visualization)
 */
export function generateMergeSortSteps(initialArr) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set();
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    algorithm: 'merge',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    subrange: [0, n - 1],
    leftSubarray: [],
    rightSubarray: [],
    leftPointer: null,
    rightPointer: null,
    mergedBuffer: [],
    operation: 'Algorithm Initialization',
    elementsInvolved: `Entire array: [${arr.join(', ')}]`,
    why: 'Merge Sort is a Divide-and-Conquer algorithm. It recursively splits the array into two halves until single-element arrays remain, then merges sorted halves back together.',
    whatChanged: 'Initialized full array.',
    whatNext: `Divide range [0..${n - 1}] into two halves.`
  });

  function mergeHelper(left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;
    const currentMerged = [];

    // Step: Show two subarrays to be merged
    steps.push({
      algorithm: 'merge',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      subrange: [left, right],
      leftSubarray: leftArr,
      rightSubarray: rightArr,
      leftSubrange: [left, mid],
      rightSubrange: [mid + 1, right],
      leftPointer: 0,
      rightPointer: 0,
      mergedBuffer: [],
      operation: 'Preparing to Merge Sorted Subarrays',
      elementsInvolved: `Left: [${leftArr.join(', ')}] and Right: [${rightArr.join(', ')}]`,
      why: `Both subarrays [${left}..${mid}] and [${mid + 1}..${right}] are already sorted. Now combine them into a single sorted segment.`,
      whatChanged: `Isolated Left and Right sub-lists for merging.`,
      whatNext: `Compare the first elements: Left[0] (${leftArr[0]}) vs Right[0] (${rightArr[0]}).`
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      const leftVal = leftArr[i];
      const rightVal = rightArr[j];

      // Comparison step
      steps.push({
        algorithm: 'merge',
        array: clone(arr),
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: new Set(sorted),
        subrange: [left, right],
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        leftPointer: i,
        rightPointer: j,
        mergedBuffer: [...currentMerged],
        operation: 'Comparing Front Elements of Subarrays',
        elementsInvolved: `Left[${i}] (${leftVal}) vs Right[${j}] (${rightVal})`,
        why: `Compare front elements of each subarray. The smaller one should be copied next into merged position ${k}.`,
        whatChanged: `Comparing ${leftVal} and ${rightVal}.`,
        whatNext: leftVal <= rightVal
          ? `${leftVal} ≤ ${rightVal}. Copy Left value (${leftVal}) into position ${k}.`
          : `${rightVal} < ${leftVal}. Copy Right value (${rightVal}) into position ${k}.`
      });

      if (leftVal <= rightVal) {
        arr[k] = leftVal;
        currentMerged.push(leftVal);
        i++;
      } else {
        arr[k] = rightVal;
        currentMerged.push(rightVal);
        j++;
      }
      swaps++;

      // Write step
      steps.push({
        algorithm: 'merge',
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: new Set(sorted),
        subrange: [left, right],
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        leftPointer: i,
        rightPointer: j,
        mergedBuffer: [...currentMerged],
        operation: 'Writing Smaller Element to Array',
        elementsInvolved: `Placed ${arr[k]} into index ${k}`,
        why: `Appended the smaller value (${arr[k]}) to the sorted output buffer.`,
        whatChanged: `array[${k}] is now ${arr[k]}.`,
        whatNext: i < leftArr.length && j < rightArr.length
          ? `Compare next front elements: Left[${i}] vs Right[${j}].`
          : `One subarray is exhausted! Flush remaining elements from the other subarray.`
      });
      k++;
    }

    // Flush remaining Left
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      currentMerged.push(leftArr[i]);
      swaps++;

      steps.push({
        algorithm: 'merge',
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: new Set(sorted),
        subrange: [left, right],
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        leftPointer: i,
        rightPointer: j,
        mergedBuffer: [...currentMerged],
        operation: 'Flushing Remaining Left Elements',
        elementsInvolved: `Copied leftover Left element (${leftArr[i]}) to index ${k}`,
        why: `The Right subarray is completely processed. All remaining Left elements are already in sorted order and greater than everything merged so far.`,
        whatChanged: `array[${k}] = ${leftArr[i]}.`,
        whatNext: i + 1 < leftArr.length ? 'Copy next leftover element.' : 'Merge segment complete.'
      });
      i++;
      k++;
    }

    // Flush remaining Right
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      currentMerged.push(rightArr[j]);
      swaps++;

      steps.push({
        algorithm: 'merge',
        array: clone(arr),
        comparing: [],
        swapping: [k],
        sorted: new Set(sorted),
        subrange: [left, right],
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        leftPointer: i,
        rightPointer: j,
        mergedBuffer: [...currentMerged],
        operation: 'Flushing Remaining Right Elements',
        elementsInvolved: `Copied leftover Right element (${rightArr[j]}) to index ${k}`,
        why: `The Left subarray is completely processed. All remaining Right elements are already sorted.`,
        whatChanged: `array[${k}] = ${rightArr[j]}.`,
        whatNext: j + 1 < rightArr.length ? 'Copy next leftover element.' : 'Merge segment complete.'
      });
      j++;
      k++;
    }

    if (left === 0 && right === n - 1) {
      for (let idx = 0; idx < n; idx++) sorted.add(idx);
    }
  }

  function mergeSortRecursive(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    steps.push({
      algorithm: 'merge',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      subrange: [left, right],
      leftSubrange: [left, mid],
      rightSubrange: [mid + 1, right],
      operation: 'Dividing Subarray in Half',
      elementsInvolved: `Subarray [${left}..${right}] halved at mid index ${mid}`,
      why: `Divide step: Split range [${left}..${right}] into Left [${left}..${mid}] and Right [${mid + 1}..${right}].`,
      whatChanged: `Active segment halved.`,
      whatNext: `Recursively sort Left half [${left}..${mid}].`
    });

    mergeSortRecursive(left, mid);
    mergeSortRecursive(mid + 1, right);
    mergeHelper(left, mid, right);
  }

  mergeSortRecursive(0, n - 1);

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'merge',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    subrange: null,
    operation: 'Merge Sort Completed',
    elementsInvolved: `Final array: [${arr.join(', ')}]`,
    why: 'All recursive divide steps and pairwise merges have completed successfully.',
    whatChanged: 'Entire array fully sorted.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * 5. QUICK SORT - TEACHING GRADE (Partitioning & Pivot Selection)
 */
export function generateQuickSortSteps(initialArr) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set();
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    algorithm: 'quick',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    pivotIndex: null,
    pivotVal: null,
    low: 0,
    high: n - 1,
    boundaryI: -1,
    scanJ: 0,
    operation: 'Algorithm Initialization',
    elementsInvolved: `Array with ${n} elements: [${arr.join(', ')}]`,
    why: 'Quick Sort chooses a Pivot, partitions elements into values ≤ Pivot (left) and values > Pivot (right), then places the Pivot into its exact final sorted position.',
    whatChanged: 'Initialized unsorted array.',
    whatNext: `Select pivot for initial partition range [0..${n - 1}].`
  });

  function partition(low, high) {
    const pivotVal = arr[high];
    let i = low - 1;

    // Step 1: Select Pivot
    steps.push({
      algorithm: 'quick',
      array: clone(arr),
      comparing: [],
      swapping: [],
      sorted: new Set(sorted),
      pivotIndex: high,
      pivotVal,
      low,
      high,
      boundaryI: i,
      scanJ: low,
      operation: 'Selected Partition Pivot',
      elementsInvolved: `Pivot = ${pivotVal} at index ${high} for range [${low}..${high}]`,
      why: `Select the rightmost element (${pivotVal}) as the Pivot. Elements smaller than ${pivotVal} will be grouped to its left, and larger elements to its right.`,
      whatChanged: `Pivot chosen: ${pivotVal}. Partition boundary pointer i initialized to ${i}.`,
      whatNext: `Scan from index ${low} to ${high - 1} comparing each element with Pivot (${pivotVal}).`
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const currentVal = arr[j];

      // Step 2: Compare with Pivot
      steps.push({
        algorithm: 'quick',
        array: clone(arr),
        comparing: [j, high],
        swapping: [],
        sorted: new Set(sorted),
        pivotIndex: high,
        pivotVal,
        low,
        high,
        boundaryI: i,
        scanJ: j,
        operation: 'Comparing Element with Pivot',
        elementsInvolved: `array[${j}] (${currentVal}) vs Pivot (${pivotVal})`,
        why: `Check whether array[${j}] (${currentVal}) is ≤ Pivot (${pivotVal}).`,
        whatChanged: `Inspecting index ${j}.`,
        whatNext: currentVal <= pivotVal
          ? `${currentVal} ≤ ${pivotVal}. Increment boundary i and swap array[i] with array[${j}] to place ${currentVal} in the smaller partition.`
          : `${currentVal} > ${pivotVal}. Leave it on the right side of boundary i.`
      });

      if (currentVal <= pivotVal) {
        i++;
        if (i !== j) {
          swaps++;
          [arr[i], arr[j]] = [arr[j], arr[i]];

          // Step 3: Swap smaller element into left partition
          steps.push({
            algorithm: 'quick',
            array: clone(arr),
            comparing: [],
            swapping: [i, j],
            sorted: new Set(sorted),
            pivotIndex: high,
            pivotVal,
            low,
            high,
            boundaryI: i,
            scanJ: j,
            operation: 'Swapping Element to Smaller Partition',
            elementsInvolved: `Swapped array[${i}] (${arr[i]}) with array[${j}] (${arr[j]})`,
            why: `${arr[i]} is ≤ Pivot (${pivotVal}), so it moves into the left partition (indices ≤ ${i}).`,
            whatChanged: `Expanded smaller partition to index ${i}.`,
            whatNext: j + 1 < high
              ? `Advance scan pointer j to index ${j + 1}.`
              : `End of scan. Prepare to place Pivot (${pivotVal}) into its final position.`
          });
        }
      }
    }

    swaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pivotFinalIdx = i + 1;
    sorted.add(pivotFinalIdx);

    // Step 4: Final Pivot Placement
    steps.push({
      algorithm: 'quick',
      array: clone(arr),
      comparing: [],
      swapping: [pivotFinalIdx, high],
      sorted: new Set(sorted),
      pivotIndex: pivotFinalIdx,
      pivotVal,
      low,
      high,
      boundaryI: i,
      scanJ: high,
      operation: 'Placing Pivot in Permanent Sorted Position',
      elementsInvolved: `Pivot (${pivotVal}) moved to index ${pivotFinalIdx}`,
      why: `Every element before index ${pivotFinalIdx} is ≤ ${pivotVal}, and every element after is > ${pivotVal}. Thus, the Pivot is now in its exact final sorted position!`,
      whatChanged: `array[${pivotFinalIdx}] = ${pivotVal}. Locked in green as sorted.`,
      whatNext: `Recursively partition Left sublist [${low}..${pivotFinalIdx - 1}] and Right sublist [${pivotFinalIdx + 1}..${high}].`
    });

    return pivotFinalIdx;
  }

  function quickSortRecursive(low, high) {
    if (low < high) {
      const pIdx = partition(low, high);
      quickSortRecursive(low, pIdx - 1);
      quickSortRecursive(pIdx + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  quickSortRecursive(0, n - 1);

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'quick',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    pivotIndex: null,
    operation: 'Quick Sort Completed',
    elementsInvolved: `Final array: [${arr.join(', ')}]`,
    why: 'All partitions and pivots have settled into their permanent positions.',
    whatChanged: 'Entire array verified sorted.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * 6. PARALLEL MERGE SORT - TEACHING GRADE (Worker Lanes & Reduction Tree)
 */
export function generateParallelMergeSortSteps(initialArr, workerCount = 4) {
  const steps = [];
  const arr = clone(initialArr);
  const n = arr.length;
  const sorted = new Set();
  let comparisons = 0;
  let swaps = 0;

  const actualWorkers = Math.min(workerCount, Math.max(1, n));
  const k = Math.floor(n / actualWorkers);
  const m = n % actualWorkers;

  const chunks = [];
  let start = 0;
  for (let i = 0; i < actualWorkers; i++) {
    const end = start + k + (i < m ? 1 : 0);
    chunks.push({
      workerId: i + 1,
      start,
      end,
      size: end - start,
      items: arr.slice(start, end),
      status: 'Assigned',
      color: WORKER_COLORS[i % WORKER_COLORS.length]
    });
    start = end;
  }

  // Phase 1: Balanced Chunk Division
  steps.push({
    algorithm: 'parallel_merge',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
    activeWorkerId: null,
    reductionRound: null,
    operation: 'Parallel Stage 1: Balanced Chunk Partitioning',
    elementsInvolved: `Array divided across ${actualWorkers} Worker Processes`,
    why: 'In parallel computing, an array of size N is partitioned into balanced chunks of size ~N/P to be distributed across P concurrent CPU cores.',
    whatChanged: `Created ${actualWorkers} worker chunks: ` + chunks.map(c => `Worker ${c.workerId} [${c.start}..${c.end - 1}]`).join(', '),
    whatNext: 'Dispatch chunks to separate worker processes for concurrent sorting.'
  });

  // Phase 2: Concurrent Worker Sorting
  for (const chunk of chunks) {
    chunk.status = 'Sorting';
    const sub = arr.slice(chunk.start, chunk.end);

    for (let i = 0; i < sub.length; i++) {
      for (let j = 0; j < sub.length - i - 1; j++) {
        comparisons++;
        steps.push({
          algorithm: 'parallel_merge',
          array: clone(arr),
          comparing: [chunk.start + j, chunk.start + j + 1],
          swapping: [],
          sorted: new Set(sorted),
          workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
          activeWorkerId: chunk.workerId,
          operation: `Parallel Stage 2: Worker ${chunk.workerId} Sorting Assigned Chunk`,
          elementsInvolved: `Worker ${chunk.workerId}: array[${chunk.start + j}] (${sub[j]}) vs array[${chunk.start + j + 1}] (${sub[j + 1]})`,
          why: `Worker ${chunk.workerId} executes local sorting independently on its private memory partition without CPU lock contention.`,
          whatChanged: `Worker ${chunk.workerId} evaluating local pair.`,
          whatNext: sub[j] > sub[j + 1] ? 'Swap local chunk elements.' : 'Compare next pair in chunk.'
        });

        if (sub[j] > sub[j + 1]) {
          swaps++;
          [sub[j], sub[j + 1]] = [sub[j + 1], sub[j]];
          arr[chunk.start + j] = sub[j];
          arr[chunk.start + j + 1] = sub[j + 1];

          steps.push({
            algorithm: 'parallel_merge',
            array: clone(arr),
            comparing: [],
            swapping: [chunk.start + j, chunk.start + j + 1],
            sorted: new Set(sorted),
            workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
            activeWorkerId: chunk.workerId,
            operation: `Parallel Stage 2: Worker ${chunk.workerId} Chunk Swap`,
            elementsInvolved: `Worker ${chunk.workerId}: Swapped elements in local chunk`,
            why: `Local chunk element ordering updated within Worker ${chunk.workerId}.`,
            whatChanged: `Local chunk updated.`,
            whatNext: 'Continue local sorting until chunk is fully sorted.'
          });
        }
      }
    }

    for (let idx = 0; idx < sub.length; idx++) {
      arr[chunk.start + idx] = sub[idx];
    }
    chunk.items = [...sub];
    chunk.status = 'Sorted';

    steps.push({
      algorithm: 'parallel_merge',
      array: clone(arr),
      comparing: [],
      swapping: Array.from({ length: chunk.size }, (_, idx) => chunk.start + idx),
      sorted: new Set(sorted),
      workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
      activeWorkerId: chunk.workerId,
      operation: `Worker ${chunk.workerId} Completed Local Chunk Sort`,
      elementsInvolved: `Worker ${chunk.workerId} chunk: [${sub.join(', ')}]`,
      why: `Worker process ${chunk.workerId} has successfully sorted its assigned chunk.`,
      whatChanged: `Worker ${chunk.workerId} status: Sorted.`,
      whatNext: 'Collect all worker chunks for hierarchical tree reduction.'
    });
  }

  // Phase 3: Hierarchical Tree Reduction Merge
  let activeChunks = chunks.map(c => ({
    start: c.start,
    end: c.end,
    workerId: c.workerId
  }));

  let mergeRound = 1;
  while (activeChunks.length > 1) {
    const nextChunks = [];
    for (let i = 0; i < activeChunks.length; i += 2) {
      if (i + 1 < activeChunks.length) {
        const left = activeChunks[i];
        const right = activeChunks[i + 1];

        steps.push({
          algorithm: 'parallel_merge',
          array: clone(arr),
          comparing: [],
          swapping: [],
          sorted: new Set(sorted),
          workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
          activeWorkerId: null,
          reductionRound: mergeRound,
          subrange: [left.start, right.end - 1],
          operation: `Parallel Stage 3: Reduction Round ${mergeRound}`,
          elementsInvolved: `Combining Worker chunk ${left.workerId} and Worker chunk ${right.workerId}`,
          why: `In parallel merge sort, sorted worker sublists are merged pairwise in a binary reduction tree until a single sorted list remains.`,
          whatChanged: `Merging chunks [${left.start}..${left.end - 1}] and [${right.start}..${right.end - 1}].`,
          whatNext: `Compare front elements of both worker chunks.`
        });

        const leftSub = arr.slice(left.start, left.end);
        const rightSub = arr.slice(right.start, right.end);
        let p1 = 0, p2 = 0, target = left.start;

        while (p1 < leftSub.length && p2 < rightSub.length) {
          comparisons++;
          steps.push({
            algorithm: 'parallel_merge',
            array: clone(arr),
            comparing: [left.start + p1, right.start + p2],
            swapping: [],
            sorted: new Set(sorted),
            workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
            reductionRound: mergeRound,
            subrange: [left.start, right.end - 1],
            operation: `Reduction Round ${mergeRound} Comparison`,
            elementsInvolved: `Worker ${left.workerId} (${leftSub[p1]}) vs Worker ${right.workerId} (${rightSub[p2]})`,
            why: `Compare smallest available elements from both worker chunks.`,
            whatChanged: `Inspecting ${leftSub[p1]} and ${rightSub[p2]}.`,
            whatNext: `Place smaller element into position ${target}.`
          });

          if (leftSub[p1] <= rightSub[p2]) {
            arr[target] = leftSub[p1++];
          } else {
            arr[target] = rightSub[p2++];
          }
          swaps++;

          steps.push({
            algorithm: 'parallel_merge',
            array: clone(arr),
            comparing: [],
            swapping: [target],
            sorted: new Set(sorted),
            workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
            reductionRound: mergeRound,
            subrange: [left.start, right.end - 1],
            operation: `Reduction Round ${mergeRound} Placement`,
            elementsInvolved: `Wrote ${arr[target]} into index ${target}`,
            why: `Placed smaller element into the merged array.`,
            whatChanged: `array[${target}] = ${arr[target]}.`,
            whatNext: `Continue merging worker chunks.`
          });
          target++;
        }

        while (p1 < leftSub.length) {
          arr[target] = leftSub[p1++];
          swaps++;
          steps.push({
            algorithm: 'parallel_merge',
            array: clone(arr),
            comparing: [],
            swapping: [target],
            sorted: new Set(sorted),
            workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
            reductionRound: mergeRound,
            subrange: [left.start, right.end - 1],
            operation: `Flushing Leftover Elements from Worker ${left.workerId}`,
            elementsInvolved: `Wrote ${arr[target]} to index ${target}`,
            why: `Remaining elements in Worker ${left.workerId} chunk are already sorted.`,
            whatChanged: `array[${target}] = ${arr[target]}.`,
            whatNext: `Flush next element.`
          });
          target++;
        }

        while (p2 < rightSub.length) {
          arr[target] = rightSub[p2++];
          swaps++;
          steps.push({
            algorithm: 'parallel_merge',
            array: clone(arr),
            comparing: [],
            swapping: [target],
            sorted: new Set(sorted),
            workerChunks: chunks.map(c => ({ ...c, items: [...c.items] })),
            reductionRound: mergeRound,
            subrange: [left.start, right.end - 1],
            operation: `Flushing Leftover Elements from Worker ${right.workerId}`,
            elementsInvolved: `Wrote ${arr[target]} to index ${target}`,
            why: `Remaining elements in Worker ${right.workerId} chunk are already sorted.`,
            whatChanged: `array[${target}] = ${arr[target]}.`,
            whatNext: `Flush next element.`
          });
          target++;
        }

        nextChunks.push({
          start: left.start,
          end: right.end,
          workerId: `${left.workerId}+${right.workerId}`
        });
      } else {
        nextChunks.push(activeChunks[i]);
      }
    }
    activeChunks = nextChunks;
    mergeRound++;
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push({
    algorithm: 'parallel_merge',
    array: clone(arr),
    comparing: [],
    swapping: [],
    sorted: new Set(sorted),
    workerChunks: chunks.map(c => ({ ...c, status: 'Merged' })),
    reductionRound: null,
    operation: 'Parallel Merge Sort Completed',
    elementsInvolved: `Final sorted array: [${arr.join(', ')}]`,
    why: 'All worker chunks have been merged through the reduction tree into the final sorted output.',
    whatChanged: 'Entire array fully sorted.',
    whatNext: 'Sorting complete.'
  });

  return steps;
}

/**
 * Master step factory
 */
export function generateSortingSteps(algoId, array, workerCount = 4) {
  switch (algoId) {
    case 'bubble':
      return generateBubbleSortSteps(array);
    case 'selection':
      return generateSelectionSortSteps(array);
    case 'insertion':
      return generateInsertionSortSteps(array);
    case 'merge':
      return generateMergeSortSteps(array);
    case 'quick':
      return generateQuickSortSteps(array);
    case 'parallel_merge':
      return generateParallelMergeSortSteps(array, workerCount);
    default:
      return generateBubbleSortSteps(array);
  }
}
