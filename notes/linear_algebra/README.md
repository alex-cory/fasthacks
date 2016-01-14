Linear Algebra: Matrix Transformations
======================================

```
f(x) = x²
|--|  |-|
  |    '- codomain
  '- domain

R                  <- real numbers
f(R²) = R          <- Scalar/real valued function
f(R²) = R³         <- Vector valued function (if codomain greater than domain)
```

Functions are mappings between elements of sets, vectors are elements of sets.

## Vector Transformation  
A function operating on vectors.

```
f(R³) = R²         <- typically people use `T` for transform (ex: T(R³) = R² )
f([ x₁    
    x₂
    x₃ ]) = [ x₁ + 2x₂
                3x₃    ]

f([ 1
    1
    1 ]) = [ (1) + 2(1)
                3(1)    ]

f([ 1
    1
    1 ]) = [ 3
             3 ]
```

## Linear Transformation  
Typically if you start seing things squared or multiplied, it probably won't be linear.  
```
T(Rⁿ) = R^m

<==>          <- if and only if

L.T. <==> vec(a), vec(b) ∈ Rⁿ
          T(vec(a) + vec(b)) = T(vec(a)) + T(vec(b))
          T(vec(a)c) = cT(vec(a))
T(Rⁿ) = R^m
```


