// pseudo code for optamized (kadane):

// currentSum = arr[0]
// bestSum = arr[0]

// for i from 1 to n-1
//     currentSum = max(arr[i], currentSum + arr[i])
//     bestSum = max(bestSum, currentSum)

// return bestSum


// the code:

function maxSubarrayKadane(arr) {
    let currentSum = arr[0];
    let bestSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        bestSum = Math.max(bestSum, currentSum);
    }

    return bestSum;
}
