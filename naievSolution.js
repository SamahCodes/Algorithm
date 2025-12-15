// posedu code for naiev:


// maxSum = -∞

// for i from 0 to n-1
//     currentSum = 0
//     for j from i to n-1
//         currentSum = currentSum + arr[j]
//         maxSum = max(maxSum, currentSum)

// return maxSum


// the code:

function maxSubarrayNaive(arr) {
    let maxSum = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        let currentSum = 0;
        for (let j = i; j < arr.length; j++) {
            currentSum += arr[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}
