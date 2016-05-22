
Shells Comparison
=================

|KEY:     |
|:--------|
|1: best choice
|2: acceptable alternative
|3: poor choice


|  Shell      | Experience |   Editing   |  Shortcuts    | Portability |   Learning       |
|:------------|:-----------|:------------|:--------------|:------------|:-----------------|
|Bourne       |	3	   |	3	 |    1 	 | 	1      | 	 1	  |
|POSIX 	      |	2	   |	1	 |    1 	 | 	1      | 	 2	  |
|C	      |	2	   |	2	 |    3 	 | 	3      | 	 2	  |
|Korn  	      |	1	   |	1	 |    2 	 | 	2      | 	 2	  |
|TC    	      |	2	   |	1	 |    3 	 | 	3      | 	 3	  |
|Bourne Again |	2	   |	1	 |    2 	 | 	2      | 	 3	  |
|Z	      |	2	   |	1	 |    3 	 | 	3      | 	 3	  |



### bash
Bourne-Again Shell. This is a freely-available enhancement of sh written by the GNU project --- but it is not always enhanced along the lines of ksh, and hence in many ways it is very different from zsh. On some free UNIX-like systems such as Linux/GNU (which is what people usually mean by Linux), the command sh is really bash, so there you should be extra careful when trying to ensure that something which runs under the so-called `sh' will also run under zsh. Some Linux systems also have another simpler Bourne shell clone, ash; as it's simpler, it's more like the original Bourne shell.

```
Bash
\\\\.- B orn
 \\\.- A gain
  \\.- S hell
   \.- H ^
```

-----------------------------------------------------------------------------------------------------------

This is an attempt to standardize UNIX shells; it's most like the Korn shell, although, a bit confusingly, it's often just called sh, because the standard says that it should be. Usually, this just means you get a bit extra free with your sh and it still does what you expect. Zsh has made some attempts to fit the standard, but you have to tell it to --- again, simply starting up `zsh' will not have the right settings for that.

``` 
POSIX shell
 \\\\\.- P ortable
  \\\\.- O perating
   \\\.- S ystem
    \\.- I nterface
     \.- X ^ (x stands for interface)
```

-----------------------------------------------------------------------------------------------------------

### zsh

The Z shell is the ultimate shell for feature hungry users. If you can think of something that a shell ought to do, the Z shell probably does it. All that power comes at a price: for example, on HP-UX 10.01, the zsh executable is nearly four times larger than the ksh (Korn shell) executable and almost three time larger than the sh executable (Bourne shell).

I don't think anyone knows all the features of the Z shell, not even the original author, Paul Falstad. Learning even half of the features would be quite an accomplishment, so a rating of 3 was given. However, this does not imply that the Z shell is poorly implemented, designed, or documented; this is strictly a bulk of features issue.

When it comes to command-line editing, Z shell stands head and shoulders over any shell reviewed in this chapter. Z shell handles multi-line commands the best out of all the shells, in my opinion. Each command is an editable buffer unto itself, which makes for easy editing of the command and easy reuse of the entire command, and it retains the original visual look of the command. Z shell has the most completions and expansions. Access to expansion is also the most intuitive. For example, the first press of the Tab key while typing a variable name will complete the variable name, the next Tab will expand the variable's value into the command-line (assuming no ambiguities in the completion). Both bash and tcsh require a separate editor command to expand the variables values (in bash emacs mode, Esc-$ will expand the variable). Z shell supports programmable completions that can even further help with command-line editing. For example, you can program the cd command to use only directories for completions or expansions. Z shell offers spelling correction for pathnames and user IDs. All these features make for a rating of 1 in the editing category.

Z shell receives a 1 and is number 1 when it comes to shortcuts. For example, suppose you have two developers working on a set of files for a project and you want to determine what files will need merging. In order to do that, you need to see which files the two developers have in common in their work directories. Let us further assume you wish to place that list of common files into a file for editing with vi. The edited list contains the candidates for merging. Suppose you are using the C shell (have to pick worst case scenario for illustration). You could use a foreach loop with an if (-e filename) to test for file existence and echo the filename, but the C shell does not allow redirection from the looping constructs. Creating a temporary script is a pain, so it's best to use the UNIX comm command (comm selects or rejects lines common to two sorted files). The following is a sample C shell session, using #'s for comments.


```
zsh shell 
 \\\.- Z
  \\.- S hell
   \.- H ^
```
