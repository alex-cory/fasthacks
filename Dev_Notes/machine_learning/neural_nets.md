Artificial Neural Networks (ANN)
================================
### (aka Neural Nets)

In machine learning and cognitive science, artificial neural networks (ANNs) are a family of models inspired by biological neural networks (the central nervous systems of animals, in particular the brain) and are used to estimate or approximate functions that can depend on a large number of inputs and are generally unknown. Artificial neural networks are generally presented as systems of interconnected "neurons" which exchange messages between each other. The connections have numeric weights that can be tuned based on experience, making neural nets adaptive to inputs and capable of learning.  Neural networks, as used in artificial intelligence, have traditionally been viewed as simplified models of neural processing in the brain, even though the relation between this model and the biological architecture of the brain is debated; it's not clear to what degree artificial neural networks mirror brain function ([src](http://uhaweb.hartford.edu/compsci/neural-networks-definition.html)).

An ANN is typically defined by three types of parameters:
 1. The interconnection pattern between the different layers of neurons
 2. The learning process for updating the weights of the interconnections
 3. The activation function that converts a neuron's weighted input to its output activation.

The cost function `C` is an important concept in learning, as it is a measure of how far away a particular solution is from an optimal solution to the problem to be solved. Learning algorithms search through the solution space to find a function that has the smallest possible cost.

```
C = cost
E = experience
T = tasks
P = performance
```

### History  

Examinations of humans' central nervous systems inspired the concept of artificial neural networks. In an artificial neural network, simple artificial nodes, known as "neurons", "neurodes", "processing elements" or "units", are connected together to form a network which mimics a biological neural network.

### Models  
Neural network models in artificial intelligence are usually referred to as artificial neural networks (ANNs); these are essentially simple mathematical models defining a function  `f : X → Y`  or a distribution over `X` or both `X` and `Y`, but sometimes models are also intimately associated with a particular learning algorithm or learning rule. A common use of the phrase "ANN model" is really the definition of a class of such functions (where members of the class are obtained by varying parameters, connection weights, or specifics of the architecture such as the number of neurons or their connectivity).

### Training Neural Nets
Most of the algorithms used in training artificial neural networks employ some form of gradient descent, using backpropagation to compute the actual gradients. This is done by simply taking the derivative of the cost function with respect to the network parameters and then changing those parameters in a gradient-related direction. The backpropagation training algorithms are usually classified into three categories: steepest descent (with variable learning rate, with variable learning rate and momentum, resilient backpropagation), quasi-Newton (Broyden-Fletcher-Goldfarb-Shanno, one step secant, Levenberg-Marquardt) and conjugate gradient (Fletcher-Reeves update, Polak-Ribiére update, Powell-Beale restart, scaled conjugate gradient)([src](https://www.wikiwand.com/en/Artificial_neural_network#Learning_algorithms)).

### Commonly Used Methods for Training Neural Nets
 - [**Evolutionary algorithm**](https://www.wikiwand.com/en/Evolutionary_methods) - In artificial intelligence, an evolutionary algorithm (EA) is a subset of evolutionary computation, a generic population-based metaheuristic optimization algorithm. An EA uses mechanisms inspired by biological evolution, such as reproduction, mutation, recombination, and selection.
 - [**Gene expression programming**](https://www.wikiwand.com/en/Gene_expression_programming) - In computer programming, gene expression programming (GEP) is an evolutionary algorithm that creates computer programs or models. These computer programs are complex tree structures that learn and adapt by changing their sizes, shapes, and composition, much like a living organism.
 - [**Simulated annealing**](https://www.wikiwand.com/en/Simulated_annealing) - Simulated annealing (SA) is a probabilistic technique for approximating the global optimum of a given function. Specifically, it is a metaheuristic for approximate global optimization in a large search space.
 - [**Expectation–maximization algorithm**](https://www.wikiwand.com/en/Expectation-maximization) - In statistics, an expectation–maximization (EM) algorithm is an iterative method for finding maximum likelihood or maximum a posteriori (MAP) estimates of parameters in statistical models, where the model depends on unobserved latent variables. The EM iteration alternates between performing an expectation (E) step, which creates a function for the expectation of the log-likelihood evaluated using the current estimate for the parameters, and a maximization (M) step, which computes parameters maximizing the expected log-likelihood found on the E step.
 - [**Nonparametric statistics**](https://www.wikiwand.com/en/Non-parametric_methods) - Nonparametric statistics are statistics not based on parameterized families of probability distributions. They include both descriptive and inferential statistics.
 - [**Particle swarm optimization**](https://www.wikiwand.com/en/Particle_swarm_optimization) - In computer science, particle swarm optimization (PSO) is a computational method that optimizes a problem by iteratively trying to improve a candidate solution with regard to a given measure of quality. PSO optimizes a problem by having a population of candidate solutions, here dubbed particles, and moving these particles around in the search-space according to simple mathematical formulae over the particle's position and velocity.
 - 

Types of Neural Nets
--------------------  
 - [**Recurrent neural network**](https://www.wikiwand.com/en/Recurrent_neural_network) - A recurrent neural network (RNN) is a class of artificial neural network where connections between units form a directed cycle. This creates an internal state of the network which allows it to exhibit dynamic temporal behavior.
  - Examples:
   - [Long short-term memory (LSTM)](https://www.wikiwand.com/en/Long_short_term_memory) - Long short-term memory (LSTM) is a recurrent neural network (RNN) architecture (an artificial neural network) published in 1997 by Sepp Hochreiter and Jürgen Schmidhuber. Like most RNNs, an LSTM network is universal in the sense that given enough network units it can compute anything a conventional computer can compute, provided it has the proper weight matrix, which may be viewed as its program.
 - [Neocognitron](https://www.wikiwand.com/en/Neocognitron) - The neocognitron is a hierarchical, multilayered artificial neural network proposed by Kunihiko Fukushima in the 1980s. It has been used for handwritten character recognition and other pattern recognition tasks, and served as the inspiration for convolutional neural networks.
 - [**Feedforward neural network**](https://www.wikiwand.com/en/Feedforward_neural_network) - A feedforward neural network is an artificial neural network where connections between the units do not form a cycle. This is different from recurrent neural networks.
 - [**Multilayer perceptron**](https://www.wikiwand.com/en/Multilayer_perceptron) - A multilayer perceptron (MLP) is a feedforward artificial neural network model that maps sets of input data onto a set of appropriate outputs. An MLP consists of multiple layers of nodes in a directed graph, with each layer fully connected to the next one.
 - [**
 
 
 
Terms
-----  
 - [**Connectionism**](https://www.wikiwand.com/en/Connectionism) - Connectionism is a set of approaches in the fields of artificial intelligence, cognitive psychology, cognitive science, neuroscience, and philosophy of mind, that models mental or behavioral phenomena as the emergent processes of interconnected networks of simple units. The term was introduced by Donald Hebb in 1940s.
 - [**Support vector machine**](https://www.wikiwand.com/en/Support_vector_machine) - In machine learning, support vector machines (SVMs, also support vector networks) are supervised learning models with associated learning algorithms that analyze data and recognize patterns, used for classification and regression analysis. Given a set of training examples, each marked for belonging to one of two categories, an SVM training algorithm builds a model that assigns new examples into one category or the other, making it a non-probabilistic binary linear classifier.
 - [**Linear classifier**](https://www.wikiwand.com/en/Linear_classifier) - In the field of machine learning, the goal of statistical classification is to use an object's characteristics to identify which class (or group) it belongs to. A linear classifier achieves this by making a classification decision based on the value of a linear combination of the characteristics.
 - [**Deep learning**](https://www.wikiwand.com/en/Deep_learning) - Deep learning (deep machine learning, or deep structured learning, or hierarchical learning, or sometimes DL) is a branch of machine learning based on a set of algorithms that attempt to model high-level abstractions in data by using multiple processing layers with complex structures or otherwise, composed of multiple non-linear transformations. Deep learning is part of a broader family of machine learning methods based on learning representations of data.
 - [**Neuromorphic engineering**](https://www.wikiwand.com/en/Neuromorphic_computing) - Neuromorphic engineering, also known as neuromorphic computing, is a concept developed by Carver Mead, in the late 1980s, describing the use of very-large-scale integration (VLSI) systems containing electronic analog circuits to mimic neuro-biological architectures present in the nervous system. In recent times the term neuromorphic has been used to describe analog, digital, and mixed-mode analog/digital VLSI and software systems that implement models of neural systems (for perception, motor control, or multisensory integration).
 - [**Principal component analysis**](https://www.wikiwand.com/en/Principal_component) - Principal component analysis (PCA) is a statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components. The number of principal components is less than or equal to the number of original variables.
 - [**Convolution**](https://www.wikiwand.com/en/Convolution) - In mathematics and, in particular, functional analysis, convolution is a mathematical operation on two functions f and g, producing a third function that is typically viewed as a modified version of one of the original functions, giving the area overlap between the two functions as a function of the amount that one of the original functions is translated. Convolution is similar to cross-correlation.
 - [**Digital data**](https://www.wikiwand.com/en/Digital_data) - Digital data, in information theory and information systems, are discrete, discontinuous representations of information or works, as contrasted with continuous, or analog signals which behave in a continuous manner, or represent information using a continuous function. Although digital representations are the subject matter of discrete mathematics, the information represented can be either discrete, such as numbers and letters, or it can be continuous, such as sounds, images, and other measurements.
 - [**Analog signal**](https://www.wikiwand.com/en/Analog_signal) - An analog or analogue signal is any continuous signal for which the time varying feature (variable) of the signal is a representation of some other time varying quantity, i.e., analogous to another time varying signal. For example, in an analog audio signal, the instantaneous voltage of the signal varies continuously with the pressure of the sound waves.
 - [**Graphics processing unit (GPU)**](https://www.wikiwand.com/en/GPU) - A graphics processing unit (GPU), also occasionally called visual processing unit (VPU), is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display. GPUs are used in embedded systems, mobile phones, personal computers, workstations, and game consoles.
 - [**Visual cortex**](https://www.wikiwand.com/en/Visual_cortex) - The visual cortex of the brain is the part of the cerebral cortex responsible for processing visual information. This article addresses the ventral/dorsal model of the visual cortex.
 - [**Graphical model**](https://www.wikiwand.com/en/Graphical_models) - A graphical model or probabilistic graphical model (PGM) is a probabilistic model for which a graph expresses the conditional dependence structure between random variables.
 - [**Directed acyclic graph**](https://www.wikiwand.com/en/Directed_acyclic_graph) - In mathematics and computer science, a directed acyclic graph (DAG /ˈdæɡ/), is a directed graph with no directed cycles. That is, it is formed by a collection of vertices and directed edges, each edge connecting one vertex to another, such that there is no way to start at some vertex v and follow a sequence of edges that eventually loops back to v again.
 - [**Mathematical optimization**](https://www.wikiwand.com/en/Mathematical_optimization) - In mathematics, computer science and operations research, mathematical optimization (alternatively, optimization or mathematical programming) is the selection of a best element (with regard to some criteria) from some set of available alternatives. In the simplest case, an optimization problem consists of maximizing or minimizing a real function by systematically choosing input values from within an allowed set and computing the value of the function.
 - [**Mean squared error**](https://www.wikiwand.com/en/Mean-squared_error) - In statistics, the mean squared error (MSE) of an estimator measures the average of the squares of the "errors", that is, the difference between the estimator and what is estimated. MSE is a risk function, corresponding to the expected value of the squared error loss or quadratic loss.
 - [**Regression analysis**](https://www.wikiwand.com/en/Regression_analysis) - Also known as _function approximation_, in Models, regression analysis is a statistical process for estimating the relationships among variables. It includes many techniques for modeling and analyzing several variables, when the focus is on the relationship between a dependent variable and one or more independent variables (or 'predictors').
 - [**Markov decision process (MDP)**](https://www.wikiwand.com/en/Markov_decision_process) - Markov decision processes (MDPs) provide a mathematical framework for modeling decision making in situations where outcomes are partly random and partly under the control of a decision maker. MDPs are useful for studying a wide range of optimization problems solved via dynamic programming and reinforcement learning.
 - [**Markov chain (MC)**](https://www.wikiwand.com/en/Markov_chain) - A Markov chain (discrete-time Markov chain or DTMC), named after Andrey Markov, is a random process that undergoes transitions from one state to another on a state space. It must possess a property that is usually characterized as "memorylessness": the probability distribution of the next state depends only on the current state and not on the sequence of events that preceded it. *(The aim is to discover the policy (i.e., the MC) that minimizes the cost in Reinforcement Learning.)*
 - [**Bayesian probability**](https://www.wikiwand.com/en/Bayesian_probability) - Bayesian probability is one interpretation of the concept of probability. In contrast to interpreting probability as frequency or propensity of some phenomenon, Bayesian probability is a quantity that we assign to represent a state of knowledge, or a state of belief.

Algorithms
----------  
 - [**Perceptron**](https://www.wikiwand.com/en/Perceptron) - In machine learning, the perceptron is an algorithm for supervised learning of binary classifiers: functions that can decide whether an input (represented by a vector of numbers) belongs to one class or another. It is a type of linear classifier
 - [**Gradient descent**](https://www.wikiwand.com/en/Gradient_descent) - Gradient descent is a first-order optimization algorithm. To find a local minimum of a function using gradient descent, one takes steps proportional to the negative of the gradient (or of the approximate gradient) of the function at the current point.
 - [**Backpropagation**](https://www.wikiwand.com/en/Backpropagation) - Backpropagation, an abbreviation for "backward propagation of errors", is a common method of training artificial neural networks used in conjunction with an optimization method such as gradient descent. The method calculates the gradient of a loss function with respect to all the weights in the network.
 - [**Expectation–maximization algorithm**](https://www.wikiwand.com/en/Expectation-maximization) - In statistics, an expectation–maximization (EM) algorithm is an iterative method for finding maximum likelihood or maximum a posteriori (MAP) estimates of parameters in statistical models, where the model depends on unobserved latent variables. The EM iteration alternates between performing an expectation (E) step, which creates a function for the expectation of the log-likelihood evaluated using the current estimate for the parameters, and a maximization (M) step, which computes parameters maximizing the expected log-likelihood found on the E step.
 - [**Evolutionary algorithm**](https://www.wikiwand.com/en/Evolutionary_methods) - In artificial intelligence, an evolutionary algorithm (EA) is a subset of evolutionary computation, a generic population-based metaheuristic optimization algorithm. An EA uses mechanisms inspired by biological evolution, such as reproduction, mutation, recombination, and selection.
 

Examples
--------  

Resources
---------  
 - [**MNIST database (Mixed National Institute of Standards and Technology database)**](https://www.wikiwand.com/en/MNIST_database) - The MNIST database is a large database of handwritten digits that is commonly used for training various image processing systems. The database is also widely used for training and testing in the field of machine learning.
 - **Article:** [**Comparison of Feed-Forward Neural Network Training Algorithms for Oscillometric Blood Pressure Estimation**](http://www.researchgate.net/publication/224173336_Comparison_of_Feed-Forward_Neural_Network_training_algorithms_for_oscillometric_blood_pressure_estimation)

Important People 
----------------  
 - [Warren McCulloch](https://www.wikiwand.com/en/Warren_McCulloch) and [Walter Pitts](https://www.wikiwand.com/en/Walter_Pitts) - created a computational model for neural networks based on mathematics and algorithms called threshold logic. ([see here](https://www.wikiwand.com/en/Artificial_neural_network#/History)) 
 - [Donald Hebb](https://www.wikiwand.com/en/Donald_Hebb)  
 - [Wesley A. Clark](https://www.wikiwand.com/en/Wesley_A._Clark)  
 - [Frank Rosenblatt](https://www.wikiwand.com/en/Frank_Rosenblatt)  
 - [Paul Werbos](https://www.wikiwand.com/en/Paul_Werbos) - created the _backpropagation algorithm_ in 1975. 
 - [Jürgen Schmidhuber](https://www.wikiwand.com/en/J%C3%BCrgen_Schmidhuber)  
 - Dan Ciresan
 - [Yann LeCun](https://www.wikiwand.com/en/Yann_LeCun)
 - Kunihiko Fukushima
 - [Torsten Wiesel](https://www.wikiwand.com/en/Torsten_Wiesel)
 - [David H. Hubel](https://www.wikiwand.com/en/David_H._Hubel)
 - [Dimitri Bertsekas](https://www.wikiwand.com/en/Dimitri_Bertsekas)


Conferences  
-----------  
 - [International Conference on Document Analysis and Recognition (ICDAR)](icdar.org)
 - 


Groups
------  


Publications/Journals/Media
---------------------------  

Companies
---------  


Universities/Research Institutions
----------------------------------
 - [**Dalle Molle Institute for Artificial Intelligence Research (IDSIA)**](https://www.wikiwand.com/en/IDSIA) - The Dalle Molle Institute for Artificial Intelligence Research (Italian: Istituto Dalle Molle di Studi sull'Intelligenza Artificiale; IDSIA) was founded in 1988 by Angelo Dalle Molle through the private Fondation Dalle Molle. In 2000 it became a public research institute, affiliated with the University of Lugano and SUPSI in Ticino, Switzerland.
 - **University of Toronto**
 - 


