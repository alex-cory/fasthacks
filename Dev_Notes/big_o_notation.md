Big O Notation
===============

### Table of Contents
**[Data Structure Operations](#data-structure-operations)**
**[Array Sorting Algorithms](#array-sorting-algorithms)**
**[Graph Operations](#graph-operations)**
**[Heap Operations](#heap-operations)**
**[Heap Operations](#heap-operations)**
**[Big-O Complexity Chart](#big-o-complexity-chart)**



Binary Tree
-----------

| Data Structure     | Time Complexity                                                                                       | Space Complexity    |
|                    | Average                                              | Worst                                          |                     |
|                    |  Access     | Search     |  Insertion |   Deletion   |  Access   | Search |  Insertion   |   Deletion |                     |
| ------------------ | ---------------------------------------------------: | :--------------------------------------------: |                     |
| [Array] [1]        | `O(1)`      |  `O(n)`    |  `O(n)`    | `O(n)`       |  `O(1)`   | `O(n)` |  `O(n)`      |   `O(n)`   | `O(n)`              |
| Stack              | `O(n)`      |  `O(n)`    |  `O(1)`    | `O(1)`       |  `O(n)`   | `O(n)` |  `O(1)`      |   `O(1)`   | `O(n)`              |
| Singly Linked List | `O(n)`      |  `O(n)`    |  `O(1)`    | `O(1)`       |  `O(n)`   | `O(n)` |  `O(1)`      |   `O(1)`   | `O(n)`              |
| Doubly Linked List | `O(n)`      |  `O(n)`    |  `O(1)`    | `O(1)`       |  `O(n)`   | `O(n)` |  `O(1)`      |   `O(1)`   | `O(n)`              |
| Skip List          | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |  `O(n)`   | `O(n)` |  `O(n)`      |   `O(n)`   | `O(n log(n))`       |
| Hash Table         | `-`         | `O(1)`     |  `O(1)`    | `O(1)`       |  `-`      | `O(n)` |  `O(n)`      |   `O(n)`   | `O(n)`              |
| Binary Search Tree | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |  `O(n)`   | `O(n)` |  `O(n)`      |   `O(n)`   | `O(n)`              |
| Cartesian Tree     | `-`         | `O(log(n))`| `O(log(n))`| `O(log(n))`  |  `-`      | `O(n)` |  `O(n)`      |   `O(n)`   | `O(n)`              |
| B-Tree             | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |`O(log(n))`|`O(log(n))`|`O(log(n))`|`O(log(n))` | `O(n)`              |
| Red-Black Tree     | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |`O(log(n))`|`O(log(n))`|`O(log(n))`|`O(log(n))` | `O(n)`              |
| Splay Tree         | `-`         | `O(log(n))`| `O(log(n))`| `O(log(n))`  |  `-`      |`O(log(n))`|`O(log(n))`|`O(log(n))` | `O(n)`              |
| AVL Tree           | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |`O(log(n))`|`O(log(n))`|`O(log(n))`|`O(log(n))` | `O(n)`              |
| [Splay Tree][2]    | `O(log(n))` | `O(log(n))`| `O(log(n))`| `O(log(n))`  |`O(log(n))`|`O(log(n))`|`O(log(n))`|`O(log(n))` | `O(n)`              |

Array Sorting Algorithms
------------------------

| Algorithm      | Time Complexity                           | Space Complexity    |
|                |     Best    |   Average    |   Worst      |                     |
| -------------- | ----------------------------------------- | :-----------------: |
| Quick Sort     |`O(n log(n))`|`O(n log(n))` |  `O(n²)`     |       `O(log(n))`   |
| Merge Sort     |`O(n log(n))`|`O(n log(n))` |`O(n log(n))` |       `O(n)`        |
| Tim Sort       |   `O(n)`    |`O(n log(n))` |`O(n log(n))` |       `O(n)`        |
| Heap Sort      |`O(n log(n))`|`O(n log(n))` |`O(n log(n))` |       `O(1)`        |
| Bubble Sort    | `O(n)`      |  `O(n²)`     |  `O(n²)`     |       `O(1)`        |
| Insertion Sort | `O(n)`      |  `O(n²)`     |  `O(n²)`     |       `O(1)`        |
| Selection  Sort| `O(n²)`     |  `O(n²)`     |  `O(n²)`     |       `O(1)`        |
| Shell  Sort    | `O(n)`      |`O((nlog(n)²)`|`O((nlog(n)²)`|       `O(1)`        |
| Bucket Sort    | `O(n+k)`    |  `O(n+k)`    |  `O(n²)`     |       `O(n)`        |
| Radix Sort     | `O(nk)`     |  `O(nk)`     |  `O(nk)`     |       `O(n+k)`      |



Graph Operations
----------------

| Node/Edge Management | Storage                          | Add Vertex          | Add Edge            | Remove Vertex       | Remove Edge         |   Query   |
| -------------------- | -------------------------------- | :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-------: |
| Adjacent List        | `O(|V|+|E|)`                     | `O(1)`              | `O(1)`              | `O(|V| + |E|)`      | `O(|E|)`            |  `O(|V|)` |
| Incidence List       | `O(|V|+|E|)`                     | `O(1)`              | `O(1)`              | `O(|E|)`            | `O(|E|)`            |  `O(|E|)` |
| Adjacent Matrix      | `O(|V|²)`                        | `O(|V|²)`           | `O(1)`              | `O(|V|²)`           | `O(1)`              |  `O(1)`   |
| Adjacent Matrix      | `O(|V| ⋅ |E|)`                   | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      |  `O(|E|)` |



Heap Operations
---------------

| Types                  | Time Complexity                  |
|                        | Heapify                          | Find Max            | Extract Max         | Increase Key        | Insert              | Delete              | Merge               |
| ---------------------- | -------------------------------- | :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-----------------: |
| Linked List (Sorted)   | `-`                              | `O(1)`              | `O(1)`              | `O(n)`              | `O(n)`              | `O(1)`              | `O(m+n)`            |
| Linked List (Unsorted) | `-`                              | `O(n)`              | `O(n)`              | `O(1)`              | `O(1)`              | `O(1)`              | `O(1)`              |
| Binary Heap            | `O(n)`                           | `O(1)`              | `O(log(n))`         | `O(log(n))`         | `O(log(n))`         | `O(log(n))`         | `O(m+n)`            |
| Binomial Heap          | `-`                              | `O(1)`              | `O(log(n))`         | `O(log(n))`         | `O(1)`              | `O(log(n))`         | `O(log(n))`         |
| Fibonacci Heap         | `-`                              | `O(1)`              | `O(log(n))`         | `O(1)`              | `O(1)`              | `O(log(n))`         | `O(1)`              |

Big-O Complexity Chart
---------------------
![Alt Text](http://bigocheatsheet.com/img/big-o-complexity.png)



[1]: http://bit.ly/1J6KKdZ 'Array:        (wiki)'
[2]: http://bit.ly/1J6Kbkk 'Splay Tree:   (wiki)'
