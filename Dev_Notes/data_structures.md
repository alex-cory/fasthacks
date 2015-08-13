Data Structures
===============

### Table of Contents
**[Binary Tree](#binary-tree)**
**[Binary Search Tree](#binary-search-tree)**
**[Ternary Tree](#ternary-tree)**

Binary Tree
-----------

Each node has up to 2 leaves. Doesn't matter what the leaf node values are. When
traversing the tree, if you have a perfectly balanced binary tree, "a very simple 
but often overlooked way of doing so"<sub><sup>[[1]][#1]</sup></sub> is by using a 
[storage mapping function][1].


      1
     / \
    2   3


[Reference](http://bit.ly/1WbkQcE)



Binary Search Tree
-----------------

**Complexity:** O(log(n))

Used for searching. A binary tree where the left child contains only nodes with
values less than the parent node, and where the right child only contains nodes
with values greater than the parent.

- The left subtree of a node contains only nodes with keys less than the node’s key.

- The right subtree of a node contains only nodes with keys greater than the node’s key.

- Both the left and right subtrees must also be binary search trees.

Valid BST:

      2
     / \
    1   3

Not Valid BST:

         10
        /  \
       5    15
           /  \
          6    20     <- 6 could never be on the right side of 10

[Reference](http://bit.ly/1WbmCuz)

Implementation:

```java
  bool isBSTInOrder(BinaryTree *root) {
    int prev = INT_MIN;
    return isBSTInOrderHelper(root, prev);
  }
  bool isBSTInOrderHelper(BinaryTree *p, int& prev) {
    if (!p) return true;
    if (isBSTInOrderHelper(p->left, prev)) {
      if (p->data > prev) {
        prev = p->data;
        return isBSTInOrderHelper(p->right, prev);
      } else {
        return false;
      }
    }
    else {
      return false;
    }
  }
```

Binary Tree
-----------

Each node has up to 3 leaves. Doesn't matter what the leaf node values are.

       1
     / | \
    2  1  3

[Reference]()


**NEXT Data Structure
---------------



References
----------

1. [Javascript data structures - the binary tree](http://www.i-programmer.info/programming/javascript/1899-javascript-data-structures-the-binary-tree.html)




[1]: ./storage_mapping_functions.md 'Storage Mapping'
[r]: #references
