let arr = [];
let algorithm = "";
let mode = "";
let isRunning = false;

// Kadane's algorithm state
let kadaneIndex = 0;
let kadaneCurrentSum = 0;
let kadaneBestSum = -Infinity;
let kadaneStartIdx = 0;
let kadaneEndIdx = 0;
let kadaneCurrentStart = 0;

// Naive algorithm state
let naiveI = 0;
let naiveJ = 0;
let naiveSum = 0;
let naiveBestSum = -Infinity;
let naiveBestStart = 0;
let naiveBestEnd = 0;

let operations = 0;
let totalOperations = 0;

// Preset arrays for testing
const presetArrays = [
  {
    name: 'Classic Example',
    array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    description: 'The classic example: max sum is 6 ([4, -1, 2, 1])',
    maxSum: 6
  },
  {
    name: 'All Positive',
    array: [1, 2, 3, 4, 5],
    description: 'All positive numbers: max sum is entire array (15)',
    maxSum: 15
  },
  {
    name: 'All Negative',
    array: [-5, -2, -8, -1, -3],
    description: 'All negative: max sum is largest single element (-1)',
    maxSum: -1
  },
  {
    name: 'Max at Start',
    array: [10, -2, -3, -4, -5],
    description: 'Maximum subarray starts at beginning: max sum is 10',
    maxSum: 10
  },
  {
    name: 'Max at End',
    array: [-5, -4, -3, -2, 10],
    description: 'Maximum subarray at the end: max sum is 10',
    maxSum: 10
  },
  {
    name: 'Max in Middle',
    array: [-1, -2, 5, 6, 7, -3, -4],
    description: 'Maximum subarray in the middle: max sum is 18',
    maxSum: 18
  },
  {
    name: 'Single Element',
    array: [42],
    description: 'Single element array: max sum is the element itself (42)',
    maxSum: 42
  },
  {
    name: 'With Zeros',
    array: [3, -1, 0, 4, -2, 0, 5],
    description: 'Array with zeros: max sum is 7 ([4, -2, 0, 5])',
    maxSum: 7
  },
  {
    name: 'Large Positive',
    array: [-10, -5, 20, -3, -2],
    description: 'Large positive surrounded by negatives: max sum is 20',
    maxSum: 20
  },
  {
    name: 'Alternating',
    array: [5, -3, 4, -2, 6, -1, 3],
    description: 'Alternating pattern: max sum is 12 ([5, -3, 4, -2, 6, -1, 3])',
    maxSum: 12
  },
  {
    name: 'Complex Case',
    array: [1, -3, 2, 1, -1, 4, -2, 3, -5, 2],
    description: 'Complex case: max sum is 7 ([2, 1, -1, 4, -2, 3])',
    maxSum: 7
  },
  {
    name: 'Edge Case',
    array: [-1, 0, -2, 0, -3],
    description: 'Edge case with zeros and negatives: max sum is 0',
    maxSum: 0
  }
];

// Initialize with one input box 
window.addEventListener('DOMContentLoaded', () => {
  addInput();
  initializePresets();
});

// preset arrays section
function togglePresets() {
  const content = document.getElementById('presetContent');
  const toggle = document.getElementById('presetToggle');
  const icon = toggle.querySelector('.toggle-icon');
  
  if (content.style.display === 'none') {
    content.style.display = 'block';
    icon.classList.add('rotated');
    content.classList.remove('collapsed');
  } else {
    content.style.display = 'none';
    icon.classList.remove('rotated');
    content.classList.add('collapsed');
  }
}

// Array Builder 
function addInput() {
  const container = document.getElementById('arrayInputs');
  const wrapper = document.createElement('div');
  wrapper.className = 'array-input-wrapper';
  
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'array-input';
  input.placeholder = '0';
  input.oninput = updateArray;
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '×';
  removeBtn.onclick = () => {
    wrapper.remove();
    updateArray();
  };
  
  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  container.appendChild(wrapper);
  
  input.focus();
}

function removeInput() {
  const container = document.getElementById('arrayInputs');
  const wrappers = container.querySelectorAll('.array-input-wrapper');
  if (wrappers.length > 1) {
    wrappers[wrappers.length - 1].remove();
    updateArray();
  }
}

function clearAll() {
  const container = document.getElementById('arrayInputs');
  container.innerHTML = '';
  addInput();
  arr = [];
  resetAll();
}

// Preset Arrays 
function initializePresets() {
  const grid = document.getElementById('presetGrid');
  grid.innerHTML = '';
  
  presetArrays.forEach((preset, index) => {
    const button = document.createElement('button');
    button.className = 'preset-btn';
    button.innerHTML = `
      <div class="preset-name">${preset.name}</div>
      <div class="preset-array">[${preset.array.join(', ')}]</div>
      <div class="preset-hint">Max: ${preset.maxSum}</div>
    `;
    button.title = preset.description;
    button.onclick = () => loadPreset(preset.array);
    grid.appendChild(button);
  });
}

function loadPreset(presetArray) {
  // Clear existing inputs
  const container = document.getElementById('arrayInputs');
  container.innerHTML = '';
  
  // Create input boxes for each element in the preset
  presetArray.forEach((value) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'array-input-wrapper';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'array-input';
    input.value = value;
    input.oninput = updateArray;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = () => {
      wrapper.remove();
      updateArray();
    };
    
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
  });
  
  // Update array and render
  arr = [...presetArray];
  isRunning = false;
  
  // Reset state 
  reset();
  document.getElementById('arrayView').innerHTML = '';
  document.getElementById('explanation').innerHTML = '';
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  
  renderArray();
  updateStats();
  

  const grid = document.getElementById('presetGrid');
  grid.style.opacity = '0.7';
  setTimeout(() => {
    grid.style.opacity = '1';
  }, 200);
  
  // Show confirmation message
  const preset = presetArrays.find(p => JSON.stringify(p.array) === JSON.stringify(presetArray));
  if (preset) {
    showExplanation(
      'Preset Loaded ✅',
      `Loaded "${preset.name}": ${preset.description}. Click "Start" to begin visualization.`
    );
  }
}

function updateArray() {
  const inputs = document.querySelectorAll('.array-input');
  arr = Array.from(inputs)
    .map(input => {
      const val = input.value.trim();
      return val === '' || isNaN(val) ? null : Number(val);
    })
    .filter(val => val !== null);
  
  if (!isRunning) {
    renderArray();
  }
}

function getArray() {
  updateArray();
  return arr;
}

// Main Control
function start() {
  arr = getArray();
  
  if (arr.length === 0) {
    alert('Please enter at least one number!');
    return;
  }
  
  algorithm = document.getElementById('algorithm').value;
  mode = document.getElementById('mode').value;
  
  reset();
  isRunning = true;
  
  const nextBtn = document.getElementById('nextBtn');
  if (mode === 'step') {
    nextBtn.disabled = false;
    //first step display
    if (algorithm === 'kadane') {
      showExplanation(
        'Kadane\'s Algorithm - Ready',
        `Starting with element at index 0 (value = ${arr[0]}).<br>Initial currentSum = ${arr[0]}, bestSum = ${arr[0]}.<br><br>Click "Next Step" to continue.`
      );
      renderArray();
    } else {
      //first subarray [0, 0]
      naiveJ = 0;
      showExplanation(
        'Naive Algorithm - Ready',
        `Starting to check all possible subarrays.<br>We'll begin with subarray starting at index 0.<br><br>Click "Next Step" to continue.`
      );
      renderArrayNaive();
    }
  } else {
    nextBtn.disabled = true;
    if (algorithm === 'kadane') {
      kadaneFinal();
    } else {
      naiveFinal();
    }
  }
  
  updateStats();
}

function nextStep() {
  if (!isRunning || mode !== 'step') return;
  
  if (algorithm === 'kadane') {
    kadaneStep();
  } else {
    naiveStep();
  }
}

function reset() {
  kadaneIndex = 0;
  kadaneCurrentSum = arr.length > 0 ? arr[0] : 0;
  kadaneBestSum = arr.length > 0 ? arr[0] : -Infinity;
  kadaneStartIdx = 0;
  kadaneEndIdx = 0;
  kadaneCurrentStart = 0;
  
  naiveI = 0;
  naiveJ = 0;
  naiveSum = 0;
  naiveBestSum = arr.length > 0 ? arr[0] : -Infinity;
  naiveBestStart = 0;
  naiveBestEnd = 0;
  
  operations = 0;
  totalOperations = 0;
  
  if (arr.length > 0) {
    if (algorithm === 'kadane') {
      kadaneBestSum = arr[0];
      kadaneCurrentSum = arr[0];
      kadaneStartIdx = 0;
      kadaneEndIdx = 0;
    } else if (algorithm === 'naive') {
      naiveBestSum = arr[0];
      naiveBestStart = 0;
      naiveBestEnd = 0;
      naiveJ = 0;
    }
  }
}

function resetAll() {
  isRunning = false;
  arr = [];
  reset();
  
  document.getElementById('arrayView').innerHTML = '<p class="placeholder">Enter numbers and click Start to visualize</p>';

  document.getElementById('explanation').innerHTML = '<p class="placeholder">Select algorithm and mode, then click Start to see explanations</p>';
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  
  // Reset stats values but keep the structure
  updateStats();
}

// Kadane's Algorithm
function kadaneStep() {
  if (kadaneIndex >= arr.length - 1) {
    showExplanation(
      'Algorithm Complete ✅',
      `We have finished processing all ${arr.length} elements. The maximum subarray sum is <span class="highlight">${kadaneBestSum}</span>, found in the subarray from index ${kadaneStartIdx} to ${kadaneEndIdx}.`
    );
    isRunning = false;
    document.getElementById('nextBtn').disabled = true;
    highlightBestSubarray();
    return;
  }
  
  kadaneIndex++;
  operations++;
  totalOperations++;
  
  const currentElement = arr[kadaneIndex];
  const startNew = currentElement;
  const extend = kadaneCurrentSum + currentElement;
  
  let explanation = `
    <strong>Step ${kadaneIndex + 1}:</strong> Processing element at index ${kadaneIndex} (value = <span class="highlight">${currentElement}</span>)<br><br>
    We have two choices:<br>
    • <strong>Start new subarray:</strong> ${startNew}<br>
    • <strong>Extend current subarray:</strong> ${extend} (currentSum ${kadaneCurrentSum} + ${currentElement})<br><br>
  `;
  
  if (startNew > extend) {
    kadaneCurrentSum = startNew;
    kadaneCurrentStart = kadaneIndex;
    explanation += `✅ <strong>Decision:</strong> Starting a new subarray gives a better sum (${startNew} > ${extend}).<br>We reset the current subarray to start at index ${kadaneIndex}.`;
  } else {
    kadaneCurrentSum = extend;
    explanation += `✅ <strong>Decision:</strong> Extending the current subarray gives a better sum (${extend} > ${startNew}).<br>We continue the subarray from index ${kadaneCurrentStart}.`;
  }
  
  if (kadaneCurrentSum > kadaneBestSum) {
    kadaneBestSum = kadaneCurrentSum;
    kadaneStartIdx = kadaneCurrentStart;
    kadaneEndIdx = kadaneIndex;
    explanation += `<br><br>🎉 <strong>New best sum found!</strong> Best sum updated to ${kadaneBestSum} (indices ${kadaneStartIdx} to ${kadaneEndIdx}).`;
  } else {
    explanation += `<br><br>Current best sum remains: ${kadaneBestSum}`;
  }
  
  renderArray();
  updateStats();
  showExplanation('Kadane\'s Algorithm - Step by Step', explanation);
}

function kadaneFinal() {
  let current = arr[0];
  let best = arr[0];
  let startIdx = 0;
  let endIdx = 0;
  let currentStart = 0;
  operations = 0;
  
  for (let i = 1; i < arr.length; i++) {
    operations++;
    if (arr[i] > current + arr[i]) {
      current = arr[i];
      currentStart = i;
    } else {
      current = current + arr[i];
    }
    
    if (current > best) {
      best = current;
      startIdx = currentStart;
      endIdx = i;
    }
  }
  
  kadaneBestSum = best;
  kadaneStartIdx = startIdx;
  kadaneEndIdx = endIdx;
  totalOperations = operations;
  
  renderArray();
  highlightBestSubarray();
  showFinalResult('Kadane\'s Algorithm', best, startIdx, endIdx);
}

// Naive Algorithm
function naiveStep() {
  if (naiveI >= arr.length) {
    showExplanation(
      'Algorithm Complete ✅',
      `We have checked all possible subarrays. The maximum subarray sum is <span class="highlight">${naiveBestSum}</span>, found in the subarray from index ${naiveBestStart} to ${naiveBestEnd}.`
    );
    isRunning = false;
    document.getElementById('nextBtn').disabled = true;
    highlightBestSubarray();
    return;
  }
  
  // Calculate sum for current subarray
  if (naiveJ === naiveI) {
    naiveSum = arr[naiveI];
  } else {
    naiveSum += arr[naiveJ];
  }
  
  operations++;
  totalOperations++;
  
  const subarray = arr.slice(naiveI, naiveJ + 1);
  const subarrayStr = `[${subarray.join(', ')}]`;
  
  let explanation = `
    <strong>Step:</strong> Checking subarray starting at index ${naiveI}, ending at index ${naiveJ}<br>
    <strong>Subarray:</strong> ${subarrayStr}<br>
    <strong>Subarray sum:</strong> <span class="highlight">${naiveSum}</span><br><br>
  `;
  
  // Check if this is a new best sum
  const wasNewBest = naiveSum > naiveBestSum;
  
  if (wasNewBest) {
    naiveBestSum = naiveSum;
    naiveBestStart = naiveI;
    naiveBestEnd = naiveJ;
    explanation += `🎉 <strong>New best sum found!</strong> Best sum updated to ${naiveBestSum} (indices ${naiveBestStart} to ${naiveBestEnd}).`;
  } else {
    explanation += `Current best sum: ${naiveBestSum} (not improved).`;
  }
  
  explanation += `<br><br>We will continue checking all subarrays starting from index ${naiveI}.`;
  
  renderArrayNaive();
  updateStats();
  showExplanation('Naive Algorithm - Step by Step', explanation);
  
  // Move to next subarray
  naiveJ++;
  
  if (naiveJ === arr.length) {
    naiveI++;
    naiveJ = naiveI;
    naiveSum = 0;
  }
}

function naiveFinal() {
  let best = -Infinity;
  let bestStart = 0;
  let bestEnd = 0;
  operations = 0;
  
  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    for (let j = i; j < arr.length; j++) {
      sum += arr[j];
      operations++;
      if (sum > best) {
        best = sum;
        bestStart = i;
        bestEnd = j;
      }
    }
  }
  
  naiveBestSum = best;
  naiveBestStart = bestStart;
  naiveBestEnd = bestEnd;
  totalOperations = operations;
  
  renderArray();
  highlightBestSubarray();
  showFinalResult('Naive Algorithm', best, bestStart, bestEnd);
}

// Rendering Functions
function renderArray() {
  const view = document.getElementById('arrayView');
  view.innerHTML = '';
  
  if (arr.length === 0) {
    view.innerHTML = '<p class="placeholder">Enter numbers and click Start to visualize</p>';
    return;
  }
  
  arr.forEach((val, idx) => {
    const element = document.createElement('div');
    element.className = 'element';
    element.textContent = val;
    element.setAttribute('data-index', idx);
    
    if (algorithm === 'kadane' && isRunning) {
      if (idx === kadaneIndex) {
        element.classList.add('active', 'flash');
      }
      if (idx >= kadaneCurrentStart && idx <= kadaneIndex) {
        element.classList.add('in-subarray');
      }
    }
    
    view.appendChild(element);
  });
  
  updateSubarrayInfo();
}

function renderArrayNaive() {
  const view = document.getElementById('arrayView');
  view.innerHTML = '';
  
  arr.forEach((val, idx) => {
    const element = document.createElement('div');
    element.className = 'element';
    element.textContent = val;
    element.setAttribute('data-index', idx);
    
    if (idx >= naiveI && idx <= naiveJ) {
      element.classList.add('active', 'in-subarray');
      if (idx === naiveJ) {
        element.classList.add('flash');
      }
    }
    
    view.appendChild(element);
  });
  
  updateSubarrayInfo();
}

function highlightBestSubarray() {
  const elements = document.querySelectorAll('.element');
  const startIdx = algorithm === 'kadane' ? kadaneStartIdx : naiveBestStart;
  const endIdx = algorithm === 'kadane' ? kadaneEndIdx : naiveBestEnd;
  
  elements.forEach((el, idx) => {
    if (idx >= startIdx && idx <= endIdx) {
      el.classList.add('best-subarray');
    }
  });
}

function updateSubarrayInfo() {
  const info = document.getElementById('subarrayInfo');
  
  if (!isRunning || arr.length === 0) {
    info.textContent = '';
    return;
  }
  
  if (algorithm === 'kadane') {
    const subarray = arr.slice(kadaneCurrentStart, kadaneIndex + 1);
    info.textContent = `Current subarray: [${subarray.join(', ')}] (indices ${kadaneCurrentStart} to ${kadaneIndex})`;
  } else {
    const subarray = arr.slice(naiveI, naiveJ + 1);
    info.textContent = `Checking subarray: [${subarray.join(', ')}] (indices ${naiveI} to ${naiveJ})`;
  }
}

function updateStats() {
  const currentSumEl = document.getElementById('currentSum');
  const bestSumEl = document.getElementById('bestSum');
  const operationsEl = document.getElementById('operations');
  const timeComplexityEl = document.getElementById('timeComplexity');

  if (!currentSumEl || !bestSumEl || !operationsEl || !timeComplexityEl) {
    console.warn('Statistics elements not found. Stats structure may have been cleared.');
    return;
  }
  
  if (algorithm === 'kadane') {
    currentSumEl.textContent = kadaneCurrentSum === undefined || kadaneCurrentSum === -Infinity ? '-' : kadaneCurrentSum.toFixed(2);
    bestSumEl.textContent = kadaneBestSum === undefined || kadaneBestSum === -Infinity ? '-' : kadaneBestSum.toFixed(2);
    timeComplexityEl.textContent = 'O(n)';
  } else if (algorithm === 'naive') {
    currentSumEl.textContent = naiveSum === undefined ? '-' : naiveSum.toFixed(2);
    bestSumEl.textContent = naiveBestSum === undefined || naiveBestSum === -Infinity ? '-' : naiveBestSum.toFixed(2);
    timeComplexityEl.textContent = 'O(n²)';
  } else {

    
    currentSumEl.textContent = '-';
    bestSumEl.textContent = '-';
    timeComplexityEl.textContent = '-';
  }
  
  operationsEl.textContent = totalOperations || 0;
}

function showExplanation(title, content) {
  const explanation = document.getElementById('explanation');
  explanation.innerHTML = `<strong>${title}</strong><br><br>${content}`;
}

function showFinalResult(algorithmName, maxSum, startIdx, endIdx) {
  const resultCard = document.getElementById('resultCard');
  const resultContent = document.getElementById('resultContent');
  
  const subarray = arr.slice(startIdx, endIdx + 1);
  const timeComplexity = algorithm === 'kadane' ? 'O(n)' : 'O(n²)';
  const spaceComplexity = 'O(1)';
  
  let algorithmExplanation = '';
  if (algorithm === 'kadane') {
    algorithmExplanation = `
      <p><strong>How it works:</strong></p>
      <ul>
        <li>Kadane's algorithm processes the array in a single pass (linear time).</li>
        <li>At each position, it decides whether to start a new subarray or extend the current one.</li>
        <li>It maintains two variables: <code>currentSum</code> (sum of current subarray) and <code>bestSum</code> (maximum sum found so far).</li>
        <li>The key insight: if the current sum becomes negative, we should start fresh from the next element.</li>
      </ul>
    `;
  } else {
    algorithmExplanation = `
      <p><strong>How it works:</strong></p>
      <ul>
        <li>The naive approach checks all possible contiguous subarrays.</li>
        <li>For each starting index i, it computes the sum of all subarrays starting at i.</li>
        <li>It compares each sum with the best sum found so far.</li>
        <li>This requires nested loops, resulting in O(n²) time complexity.</li>
      </ul>
    `;
  }
  
  resultContent.innerHTML = `
    <div class="result-sum">${maxSum}</div>
    <div class="result-details">
      <h3>📊 Result Details</h3>
      <p><strong>Maximum Subarray Sum:</strong> <span class="highlight">${maxSum}</span></p>
      <p><strong>Subarray:</strong> [${subarray.join(', ')}]</p>
      <p><strong>Indices:</strong> ${startIdx} to ${endIdx}</p>
      <p><strong>Array Length:</strong> ${arr.length}</p>
      
      <h3>⚡ Performance</h3>
      <p><strong>Time Complexity:</strong> ${timeComplexity}</p>
      <p><strong>Space Complexity:</strong> ${spaceComplexity}</p>
      <p><strong>Total Operations:</strong> ${totalOperations}</p>
      
      ${algorithmExplanation}
    </div>
  `;
  
  resultCard.style.display = 'block';
  
  // Update stats
  document.getElementById('bestSum').textContent = maxSum.toFixed(2);
  document.getElementById('operations').textContent = totalOperations;
  document.getElementById('timeComplexity').textContent = timeComplexity;
  
  showExplanation(
    `${algorithmName} - Final Result`,
    `The algorithm has completed. The maximum subarray sum is <span class="highlight">${maxSum}</span>, found in the subarray [${subarray.join(', ')}] at indices ${startIdx} to ${endIdx}.`
  );
}