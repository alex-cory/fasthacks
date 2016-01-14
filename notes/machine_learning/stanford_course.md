Stanford Machine Learning
=========================

Problem 1: Predicting Housing Prices
------------------------------------

#### Training Examples

| Size of House (ft²) | # Bedrooms | $ Worth (1,000s) |
| ------------------- | ---------- | ---------------- |
| 2104                | 3          | 400              |
| 1406                | 2          | 232              |
| 1539                | 3          | 315              |
| 852                 | 2          | 178              |
| 1440                | 4          | 240              |

```
m = # training examples
x = "input" variables / features
y = "output" variable / "target" variable
(x, y) = training example
(x^i, y^i) = i^th training example   (aka the specific row, where _i_ represents the index into that certain row)


                          .----------------.
                         | Trainig Examples |
                          '----------------'
                                  ↓
                         .------------------.
                        | Learning Algorithm |
                         '------------------'
                                  ↓
                       .---------------------.
Ex: New Living Area → | h (hypothosis/output) |  → Estimated Price
         (x)           '---------------------'          (y)
```

#### Linear Representation  
```
h(x) = 𝚹₀ + 𝚹₁x

n  = # features
𝚹  = parameters

x₀ = 1
x₁ = Size ft²
x₂ = # bedrooms

h(x) = hₔ(x) = 𝚹₀ + 𝚹₁x₁ + 𝚹₂x₂    <- supposed to be `h` subscript theta of `x`
       n
h(x) = Σ 𝚹ᵢxᵢ = (𝚹^t)x             <- sum from 0 to `n`.  Theta to the t times x is `transpose`
      i=0
         n
j(𝚹) = ½ Σ (h𝚹                     <- j(𝚹) basically represents the "y" axis ***COME BACK TO THIS
        i=1
```


#### Gradient Descent  
(Stanford Lecture 2: roughly 33 min in)  
```
𝚹 = 0
𝚹ᵢ := 𝚹ᵢ + 𝛂(2/𝚹ᵢ)j(𝚹)             <- the `:=` notation is just overwriting the variable

... add some calculations

𝚹ᵢ := 𝚹ᵢ - 𝛂(h(x) - y)yᵢ           <- 𝛂 = paramater called the `learning rate`
```
