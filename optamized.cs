// pseudo code for optamized (kadane):

// currentSum = arr[0]
// bestSum = arr[0]

// for i from 1 to n-1
//     currentSum = max(arr[i], currentSum + arr[i])
//     bestSum = max(bestSum, currentSum)

// return bestSum


// the code:



static int MaxSubarrayKadane(int[] arr)
{
    int currentSum = arr[0];
    int bestSum = arr[0];

    for (int i = 1; i < arr.Length; i++)
    {
        currentSum = Math.Max(arr[i], currentSum + arr[i]);
        bestSum = Math.Max(bestSum, currentSum);
    }

    return bestSum;
}
