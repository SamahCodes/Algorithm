// posedu code for naiev:


// maxSum = -∞

// for i from 0 to n-1
//     currentSum = 0
//     for j from i to n-1
//         currentSum = currentSum + arr[j]
//         maxSum = max(maxSum, currentSum)

// return maxSum


// the code:


static int MaxSubarrayNaive(int[] arr)
{
    int maxSum = int.MinValue;

    for (int i = 0; i < arr.Length; i++)
    {
        int currentSum = 0;
        for (int j = i; j < arr.Length; j++)
        {
            currentSum += arr[j];
            if (currentSum > maxSum)
                maxSum = currentSum;
        }
    }

    return maxSum;
}
