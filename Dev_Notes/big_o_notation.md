Big O Notation
===============

### Table of Contents  
**[Data Structure Operations](#data-structure-operations)**  
**[Array Sorting Algorithms](#array-sorting-algorithms)**  
**[Graph Operations](#graph-operations)**  
**[Heap Operations](#heap-operations)**  
**[Heap Operations](#heap-operations)**  
**[Big-O Complexity Chart](#big-o-complexity-chart)**  


<!--
Data Structure Operations
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
| :------------: | :---------------------------------------: | :-----------------: |
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

-->




Data Structure Operations
------------------------

<table>
  <col>
  <colgroup span="2"></colgroup>
  <colgroup span="2"></colgroup>
  <tr>
    <th colspan="1" scope="colgroup">Data Structure</th>
    <th colspan="4" scope="colgroup">Time Complexity</th>
    <th colspan="4" scope="colgroup">Space Complexity</th>
    <th colspan="1" scope="colgroup"></th>
  </tr>
  <tr>
    <th colspan="1" scope="colgroup"></th>
    <th colspan="4" scope="colgroup">Average</th>
    <th colspan="4" scope="colgroup">Worst</th>
    <th colspan="1" scope="colgroup"></th>
  </tr>
  <tr>
    <th scope="col"></th>
    <th scope="col">Access</th>
    <th scope="col">Search</th>
    <th scope="col">Insertion</th>
    <th scope="col">Deletion</th>
    <th scope="col">Access</th>
    <th scope="col">Search</th>
    <th scope="col">Insertion</th>
    <th scope="col">Deletion</th>
    <th scope="col">Time</th>
  </tr>
<tr>
<td>Array</td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Stack</td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Singly Linked List</td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Doubly Linked List</td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Skip List</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n log(n))</code></td>
</tr>
<tr>
<td>Hash Table</td>
<td><code>-</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>-</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Binary Search Tree</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Cartesian Tree</td>
<td><code>-</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>-</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>B-Tree</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Red-Bl Tree</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Splay Tree</td>
<td><code>-</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>-</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>AVL Tree</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Splay Tree</td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(n)</code></td>
</tr>

</table>





Array Sorting Algorithms
------------------------

<table>
<thead>
<tr>
  <tr>
    <th colspan="1" scope="colgroup">Algorithm</th>
    <th colspan="3" scope="colgroup">Time Complexity</th>
    <th colspan="1" scope="colgroup">Space Complexity</th>
  </tr>
<th></th>
<th>Best</th>
<th>Average</th>
<th>Worst</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>Quick Sort</td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n²)</code></td>
<td><code>O(log(n))</code></td>
</tr>
<tr>
<td>Merge Sort</td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Tim Sort</td>
<td><code>O(n)</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Heap Sort</td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(n log(n))</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Bubble Sort</td>
<td><code>O(n)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Insertion Sort</td>
<td><code>O(n)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Selection  Sort</td>
<td><code>O(n²)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Shell  Sort</td>
<td><code>O(n)</code></td>
<td><code>O((nlog(n)²)</code></td>
<td><code>O((nlog(n)²)</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Bucket Sort</td>
<td><code>O(n+k)</code></td>
<td><code>O(n+k)</code></td>
<td><code>O(n²)</code></td>
<td><code>O(n)</code></td>
</tr>
<tr>
<td>Radix Sort</td>
<td><code>O(nk)</code></td>
<td><code>O(nk)</code></td>
<td><code>O(nk)</code></td>
<td><code>O(n+k)</code></td>
</tr>
</tbody>
</table>




Graph Operations
----------------

| Node/Edge Management | Storage| Add Vertex  | Add Edge  | Remove Vertex       | Remove Edge         |   Query   |
| -------------------- | -------------------------------- | :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-------: |
| Adjacent List        | `O(|V|+|E|)`                     | `O(1)`              | `O(1)`              | `O(|V| + |E|)`      | `O(|E|)`            |  `O(|V|)` |
| Incidence List       | `O(|V|+|E|)`                     | `O(1)`              | `O(1)`              | `O(|E|)`            | `O(|E|)`            |  `O(|E|)` |
| Adjacent Matrix      | `O(|V|²)`                        | `O(|V|²)`           | `O(1)`              | `O(|V|²)`           | `O(1)`              |  `O(1)`   |
| Adjacent Matrix      | `O(|V| ⋅ |E|)`                   | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      | `O(|V| ⋅ |E|)`      |  `O(|E|)` |



Heap Operations
---------------

<table>
<thead>
<tr>

  <tr>
    <th colspan="1" scope="colgroup">Types</th>
    <th colspan="7" scope="colgroup">Time Complexity</th>
  </tr>
  <th></th>
<th>Heapify</th>
<th>Find Max</th>
<th>Extract Max</th>
<th>Increase Key</th>
<th>Insert</th>
<th>Delete</th>
<th>Merge</th>
</tr>
</thead>
<tbody>
<tr>
<td>Linked List (Sorted)</td>
<td><code>-</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(m+n)</code></td>
</tr>
<tr>
<td>Linked List (Unsorted)</td>
<td><code>-</code></td>
<td><code>O(n)</code></td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
</tr>
<tr>
<td>Binary Heap</td>
<td><code>O(n)</code></td>
<td><code>O(1)</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(m+n)</code></td>
</tr>
<tr>
<td>Binomial Heap</td>
<td><code>-</code></td>
<td><code>O(1)</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(1)</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(log(n))</code></td>
</tr>
<tr>
<td>Fibonacci Heap</td>
<td><code>-</code></td>
<td><code>O(1)</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(1)</code></td>
<td><code>O(1)</code></td>
<td><code>O(log(n))</code></td>
<td><code>O(1)</code></td>
</tr>
</tbody>
</table>


Big-O Complexity Chart
---------------------
![Alt Text](http://bigocheatsheet.com/img/big-o-complexity.png)



[1]: http://bit.ly/1J6KKdZ 'Array:        (wiki)'
[2]: http://bit.ly/1J6Kbkk 'Splay Tree:   (wiki)'
