 /**
  * REGEX Notes
  *
  * Best Practices:
  *   - Avoid greedy quantifiers
  *   - Don't forget anchors (^ and $)
  *   - Be as specific as possible
  *   - Prefer non-capturing groups (?: )
  *   - Minimize backtracking
  *
  *
  * Articles:
  *   - Vim Regex: http://vimregex.com/#compare
  *
  * Tools:
  *   - Best Tool: http://www.regexr.com/
  * 
  */

/**
 * Notes from this video: http://bit.ly/1IKwGnM
 * Testing: http://leaverou.github.io/regexplained/
 *
 * Regex: A way to describe a set of strings.
 * 
 **The Pattern:
 * 
 *    /pattern/flags
 * 
 *    All regular expressions start with a / and end with a / followed by flags.
 *
 *    /a(b)/cgiI     <= the `cgiI` are all flags
 *
 **Flags:
 *
 *    c  Confirm each substitution
 *    g  Replace all occurrences in the line (without g - only first).
 *    i  Ignore case for the pattern.
 *    I  Don't ignore case for the pattern.
 * 
 ** Metacharacters:
 *    
 *    [ { ( ) \ ^
 *    $ . | ? * +
 *    
 *    . : matches everything except spaces
 *    $ : End match.
 *    [ : 
 *    { : 
 *    ( : Open capturing group.
 *    ) : Close capturing group.
 *    \ : Escape a character.
 *    ^ : Negates a character class if in [] OR matches pattern at beginnig of string.  (See example 8 below)
 *    | : OR                                                                            (i.e. /(ab|ba)/g matches both `ab` and `ba` 
 *    ? : 
 *    * : 
 *    + : 
 *
 *    Most of the time you need to escape the meta characters.
 *    WHAT    DESCRIPTIN                                 EXAMPLE                                VIDEO
 ** Character Classes:
 *    .      = [^\r\n]        Anything Except Linebreak  http://www.regexr.com/3b12c            
 *    \w = [a-zA-Z0-9_]       Word                       http://www.regexr.com/3b126            http://bit.ly/1IKVvQA
 *    \W = [^\w]              Not Word matches           http://www.regexr.com/3b12f
 *                            anything that's not a 
 *                            letter, number, or 
 *                            underscore
 *    \d = [0-9]              Digits                     http://www.regexr.com/3b12i            http://bit.ly/1IKWxMt
 *    \D = [^\d]              Not Digit                  http://www.regexr.com/3b12l
 *    \s ≈ [\t\r\n]           White Space tabs,          http://www.regexr.com/3b12o            http://bit.ly/1IKWFvt
 *                            whitespace, line breaks
 *    \S = [^S]               Not White Space            http://www.regexr.com/3b12r
 *    \b = between \w and \W  Word Boundary never      
 *                            consumes any characters    http://www.regexr.com/3b11q            http://bit.ly/1EUZVzD
 *    \B = btw \w \w or \W \W non word boundary                                                 http://bit.ly/1IKSccf 
 *    [ABC]                   Character Set              http://www.regexr.com/3b12u
 *
 *
 ** Helpful
 *    ?:     = avoid capturing groups                    http://www.regexr.com/3b129
 *    (?=a)  = followed by `a`        (look ahead)       http://www.regexr.com/3b120            http://bit.ly/1IKTT9v  (NOT IN JAVASCRIPT)
 *    (?!a)  = NOT followed by `a`                       http://www.regexr.com/3b131            http://bit.ly/1EVtmBE  (NOT IN JAVASCRIPT)
 *    [^g-z] = negate g-z                                                                       http://bit.ly/1IKWVdS
 * 
 ** Quantifiers:   (aka. specifying how many of a pattern you want to match)   THEY ARE GREEDY
 *    
 *    {n}       : n times                                                                       http://bit.ly/1IKUUyk
 *    {n,}      : at least n times    (aka. greedy)                                             http://bit.ly/1IKV6xs
 *    {m,n}     : at least m times but no more than n times                                     http://bit.ly/1IKV9cP
 *    * = {0,}  : from 0 times to infinity                                                      http://bit.ly/1FmCv9R
 *    + = {1,}  : from 1 time to infinity                                                       http://bit.ly/1FmCsec
 *    ? = {0,1} : if we want something that's maybe there but not always present                http://bit.ly/1B6rhky
 *
 *    Examples: 
 *      1: Match 4 a's in the string.  (http://www.regexr.com/3b11e ) 
 *      
 *        Regex: /a{4}/g
 *        
 *        String: caaaaat 
 *
 *        Match: c[aaaa]at
 *
 *      2: Match at least 10 a's in the string.  (http://www.regexr.com/3b11h) 
 *      
 *        Regex: /a{10,}/g
 *        
 *        String: caaaaat 
 *
 *        Match: c[aaaa]at
 *      
 *      3: Match at least 10 a's in the string.  (http://www.regexr.com/3b11h) 
 *      
 *        Regex: /a{10,}/g
 *        
 *        String: caaaaat 
 *
 *        Match: c[aaaa]at
 *
 *      4: Match 0 to unlimited a's in the string.  (video: http://www.youtube.com/watch?v=EkluES9Rvak&t=5m8s)
 *      
 *        Regex: /a{0,}/g
 *        
 *        String: ct 
 *
 *        Match: c[]t    (that's right, it matches an empty string)
 *
 *      5. Match HTML tags   (video: http://bit.ly/1FmCzqe)
 *        
 *        Regex: /<.+>/g        <= messes up because it's greed
 *
 *        String: "<p>foo</p>"
 *
 *        Match: [<p>foo</p>]
 *        
 *        Regex: /<.+?>/g       <= the question mark makes it match as little as possible
 *
 *        String: "<p>foo</p>"
 *
 *        Match: [<p>]foo</p>    OR   <p>foo[</p>]
 *
 *      6. Match a or b or c    (video: http://bit.ly/1FmCPFG)
 *        
 *        Regex: /[abc]/g
 *
 *        String: a     b       [c]
 *
 *        Match:   [a]   [b]      [c]
 *
 *        Regex: /[abc]+/g
 *
 *        String: abccca
 *
 *        Match:   [abccca]
 *
 *        Regex: /[a-z]+/g
 *
 *        String: asdfasefebjne5%
 *
 *        Match: [asdfasefebjne]5%
 *
 *        Regex: /[a-z0-9_]+/g
 *
 *        String: asdfasefebjne_5%
 *
 *        Match: [asdfasefebjne_5]%
 *
 *        Regex: /[a-z]+/g
 *
 *        String: asdfasefebjne5%
 *
 *        Match: [asdfasefebjne]5%
 *
 *      7. Grab `Script` from `JavaScript` and `ECMAScript` avoiding capturing groups     (vido: http://bit.ly/1Gi3LHj)
 *
 *        Regex: /(?:Java|ECMA)Script/g
 *
 *        String: JavaScript      ECMAScript
 *
 *        Match: [JavaScript]     [ECMAScript]
 *
 *      8. Match a pattern at the beginning of the string.
 *
 *        Regex: /^a/g
 *
 *        String: at
 *
 *        Match: [a]t
 *
 *        Regex:  /[^g-z]/g  matches anything that's not g-z)
 *
 *        String: aaz70xyz
 *
 *        Match: [aa]z[70]xy
 *
 *      
 *
 */


