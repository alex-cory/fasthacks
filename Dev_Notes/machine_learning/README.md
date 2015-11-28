
Machine Learning
================

Overview
--------
It’s a subfield of computer science stemming from _pattern recogintion_ and  _computational learning theory_ in artificial intelligence. In industrial context, could be referred to as _predictive analytics_ or _predictive modeling._  "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E <sub><sup>(Tom M. Mitchell)<sub><sup>".

Types of Learning
-----------------
### Supervised Learning
- The program is given example inputs and desired outputs given by a "teacher" where the goal is to learn a rule that maps inputs to outputs.
- [Wikipedia](sl-wiki)

### Unsupervised Learning
- No labels are provided to the algorithm leaving it alone to figure out structure to it's input. Discovering hidden inputs in data.
- [Wikipedia](ul-wiki)

### Reinforcement Learning
- A computer program interacts with a dynamic environment in which it must perform a certain goal (such as driving a vehicle), without a teacher explicitly telling it whether it has come close to its goal or not. Another example is learning to play a game by playing against an opponent.
- [Wikipedia](rl-wiki)
 
### [Deep Learning](./deep_learning.md)
- A class of machine learning algorithms.
- [Wikipedia](dl-wiki)


### Other Types of Learning
- [Classification]()
- [Regression]()
- [Clustering]()
- [Density Estimation]()
- [Dimensionality Reduction]()
- [Topic Modeling]()

#### Difference Between Datamining & Machine Learning
 - Machine learning:
   - focuses on prediction, based on known properties learned from the training data
   - usually evaluated with respect to the ability to reproduce known knowledge
 - Data mining:
  - focuses on the discovery of (previously) unknown properties in the data. This is the analysis step of Knowledge Discovery in Databases.
  - the key task is the discovery of previously unknown knowledge

Terms
-----
 - [**Rule Induction**](https://www.wikiwand.com/en/Rule_induction) -  an area of machine learning in which formal rules are extracted from a set of observations. The rules extracted may represent a full scientific model of the data, or merely represent local patterns in the data.
 - [**Dominance-based rough set approach**](https://www.wikiwand.com/en/Dominance-based_rough_set_approach) - Dominance-based rough set approach (DRSA) is an extension of rough set theory for multi-criteria decision analysis (MCDA), introduced by Greco, Matarazzo and Słowiński.
 - [**Evolutionary multimodal optimization**](https://www.wikiwand.com/en/Evolutionary_multimodal_optimization) - In applied mathematics, multimodal optimization deals with optimization tasks that involve finding all or most of the multiple solutions (as opposed to a single best solution) to a problem.
 - [**GeneRec**](https://www.wikiwand.com/en/GeneRec) - GeneRec is a generalization of the **[[Recirculation algorithm]]**, and approximates **[[Almeida-Pineda recurrent backpropagation]]**. It is used as part of the **[[Leabra algorithm]]** for error-driven learning.
 - [**Hyper basis function network**](https://www.wikiwand.com/en/Hyper_basis_function_network) - In machine learning, a Hyper basis function network, or HyperBF network, is a generalization of **[[radial basis function (RBF) networks]]** concept, where the Mahalanobis-like distance is used instead of Euclidean distance measure. Hyper basis function networks were first introduced by Poggio and Girosi in the 1990 paper “Networks for Approximation and Learning”.
 - [**IDistance**](https://www.wikiwand.com/en/IDistance) - In pattern recognition, the iDistance is an indexing and query processing technique for k-nearest neighbor queries on point data in multi-dimensional metric spaces. The kNN query is one of the hardest problems on multi-dimensional data, especially when the dimensionality of the data is high.
 - [**Kernel methods for vector output**](https://www.wikiwand.com/en/Kernel_methods_for_vector_output) - Kernel methods are a well-established tool to analyze the relationship between input data and the corresponding output of a function. Kernels encapsulate the properties of functions in a computationally efficient way and allow algorithms to easily swap functions of varying complexity.
 - [**Kernel principal component analysis**]() - In the field of multivariate statistics, kernel principal component analysis (kernel PCA) is an extension of **[[principal component analysis (PCA)]]** using techniques of kernel methods.
 - [**Logic learning machine (LLM)**]() - a machine learning method based on the generation of intelligible rules. LLM is an efficient implementation of the **[[Switching Neural Network (SNN) paradigm]]**, developed by Marco Muselli, from the Italian National Research Council.
 - [**Regression**]() - 
 - 
 
Algorithms
----------
 - [**Backpropagation**](bp) - an abbreviation for "backward propagation of errors", is a common method of training artificial neural networks used in conjunction with an optimization method such as gradient descent. The method calculates the gradient of a loss function with respect to all the weights in the network.
  - [**Almeida–Pineda recurrent backpropagation**](https://www.wikiwand.com/en/Almeida%E2%80%93Pineda_recurrent_backpropagation) - It is an extension to the backpropagation algorithm that is applicable to recurrent neural networks. It is a type of supervised learning.
 - [**Bootstrap aggregating**](https://www.wikiwand.com/en/Bootstrap_aggregating) - Also called bagging, is a machine learning ensemble meta-algorithm designed to improve the stability and accuracy of machine learning algorithms used in statistical classification and regression. It also reduces variance and helps to avoid overfitting.
 - [**CN2 algorithm**](https://www.wikiwand.com/en/CN2_algorithm) - It's an induction algorithm is a learning algorithm for rule induction. It is designed to work even when the training data is imperfect.
 - [**Constructing skill trees**](https://www.wikiwand.com/en/Constructing_skill_trees) (CST) - a hierarchical reinforcement learning algorithm which can build **[[skill trees]]** from a set of sample solution trajectories obtained from demonstration. CST uses an **[[incremental MAP(maximum a posteriori ) change point detection algorithm]]** to segment each demonstration trajectory into skills and integrate the results into a skill tree.
 - [**Diffusion map**](https://www.wikiwand.com/en/Diffusion_map) - Diffusion maps is a dimensionality reduction or feature extraction algorithm introduced by R. R. Coifman and S. Lafon.
 - [**Dynamic time warping**](https://www.wikiwand.com/en/Dynamic_time_warping) - In time series analysis, dynamic time warping (DTW) is an algorithm for measuring similarity between two temporal sequences which may vary in time or speed. For instance, similarities in walking patterns could be detected using DTW, even if one person was walking faster than the other, or if there were accelerations and decelerations during the course of an observation.
 - [**Expectation–maximization algorithm**](https://www.wikiwand.com/en/Expectation%E2%80%93maximization_algorithm) - In statistics, an expectation–maximization (EM) algorithm is an iterative method for finding maximum likelihood or maximum a posteriori (MAP) estimates of parameters in statistical models, where the model depends on unobserved latent variables. The EM iteration alternates between performing an expectation (E) step, which creates a function for the expectation of the log-likelihood evaluated using the current estimate for the parameters, and a maximization (M) step, which computes parameters maximizing the expected log-likelihood found on the E step.
 - [**FastICA**](https://www.wikiwand.com/en/FastICA) - FastICA is an efficient and popular algorithm for independent component analysis invented by Aapo Hyvärinen at Helsinki University of Technology. Like most ICA algorithms, FastICA seeks an orthogonal rotation of prewhitened data, through a fixed-point iteration scheme, that maximizes a measure of non-Gaussianity of the rotated components.
 - [**Forward–backward algorithm**](https://www.wikiwand.com/en/Forward%E2%80%93backward_algorithm) - The forward–backward algorithm is an inference algorithm for hidden Markov models which computes the posterior marginals of all hidden state variables given a sequence of observations/emissions , i.e. it computes, for all hidden state variables , the distribution.
 - [**Genetic Algorithm for Rule Set Production**](https://www.wikiwand.com/en/Genetic_Algorithm_for_Rule_Set_Production) (GARP) - a computer program based on genetic algorithm that creates ecological niche models for species. The generated models describe environmental conditions (precipitation, temperatures, elevation, etc.) under which the species should be able to maintain populations.
 - [**Growing self-organizing map**](https://www.wikiwand.com/en/Growing_self-organizing_map) - A growing self-organizing map (GSOM) is a growing variant of the popular self-organizing map (SOM). The GSOM was developed to address the issue of identifying a suitable map size in the SOM.
 - [**HEXQ**](https://www.wikiwand.com/en/HEXQ) - a reinforcement learning algorithm created by Bernhard Hengst, which attempts to solve a Markov Decision Process by decomposing it hierarchically. Bernhard Hengst (2002).
 - [**K-nearest neighbors algorithm**]() - In pattern recognition, the k-Nearest Neighbors algorithm (or k-NN for short) is a non-parametric method used for classification and regression. In both cases, the input consists of the k closest training examples in the feature space.
 - [**Leabra**](https://www.wikiwand.com/en/Leabra) - stands for "Local, Error-driven and Associative, Biologically Realistic Algorithm". It is a model of learning which is a balance between **[[Hebbian]]** and error-driven learning with other network-derived characteristics.
 - [**Linde–Buzo–Gray algorithm**](https://www.wikiwand.com/en/Linde%E2%80%93Buzo%E2%80%93Gray_algorithm) - The Linde–Buzo–Gray algorithm (introduced by Yoseph Linde, Andrés Buzo and Robert M. Gray in 1980) is a vector quantization algorithm to derive a good codebook.
 - [**Local outlier factor**](https://www.wikiwand.com/en/Local_outlier_factor) - In anomaly detection, the local outlier factor (LOF) is an algorithm proposed by Markus M. Breunig, Hans-Peter Kriegel, Raymond T.
 - [**LogitBoost**](https://www.wikiwand.com/en/LogitBoost) - In machine learning and computational learning theory, LogitBoost is a boosting algorithm formulated by Jerome Friedman, Trevor Hastie, and Robert Tibshirani. The original paper casts the AdaBoost algorithm into a statistical framework.
 - 

Examples
--------
 - spam filtering
 - OCR (optical character recognition)
 - search engines
 - computer vision

Resources
---------
 - [Machine Learning Wikipedia](https://www.wikiwand.com/en/Machine_learning)
 - 


Important People 
----------------
([machine learning researchers](https://www.wikiwand.com/en/Category:Machine_learning_researchers))  
 - [Arthur Samuel](https://www.wikiwand.com/en/Arthur_Samuel)
 - [Tom M. Mitchel](https://www.wikiwand.com/en/Tom_M._Mitchell)
 - [John Hopfield](https://www.wikiwand.com/en/John_Hopfield)
 - [David Rumelhart](https://www.wikiwand.com/en/David_Rumelhart)
 - [Geoffrey Hinton](https://www.wikiwand.com/en/Geoff_Hinton)
 - 

Conferences
-----------
 - [ICML](http://icml.cc/) (International Conference on Machine Learning)
 - [NIPS](https://nips.cc/) (Conference on Neural Information Processing Systems)
 - [KDD](http://www.kdd.org/) (Knowledge Discovery from Data) - 1: The Association for Computing Machinery's Special Interest Group on Knowledge Discovery and Data Mining. 2: The community for data mining, data science and analytics
 - [ICDM](http://www.data-mining-forum.de/) (IEEE International Conference on Data Mining) - 
 - [SDM]() () - 
 

Groups
------
 - [IMLS](http://www.machinelearning.org/) (International Machine Learning Society)
 - [SIAM](http://www.siam.org/) (Society for Industrial and Applied Mathematics)


Publications/Journals/Media
---------------------------
 - [JMLR](http://jmlr.csail.mit.edu/papers/) (Journal of Machine Learning Research) - a scientific journal focusing on machine learning.
 - [Machine Learning Journal](http://www.springer.com/computer/ai/journal/10994)
 - [Machine Learning Open Source Software](http://www.jmlr.org/mloss/) - publishes contributions related to implementations of non-trivial machine learning algorithms, toolboxes or even languages for scientific computing.
 - [Kdnuggets](http://www.kdnuggets.com/2013/11/top-conferences-data-mining-data-science.html) - Great articles on machine learning
 - 
 
Companies
---------
 - [Google DeepMind](http://deepmind.com/)
  - [Wikipedia](https://www.wikiwand.com/en/Google_DeepMind)


<!--[c]: #citations-->
[sl]: 
[sl-wiki]: https://www.wikiwand.com/en/Supervised_learning
[ul]: 
[ul-wiki]: https://www.wikiwand.com/en/Unsupervised_learning
[rl-wiki]: https://www.wikiwand.com/en/Reinforcement_learning
[rl]: 
[dl-wiki]: https://www.wikiwand.com/en/Deep_learning
[dl]: 
[dl-lib1]:
[dl-lib1-wiki]: https://www.wikiwand.com/en/TensorFlow
[dl-lib2]: 
[dl-lib2-wiki]: https://www.wikiwand.com/en/Torch_(machine_learning)
[dl-lib3]: 
[dl-lib3-wiki]: 
[dl-lib4]: 
[dl-lib4-wiki]: 
[dl-lib5]: 
[dl-lib5-wiki]: 
[bp]: https://www.wikiwand.com/en/Backpropagation
