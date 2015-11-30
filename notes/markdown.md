Markdown
========

Quick reference to markdown syntax.

### Table of Contents

**[Wikipedia-like Citations](#example-table-of-contents)**  
**[Example Table of Contents](#example-table-of-contents)**  
**[Phrase Emphasis](#phrase-emphasis)**  
**[Links](#links)**  
**[Images](#images)**  
**[Lists](#lists)**  
**[Bock Quotes](#block-quotes)**  
**[Code Spans](#code-spans)**  
**[Horizontal Lines](#horizontal-lines)**  
**[Manual Line Breaks](#manual-line-breaks)**  
**[Markdown Comments](#markdown-comments)**  
**[Task Lists](#task-lists)**  
**[Resources](#resources)**  
**[Tools](#tools)**  
**[Libraries](#libraries)**  
**[Todos](#todos)**  

Wikipedia-like Citations
------------------------
```markdown
This is some text where "I'm quoting this part"<sub><sup>[[111]][c]</sub></sup> because it needs cited.

Citations
---------
1. [**^**](#wikipedia-like-citations) [Author, Title, Etc.](http://google.com)

[c]: #citations
```
This is some text where "I'm quoting this part"<sub><sup>[[111]][c]</sub></sup> because it needs cited.

#### Citations
1. [**^**](#wikipedia-like-citations) [Author, Title, Etc.](http://google.com)

[c]: #citations



Small Text
----------
```markdown
The small text looks <sub><sup>really really really<sub><sup>small.
```
The small text looks <sub><sup>really really really</sub></sup>small.


Example Table of Contents
-------------------------

```markdown
Example Table of Contents
--------------------

**[Section A](#section-a)**           <- MAKE SURE YOU HAVE 2 SPACES AFTER EACH LINE
**[Section B](#section-b)**   
**[Section C](#section-c)**   

Section A
---------
<!-- Content A -->
Section B
---------
<!-- Content B -->
Section C
---------
<!-- Content C -->
```

[Edit this doc to see how I did the table of contents here.](https://github.com/alex-cory/fasthacks/edit/master/Dev_Notes/markdown.md)


Phrase Emphasis
---------------
```markdown
*italic*   **bold**
_italic_   __bold__
```
*italic*   **bold**  
_italic_   __bold__

Links
-----
```markdown
[example](http://url.com/ "Title")

OR

An [example][id]. Then, anywhere
else in the doc, define the link:

  [id]: http://example.com/  "Title"
```
[example](http://url.com/ "Title")

OR

An [example][id]. Then, anywhere
else in the doc, define the link:

  [id]: http://example.com/  "Title"
  
Images
------
```markdown
![alt text](/path/img.jpg "Title")

OR

![alt text][id]

[id]: /url/to/img.jpg "Title"
```
![alt text](http://nodejs.ir/img/logodark.png "Title")

OR

![alt text][id]

[id]: http://nodejs.ir/img/logodark.png "Title"


Lists
-----
```markdown
Ordered, without paragraphs:

1.  Foo
2.  Bar

Unordered, with paragraphs:

*   A list item.

    With multiple paragraphs.

*   Bar

You can nest them:

*   Abacus
    * answer
*   Bubbles
    1.  bunk
    2.  bupkis
        * BELITTLER
    3. burper
*   Cunning
```
1.  Foo
2.  Bar

Unordered, with paragraphs:

*   A list item.

    With multiple paragraphs.

*   Bar

You can nest them:

*   Abacus
    * answer
*   Bubbles
    1.  bunk
    2.  bupkis
        * BELITTLER
    3. burper
*   Cunning


Block Quotes
------------
```markdown
> Email-style angle brackets
> are used for blockquotes.

> > And, they can be nested.

> #### Headers in blockquotes
> 
> * You can quote a list.
> * Etc.
```
> Email-style angle brackets
> are used for blockquotes.

> > And, they can be nested.

> #### Headers in blockquotes
> 
> * You can quote a list.
> * Etc.


Code Spans
----------
```markdown
    `<code>` spans are delimited
    by backticks.

    ```javascript
    var listener = node.addEventListener("click", (event) => {
        let _target = event.target;
        this.handleClick(_target);
    });
    ```
    This is a normal paragraph.
    
        This is a preformatted
        code block.
```
`<code>` spans are delimited
by backticks.

```javascript
var listener = node.addEventListener("click", (event) => {
    let _target = event.target;
    this.handleClick(_target);
});
```
This is a normal paragraph.

    This is a preformatted
    code block.


Horizontal Lines
----------------
```markdown
---

* * *

- - - - 
```
---

* * *

- - - - 


Manual Line Breaks
------------------
```markdown
At the end of this line there are 2 spaces.  
This sentence has no spaces after it.
See how this sentence wraps the one above?
```
At the end of this line there are 2 spaces.  
This sentence has no spaces after it.
See how this sentence wraps the one above?


Markdown Comments
-----------------
```markdown
<!-- Markdown comments are the same as html comments. -->
```


Task Lists
-------------------------

```markdown
- [x] This is a complete item
- [ ] This is an incomplete item
```

- [x] This is a complete item
- [ ] This is an incomplete item



Resources
---------

- [Markdown Basics - Github](https://help.github.com/articles/markdown-basics/)  
- [Markdown Cheat Sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)  
- [Github Flavored Markdown Docs](https://help.github.com/articles/github-flavored-markdown/)  
- [Mastering Markdown - Github](https://guides.github.com/features/mastering-markdown/)  
- [Daring Fireball](http://daringfireball.net/projects/markdown/)
- [Dash Docs](https://kapeli.com/dash) (they have a markdown cheatsheet)  


Tools
-----

- [Stack Edit](https://stackedit.io/editor)  
- [Minimalist Online Markdown Editor](http://markdown.pioul.fr/)  
- [Mou](http://25.io/mou/)  


Libraries
---------
- [Marked](https://github.com/chjj/marked)  
- [Remarkable](https://github.com/jonschlinkert/remarkable)  
- [Gitdown](https://github.com/gajus/gitdown)  

Todos
-----
- [ ] Add Wikipedia style citations example
- [ ] videos
- [ ] inline html
- [ ] tables
- [ ] fix syntax highlighting part. (see here: http://bit.ly/1L4HjVA)
- [ ] headers  (see here: http://bit.ly/1L4HjVA)

