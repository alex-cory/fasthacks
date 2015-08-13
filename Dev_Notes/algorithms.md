Algorithms
==========
####(in JavaScript ES6)

### Resources

- [Data Structure Visualizations](http://www.cs.usfca.edu/~galles/visualization/Algorithms.html)

### Table of Contents
**[Insertion Sort](#insertion-sort)**  
**[Bubble Sort](#bubble-sort)**  
**[Selection Sort](#selection-sort)**  
**[Merge Sort](#merge-sort)**  
**[Quick Sort](#merge-sort)**  



Insertion Sort
--------------

- **Definition:** This algorithm separates an array/list of items into two parts, sorted, and unsorted.
The sorted part is on the left.

| Time Complexity                  | Space Complexity    |
|  Best  |   Average   |   Worst   |                     |
| -------------------------------- | :-----------------: |
| `O(n)` |  `O(n²)`    |  `O(n²)`  |       `O(1)`        |

- **Time Complexity:** `O(n²)`

- **Space Complexity:** `O(1)`

#### Implementation

```javascript
function insertionSort(items) {

    var value,                  // the value currently being compared
    i,                          // index into unsorted section
    j;                          // index into sorted section

    for (i=0; i < items.length; i++) {

        // store the current value because it may shift later
        value = items[i];

        /*
         * Whenever the value in the sorted section is greater than the value
         * in the unsorted section, shift all items in the sorted section over
         * by one. This creates space in which to insert the value.
         */
        for (j=i-1; j > -1 && items[j] > value; j--) {
            items[j+1] = items[j];
        }

        items[j+1] = value;
    }

    return items;
}
```

#### Resources

- [Interactive Step Through of Insertion Sort](http://bit.ly/1Kdzmrr)

- [Harvard YouTube Video](http://bit.ly/1Ds5F5k)



Bubble Sort
-----------

- **Definition:** This algorithm sequentially goes through the array and compares two values at a
time, swapping them if necessary. It then repeats the process until no swaps are
required.

| Time Complexity                  | Space Complexity    |
|  Best  |   Average   |   Worst   |                     |
| -------------------------------- | :-----------------: |
| `O(n)` |  `O(n²)`   |  `O(n²)`   |       `O(1)`        |

- **Time Complexity:** `O(n²)`

- **Space Complexity:** `O(1)`

#### Implementation

```javascript
function bubbleSort(items){

    for (var i = 0; i < items.length; i++){

        for (var j = 0; j < items.length - i; j++){

            if (items[j] > items[j+1]){

              var temp = items[j];
              items[j] = items[j+1];
              items[j+1] = temp;
            }
        }
    }

    return items;
}
```

#### Resources

- [Interactive Step Through of Bubble Sort](http://bit.ly/1KdAivY)

- [Harvard YouTube Video](http://bit.ly/1HglMFv)



Selection Sort
--------------

- **Definition:**

    - Assume the first item is the smallest value.

    - Compare this item to the second item.

    - If the second item is smaller than the first, set the second item as the new minimum.

    - Continue until the end of the data set is reached.

    - If the minimum value is not the item you started with, swap them.

| Time Complexity                  | Space Complexity    |
|  Best  |   Average   |   Worst   |                     |
| -------------------------------- | :-----------------: |
| `O(n)` |  `O(n²)`    |  `O(n²)`  |       `O(1)`        |

- **Time Complexity:** `O(n²)`

- **Space Complexity:**

#### Implementation

```javascript
function selectionSort(items){

    for (i=0; i < items.length; i++){

        // Set minimum to this position.
        var min = i;

        // Check the rest of the array to see if anything is smaller.
        for (j=i+1; j < items.length; j++){
            if (items[j] < items[min]){
                min = j;
            }
        }

        // If the minimum isn't in the position, swap it.
        if (i != min){

            // Swapping the items.
            var temp = items[i];
            items[i] = items[min];
            items[min] = temp;
        }
    }

    return items;
}
```

#### Resources

- [Computer Science In JavaScript Article](http://bit.ly/1Nllj6f)

- [Harvard YouTube Video](http://bit.ly/1DrZf66)



Merge Sort
-----------

- **Definition:** It works kind of like this, "Assume you have two lists, list
A and list B. You start from the front of each list and compare the two values.
Whichever value is smaller is inserted into the results array. So suppose the
smaller value is from list A; that value is placed into the results array. Next,
the second value from list A is compared to the first value in list B. Once again,
the smaller of the two values is placed into the results list. So if the smaller
value is now from list B, then the next step is to compare the second item from
list A to the second item in list B."

| Time Complexity                          | Space Complexity    |
|  Best  |    Average     |      Worst     |                     |
| ---------------------------------------- | :-----------------: |
| `O(n)` | `O(n log(n))`  |  `O(n log(n))` |       `O(n)`        |

- **Time Complexity:** `O(n log(n))`

- **Space Complexity:**

#### Implementation

```javascript
function mergeSort(items){

    // Terminal condition - don't need to do anything for arrays with 0 or 1 items
    if (items.length < 2) {
        return items;
    }

    var work = [],
        i,
        len;

    for (i=0, len=items.length; i < len; i++){
        work.push([items[i]]);
    }
    work.push([]);  // In case of odd number of items.

    for (var lim=len; lim > 1; lim = Math.floor((lim+1)/2)){
        for (var j=0,k=0; k < lim; j++, k+=2){
            work[j] = merge(work[k], work[k+1]);
        }
        work[j] = [];  //in case of odd number of items
    }

    return work[0];
}



/**
 * Merges to arrays in order based on their natural
 * relationship. Helper function.
 * @param  {Array} left  The first array to merge.
 * @param  {Array} right The second array to merge.
 * @return {Array}       The merged array.
 */
function merge(left, right){
    var result = [];

    while (left.length > 0 && right.length > 0){
        if (left[0] < right[0]){
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    result = result.concat(left).concat(right);

    // Make sure remaining arrays are empty.
    left.splice(0, left.length);
    right.splice(0, right.length);

    return result;
}
```

#### Resources

- [Computer Science in JavaScript Article](http://bit.ly/1NllGOh)

- [Harvard YouTube Video](http://bit.ly/1gXpCut)




Quick Sort
-----------

- **Definition:**

    - Find a “pivot” item in the array. This item is the basis for comparison
      for a single round.

    - Start a pointer (the left pointer) at the first item in the array.

    - Start a pointer (the right pointer) at the last item in the array.

    - While the value at the left pointer in the array is less than the pivot
      value, move the left pointer to the right (add 1). Continue until the value
      at the left pointer is greater than or equal to the pivot value.

    - While the value at the right pointer in the array is greater than the pivot
      value, move the right pointer to the left (subtract 1). Continue until the
      value at the right pointer is less than or equal to the pivot value.

    - If the left pointer is less than or equal to the right pointer, then swap
      the values at these locations in the array.

    - Move the left pointer to the right by one and the right pointer to the left
      by one.

    - If the left pointer and right pointer don’t meet, go to step 1.

| Time Complexity                         | Space Complexity    |
|  Best         |    Average    | Worst   |                     |
| --------------------------------------- | :-----------------: |
| `O(n log(n))` | `O(n log(n))` | `O(n²)` |     `O(log(n))`     |

- **Time Complexity:** `O(n log(n))`

- **Space Complexity:** `O(log(n))`

#### Implementation
```javascript
function quickSort(items, left, right) {

  // Performance - don't sort an array with zero or one items.
  if (items.length > 1) {

    // Fix left and right values - might not be provided.
    var left    = typeof left != "number" ? 0 : left,
        right   = typeof right != "number" ? items.length - 1 : right,
        // Pivot value is middle item.
        pivot   = items[Math.floor((right + left) / 2)],
        // Starts from left and goes right to pivot index.
        i       = left,
        // Starts from right and goes left to pivot index.
        j       = right;

    // While the two indices don't match.
    while (i <= j) {

      // If the item on the left is less than the pivot, continue right.
      while (items[i] < pivot) {
        i++;
      }

      // If the item on the right is greater than the pivot, continue left.
      while (items[j] > pivot) {
        j--;
      }

      // If the two indices still don't match, swap the values.
      if (i <= j) {

        var temp = items[i];
        items[i] = items[j];
        items[j] = temp;

        // Change indices to continue loop.
        i++;
        j--;
      }
    }

    // Split up the entire array.
    var index = i;

    // If the returned index.
    if (left < index - 1) {
      quickSort(items, left, index - 1);
    }

    if (index < right) {
      quickSort(items, index, right);
    }

  }

  return items;
}
```

#### Resources

- [Computer Science In JavaScript Article](http://bit.ly/1NlmT86)

- [Harvard YouTube Video](http://bit.ly/1Nln03A)



Shell Sort
-----------

- **Definition:** Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
no sea takimata sanctus est Lorem ipsum dolor sit amet.

| Time Complexity                              | Space Complexity    |
|  Best         |    Average    | Worst        |                     |
| -------------------------------------------- | :-----------------: |
| `O(n)`        |`O((nlog(n)²)` |`O((nlog(n)²)`|       `O(1)`        |

- **Time Complexity:** `O(n²) CHANGE`

- **Space Complexity:**

#### Implementation
```javascript

```

#### Resources

- [Computer Algorithms: Shell Sort Article](http://bit.ly/1MYxcBY)
- [YouTube Video](http://bit.ly/1MYxFE9)



**ALOGRITHM
-----------

- **Definition:** Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
no sea takimata sanctus est Lorem ipsum dolor sit amet.

- **Time Complexity:** `O(n²) CHANGE`

- **Space Complexity:**

#### Implementation
```javascript

```

#### Resources

- [EXAMPLE INTERACTIVE OR ARTICLE](http:EXAMPLE.COM)

- [Harvard YouTube Video](http:EXAMPLE.COM)
