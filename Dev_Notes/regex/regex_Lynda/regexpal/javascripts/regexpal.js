/*
  RegexPal 0.1.4 (modified)
  Modified version:
    (c) 2011 lynda.com
  Original version:
    (c) 2007 Steven Levithan <http://stevenlevithan.com>
    GNU LGPL 3.0 license
*/


//---------------------------------------------------------------------+
// The RegexPal namespace
//---------------------------------------------------------------------+

var RegexPal = {
  /* Store DOM node references for quick lookup */
  fields: {
    search: new SmartField("search"),
    input:  new SmartField("input"),
    options: {
      flags: {
        g: $("flagG"),
        i: $("flagI"),
        m: $("flagM"),
        s: $("flagS")
      },
      highlightSyntax:  $("highlightSyntax"),
      highlightMatches: $("highlightMatches"),
      invertMatches:    $("invertMatches")
    }
  }
};

extend(RegexPal, function () {
  // Make property shortcuts available to all methods of the returned object through closure...
  var f = RegexPal.fields,
    o = f.options;

  return {
    highlightMatches: function () {
      // Cache the regexes through closure...
      var re = {
        /* If the matchPair regex seems a little crazy, the theory behind it is that it will be faster than using lazy quantification */
        matchPair: /`~\{((?:[^}]+|\}(?!~`))*)\}~`((?:[^`]+|`(?!~\{(?:[^}]+|\}(?!~`))*\}~`))*)(?:`~\{((?:[^}]+|\}(?!~`))*)\}~`)?/g,
        sansTrailingAlternator: /^(?:[^\\|]+|\\[\S\s]?|\|(?=[\S\s]))*/
      };

      return function () {
        var search = String(f.search.textbox.value),
          input  = String(f.input.textbox.value);

        /* Abort if the user's regex contains an error (the test regex accounts for IE's changes to innerHTML).
        The syntax highlighting catches a number of mistakes and cross-browser issues which might not cause the
        browser to throw an error. Also abort if the search is empty and not using the invert results option, or
        if match highlighting is disabled. */
        if (
          XRegExp.cache('<[bB] class="?err"?>').test(f.search.bg.innerHTML) ||
          (!search.length && !o.invertMatches.checked) ||
          !o.highlightMatches.checked
        ) {
          f.input.clearBg();
          return;
        }

        try {
          /* If existing, a single trailing vertical bar (|) is removed from the regex which is to be applied
          to the input text. This behavior is copied from RegexBuddy, and offers faster results and a less
          surprising experience while the user is in the middle of creating a regex. */
          var searchRegex = new XRegExp(re.sansTrailingAlternator.exec(search)[0],
            (o.flags.g.checked ? "g" : "") +
            (o.flags.i.checked ? "i" : "") +
            (o.flags.m.checked ? "m" : "") +
            (o.flags.s.checked ? "s" : "")
          );
        /* An error should never be thrown if syntax highlighting and XRegExp are working correctly, but the
        potential is avoided nonetheless. Safari in particular has several strange bugs which cause its regex
        engine's parser to barf during compilation. */
        } catch (err) {
          f.input.clearBg();
          return;
        }

        // Matches are never looped over, for performance reasons...

        /* Initially, "`~{...}~`" is used as a safe string to encapsulate matches. Note that if such an
        unlikely sequence appears in the text, you might receive incorrect results. */
        if (o.invertMatches.checked) {
          var output = ("`~{" +
                        input.replace(searchRegex, "}~`$&`~{") +
                        "}~`")
                       /* Remove zero-length matches, and combine adjacent matches */
                       .replace(XRegExp.cache("`~\\{\\}~`|\\}~``~\\{", "g"), "");
        } else {
          var output = input.replace(searchRegex, "`~{$&}~`");
        }
        /* Put all matches within alternating <b> and <i> elements (short element names speed up markup
        generation). Angled brackets and ampersands are first replaced, to avoid unintended HTML markup
        within the background <pre> element. */
        output = output
          .replace(XRegExp.cache("[<&>]", "g"), "_")
          .replace(re.matchPair, "<b>$1</b>$2<i>$3</i>");

        f.input.setBgHtml(output);
      };
    }(),

    highlightSearchSyntax: function () {
      if (o.highlightSyntax.checked) {
        f.search.setBgHtml(parseRegex(f.search.textbox.value));
      } else {
        f.search.clearBg();
      }
    },

    permalink: function () {
      var flagsStr = (o.flags.i.checked ? "i" : "") + (o.flags.m.checked ? "m" : "") + (o.flags.s.checked ? "s" : ""),
        regexStr = encodeURIComponent(f.search.textbox.value),
        inputStr = encodeURIComponent(f.input.textbox.value);

      location = "./?flags=" + flagsStr + "&regex=" + regexStr + "&input=" + inputStr;
    }
  };
}());


//---------------------------------------------------------------------+
// parseRegex
//---------------------------------------------------------------------+

var parseRegex = function () {
  /* Even for JavaScript's relatively simple flavor, regex syntax parsing is complicated
  (IMO more so than for e.g. CSS or HTML), partly due to the many backwards and forwards
  context-sensitivity issues. This code is tailored for RegexPal's needs (e.g., no
  representative object is constructed). */

  // Cache through closure...
  //------------------------------------------------------->
  var re = {
      regexToken:          /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
      characterClassParts: /^(<opening>\[\^?)(<contents>]?(?:[^\\\]]+|\\[\S\s]?)*)(<closing>]?)$/.addFlags("k"),
      characterClassToken: /[^\\-]+|-|\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)/g,
      quantifier:          /^(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??$/
    },
    type = {
      NONE:         0,
      RANGE_HYPHEN: 1,
      METACLASS:    2,
      ALTERNATOR:   3
    };

  function errorStr (str) {
    return '<b class="err">' + str + '</b>';
  };

  function getTokenCharCode (token) {
    /* This currently only supports tokens used within regex character classes,
    since that's all it's needed for. */

    // Escape sequence
    if (token.length > 1 && token.charAt(0) === "\\") {
      var t = token.slice(1);
      // Control character
      if (XRegExp.cache("^c[A-Za-z]$").test(t)) {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(t.charAt(1).toUpperCase()) + 1;
      // Two or four digit hexadecimal character code
      } else if (XRegExp.cache("^(?:x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4})$").test(t)) {
        return parseInt(t.slice(1), 16);
      // One to three digit octal character code up to 377 (hex FF)
      } else if (XRegExp.cache("^(?:[0-3][0-7]{0,2}|[4-7][0-7]?)$").test(t)) {
        return parseInt(t, 8);
      // Metaclass or incomplete token
      } else if (t.length === 1 && "cuxDdSsWw".indexOf(t) > -1) {
        return false;
      // Metacharacter representing a single character index, or escaped literal character
      } else if (t.length === 1) {
        switch (t) {
          case "b": return 8;  // backspace
          case "f": return 12; // form feed
          case "n": return 10; // line feed
          case "r": return 13; // carriage return
          case "t": return 9;  // horizontal tab
          case "v": return 11; // vertical tab
          default : return t.charCodeAt(0); // escaped literal character
        }
      }
    // Unescaped literal token(s)
    } else if (token !== "\\") {
      return token.charCodeAt(0);
    }
    return false;
  };

  function parseCharacterClass (value) {
    /* Character classes have their own syntax rules which are different (sometimes quite subtly)
    from surrounding regex syntax. Hence, they're treated as a single token and parsed separately. */

    var output    = "",
      parts     = re.characterClassParts.exec(value),
      parser    = re.characterClassToken,
      lastToken = {
        rangeable: false,
        type: type.NONE
      },
      match, m;

    output += parts.closing ? parts.opening : errorStr(parts.opening);

    // The characterClassToken regex does most of the tokenization grunt work
    while (match = parser.exec(parts.contents)) {
      m = match[0];
      // Escape
      if (m.charAt(0) === "\\") {
        /* Inside character classes, browsers differ on how they handle the following:
         - Any representation of character index zero (\0, \00, \000, \x00, \u0000)
         - "\c", when not followed by A-Z or a-z
         - "\x", when not followed by two hex characters
         - "\u", when not followed by four hex characters
        However, although representations of character index zero within character classes don't work on their
        own in Firefox, they don't throw an error, they work when used with ranges, and it's highly unlikely
        that the user will actually have such a character in their test data, so such tokens are highlighted
        normally. The remaining metasequences are flagged as errors. */
        if (XRegExp.cache("^\\\\[cux]$").test(m)) {
          output += errorStr(m);
          lastToken = {rangeable: lastToken.type !== type.RANGE_HYPHEN};
        // Metaclass (matches more than one character index)
        } else if (XRegExp.cache("^\\\\[dsw]$", "i").test(m)) {
          output += "<b>" + m + "</b>";
          /* Traditional regex behavior is that a metaclass should be unrangeable (RegexPal terminology).
          Hence, [-\dz], [\d-z], and [z-\d] should all be equivalent. However, at least some browsers
          handle this inconsistently. E.g., Firefox 2 throws an invalid range error for [z-\d] and [\d--]. */
          lastToken = {
            rangeable: lastToken.type !== type.RANGE_HYPHEN,
            type: type.METACLASS
          };
        // Unescaped "\" at the end of the regex
        } else if (m === "\\") {
          output += errorStr(m);
        // Metasequence representing a single character index, or escaped literal character
        } else {
          output += "<b>" + m.replace(XRegExp.cache("[<&>]"), "_") + "</b>";
          lastToken = {
            rangeable: lastToken.type !== type.RANGE_HYPHEN,
            charCode: getTokenCharCode(m)
          };
        }
      // Hyphen (might indicate a range)
      } else if (m === "-") {
        if (lastToken.rangeable) {
          // Save the regex's lastIndex so we can reset it after checking the next token
          var lastIndex = parser.lastIndex,
            nextToken = parser.exec(parts.contents);

          if (nextToken) {
            var nextTokenCharCode = getTokenCharCode(nextToken[0]);
            // Hypen for a reverse range (e.g., z-a) or metaclass (e.g., \d-x or x-\S)
            if (
              (nextTokenCharCode !== false && lastToken.charCode > nextTokenCharCode) ||
              lastToken.type === type.METACLASS ||
              XRegExp.cache("^\\\\[dsw]$", "i").test(nextToken[0])
            ) {
              output += errorStr("-");
            // Hyphen creating a valid range
            } else {
              output += "<u>-</u>";
            }
            lastToken = {
              rangeable: false,
              type: type.RANGE_HYPHEN
            };
          } else {
            // Hyphen at the end of a properly closed character class (literal character)
            if (parts.closing) {
              output += "-"; // Since this is a literal, it's technically "rangeable," but that doesn't matter
            // Hyphen at the end of an unclosed character class (i.e., the end of the regex)
            } else {
              //output += errorStr("-"); // Previous RB handling
              output += "<u>-</u>";
              break; // Might as well break
            }
          }

          // Reset the regex's lastIndex so the next while loop iteration will continue appropriately
          parser.lastIndex = lastIndex;
        // Hyphen at the beginning of a character class or after a non-rangeable token
        } else {
          output += "-";
          lastToken = {rangeable: lastToken.type !== type.RANGE_HYPHEN};
        }
      // Literal character sequence
      } else {
        output += m.replace(XRegExp.cache("[<&>]", "g"), "_");
        lastToken = {
          rangeable: (m.length > 1 || lastToken.type !== type.RANGE_HYPHEN),
          charCode: m.charCodeAt(m.length - 1)
        };
      }
    } // End characterClassToken loop

    return output + parts.closing;
  };
  // ...End cache through closure
  //<-------------------------------------------------------


  return function (value) {
    var output              = "",
      capturingGroupCount = 0,
      groupStyleDepth     = 0,
      openGroups          = [],
      lastToken = {
        quantifiable: false,
        type: type.NONE
      },
      match, m;

    function groupStyleStr (str) {
      return '<b class="g' + groupStyleDepth + '">' + str + '</b>';
    };

    // The regexToken regex does most of the tokenization grunt work
    while (match = re.regexToken.exec(value)) {
      m = match[0];
      switch (m.charAt(0)) {
        // Character class
        case "[":
          output += "<i>" + parseCharacterClass(m) + "</i>";
          lastToken = {quantifiable: true};
          break;
        // Group opening
        case "(":
          // If this is an invalid group type, mark the error and don't count it towards group depth or total count
          if (m.length === 2) { // m is "(?"
            output += errorStr(m);
          } else {
            if (m.length === 1) capturingGroupCount++;
            groupStyleDepth = groupStyleDepth === 5 ? 1 : groupStyleDepth + 1;
            /* Record the group opening's position and character sequence so we can later mark it as invalid if
            it turns out to be unclosed in the remainder of the regex. The value of index is the position plus
            the length of the opening <b> element with group class ('<b class="gN">'.length). */
            openGroups.push({
              index:   output.length + 14,
              opening: m
            });
            // Add markup to the group-opening character sequence
            output += groupStyleStr(m);
          }
          lastToken = {quantifiable: false};
          break;
        // Group closing
        case ")":
          // If this is an invalid group closing
          if (!openGroups.length) {
            output += errorStr(")");
            lastToken = {quantifiable: false};
          } else {
            output += groupStyleStr(")");
            /* Although at least in some browsers it is possible to quantify lookaheads, this adds no value
            and is an error with some regex flavors such as PCRE, so flag them as unquantifiable. */
            lastToken = {
              quantifiable: !XRegExp.cache("^[=!]").test(openGroups[openGroups.length - 1].opening.charAt(2)),
              style:        "g" + groupStyleDepth
            };
            groupStyleDepth = groupStyleDepth === 1 ? 5 : groupStyleDepth - 1;
            // Drop the last opening paren from depth tracking
            openGroups.pop();
          }
          break;
        // Escape or backreference
        case "\\":
          // Backreference or octal character code without a leading zero
          if (XRegExp.cache("^[1-9]").test(m.charAt(1))) {
            /* What does "\10" mean?
             - Backreference 10, if 10 or more capturing groups were opened before this point.
             - Backreference 1 followed by "0", if 1-9 capturing groups were opened before this point.
             - Otherwise, it's octal character index 10 (since 10 is inside the octal range 0-377).

            In the case of \8 or \9 when as many capturing groups weren't opened before this point, they're
            highlighted as special tokens. However, they should probably be marked as errors since the handling
            is browser-specific. E.g., in Firefox 2 they seem to be equivalent to "(?!)", while in IE 7 they
            match the literal characters "8" and "9", which is correct handling. I don't mark them as errors
            because it would seem inconsistent to users who don't understand the highlighting rules for octals,
            etc. In fact, octals are not included in ECMA-262v3, but since all the big browsers support them
            and RegexPal does not implement its own regex engine, it needs to highlight the regex as the
            browsers interpret them. */
            var nonBackrefDigits = "",
              num = +m.slice(1);
            while (num > capturingGroupCount) {
              nonBackrefDigits = XRegExp.cache("[0-9]$").exec(num)[0] + nonBackrefDigits;
              num = Math.floor(num / 10); // Drop the last digit
            }
            if (num > 0) {
              output += "<b>\\" + num + "</b>" + nonBackrefDigits;
            } else {
              var parts = XRegExp.cache("^\\\\([0-3][0-7]{0,2}|[4-7][0-7]?|[89])([0-9]*)").exec(m);
              output += "<b>\\" + parts[1] + "</b>" + parts[2];
            }
          // Metasequence
          } else if (XRegExp.cache("^[0bBcdDfnrsStuvwWx]").test(m.charAt(1))) {
            /* Browsers differ on how they handle:
             - "\c", when not followed by A-Z or a-z
             - "\x", when not followed by two hex characters
             - "\u", when not followed by four hex characters
            Hence, such metasequences are flagged as errors. */
            if (XRegExp.cache("^\\\\[cux]$").test(m)) {
              output += errorStr(m);
              lastToken = {quantifiable: false};
              break;
            }
            output += "<b>" + m + "</b>";
            // Non-quantifiable metasequence
            if ("bB".indexOf(m.charAt(1)) > -1) {
              lastToken = {quantifiable: false};
              break;
            }
          // Unescaped "\" at the end of the regex
          } else if (m === "\\") {
            output += errorStr(m);
          // Escaped literal character
          } else {
            output += m.replace(XRegExp.cache("[<&>]"), "_");
          }
          lastToken = {quantifiable: true};
          break;
        // Not a character class, group opening/closing, escape sequence, or backreference
        default:
          // Quantifier
          if (re.quantifier.test(m)) {
            if (lastToken.quantifiable) {
              var interval = XRegExp.cache("^\\{([0-9]+)(?:,([0-9]*))?").exec(m);
              // Interval quantifier in reverse numeric order or out of range
              if (interval &&
                (
                  (interval[1] > 65535) ||
                  (
                    interval[2] &&
                    ((interval[2] > 65535) || (+interval[1] > +interval[2]))
                  )
                )
              ) {
                output += errorStr(m);
              } else {
                // Quantifiers for groups are shown in the style of the (preceeding) group's depth
                output += (lastToken.style ? '<b class="' + lastToken.style + '">' : '<b>') + m + '</b>';
              }
            } else {
              output += errorStr(m);
            }
            lastToken = {quantifiable: false};
          // Vertical bar (alternator)
          } else if (m === "|") {
            /* If there is a vertical bar at the very start of the regex, flag it as an error since it
            effectively truncates the regex at that point. If two top-level vertical bars are next to
            each other, flag it as an error for similar reasons. These behaviors copied from RegexBuddy. */
            if (lastToken.type === type.NONE || (lastToken.type === type.ALTERNATOR && !openGroups.length)) {
              output += errorStr(m);
            } else {
              // Alternators within groups are shown in the style of the (containing) group's depth
              output += openGroups.length ? groupStyleStr("|") : "<b>|</b>";
            }
            lastToken = {
              quantifiable: false,
              type: type.ALTERNATOR
            };
          // ^ or $ anchor
          } else if ("^$".indexOf(m) > -1) {
            output += "<b>" + m + "</b>";
            lastToken = {quantifiable: false};
          // Dot (.)
          } else if (m === ".") {
            output += "<b>.</b>";
            lastToken = {quantifiable: true};
          // Literal character sequence
          } else {
            output += m.replace(XRegExp.cache("[<&>]", "g"), "_");
            lastToken = {quantifiable: true};
          }
        // End default case
      } // End switch m.charAt(0)
    } // End regexToken loop

    // Mark the opening character sequence for each unclosed grouping as invalid
    var numCharsAdded = 0;
    for (var i = 0; i < openGroups.length; i++) {
      var errorIndex = openGroups[i].index + numCharsAdded;
      output = (
        output.slice(0, errorIndex) +
        errorStr(openGroups[i].opening) +
        output.slice(errorIndex + openGroups[i].opening.length)
      );
      numCharsAdded += errorStr("").length;
    }

    return output;
  };
}();


//---------------------------------------------------------------------+
// SmartField
//---------------------------------------------------------------------+

/* SmartField is my name for the rich text boxes RegexPal creates, which
are essentially <div> container elements enclosing <textarea> elements
on top of <pre> elements, combined with some CSS and JavaScript to
facilitate seemless scrolling (the only scrollbar actually belongs to the
container). The code for smart fields is occasionally browser-specific
and is extremely hacky in general. However, it offers major speed
benefits over traditional JavaScript-based rich text editors, although
with more limited capabilities. */

function SmartField (el) {
  el = $(el);
  /* The <textarea> element already exists for graceful-degradation reasons.
  Not that RegexPal would work at all without JavaScript, but whatever. */
  var textboxEl = el.getElementsByTagName("textarea")[0],
    bgEl      = document.createElement("pre");

  textboxEl.id = el.id + "Text";
  bgEl.id      = el.id + "Bg";
  el.insertBefore(bgEl, textboxEl);

  // TODO: Augment SmartField key events per field, rather than using de-facto global handlers
  textboxEl.onkeydown = function (e) {SmartField.prototype._onKeyDown(e);};
  textboxEl.onkeyup   = function (e) {SmartField.prototype._onKeyUp(e);};

  // Avoid unnecessary horizontal scollbars in IE, which wraps long words differently than Firefox
  if (isIE) el.style.overflowX = "hidden";
  // Fix minor alignment issue for Chrome and Safari 5
  if (isWebKit) textboxEl.style.marginLeft = 0;

  this.field = el;
  this.textbox = textboxEl;
  this.bg = bgEl;
};

extend(SmartField.prototype, {
  setBgHtml: function (html) {
    // Workaround an IE text-normaliztion bug where a leading newline is removed (causing highlighting to be misaligned)
    if (isIE) html = html.replace(XRegExp.cache("^\\r\\n"), "\r\n\r\n");
    // The trailing characters improve seemless scrolling
    this.bg = replaceOuterHtml(this.bg, html + "<br>&nbsp;");
    this.setDimensions();
  },

  clearBg: function () {
    this.setBgHtml(this.textbox.value.replace(XRegExp.cache("[<&>]", "g"), "_"));
  },

  setDimensions: function () {
    /* Set the width of the textarea to its scrollWidth. Note that although the background content autoexpands, its
    offsetWidth isn't dynamically updated as is its offsetHeight (at least in Firefox 2). The pixel adjustments avoid
    an unnecessary horizontal scrollbar and keep the last character to the right in view when the container element
    has a horizontal scrollbar. */
    this.textbox.style.width = "";
    var scrollWidth = this.textbox.scrollWidth,
      offsetWidth = this.textbox.offsetWidth;

    this.textbox.style.width = (scrollWidth === offsetWidth ? offsetWidth - 1 : scrollWidth + 8) + "px";

    /* Set the height of the absolute-positioned textarea to its background content's offsetHeight. Since the background
    content autoexpands, this allows the elements to be scrolled simultaneously using the parent element's scrollbars.
    Setting it to textbox.scrollHeight instead of bg.offsetHeight would also work, but that would require us to first
    blank style.height. It would also prevent us from improving seemless scrolling by adding trailing characters to the
    background content (which is done outside this method) before testing its height. Comparing bg.offsetHeight to the
    container's offsetHeight (minus 2 for borders) is done for the sake of IE6, since CSS min-height doesn't work there. */
    this.textbox.style.height = Math.max(this.bg.offsetHeight, this.field.offsetHeight - 2) + "px";
  },

  _onKeyDown: function (e) {
    e = e || event;
    if (!this._filterKeys(e)) return false;
    var srcEl = e.srcElement || e.target;
    switch (srcEl) {
      case RegexPal.fields.search.textbox:
        // Since the textbox's value doesn't change until the keydown event finishes, run the match after 0ms
        setTimeout(function () {RegexPal.highlightSearchSyntax.call(RegexPal);}, 0);
        break;
      // There might be other elements to handle in the future (e.g., replacement)
    }
    /* Scrolling works automatically in IE and Firefox. A bug with Opera's scrollHeight causes height to go wonky
    if we use it repeatedly as below, so this is only for WebKit. Compared to real autoscrolling, this is an
    incomplete patch job, as it only scrolls when the cursor is at the end of the text. */
    if (isWebKit && srcEl.selectionEnd === srcEl.value.length) {
      srcEl.parentNode.scrollTop = srcEl.scrollHeight;
    }
    this._testKeyHold(e);
  },

  _onKeyUp: function (e) {
    e = e || event;
    var srcEl = e.srcElement || e.target;
    this._keydownCount = 0; // Reset
    if (this._matchOnKeyUp) {
      this._matchOnKeyUp = false; // Reset
      switch (srcEl) {
        case RegexPal.fields.search.textbox: // fallthru
        case RegexPal.fields.input.textbox:
          RegexPal.highlightMatches();
          break;
        // There might be other elements to handle in the future
      }
    }
  },

  _testKeyHold: function (e) {
    var srcEl = e.srcElement || e.target;
    this._keydownCount++;
    /* If this is the third keydown before a keyup fires, remove real-time matches until keyup. Allowing a
    couple keydowns before removing the matches offers a balanace between reducing performance issues when
    holding down keys, and keeping performance up for fast typists. */
    if (this._keydownCount > 2) {
      RegexPal.fields.input.clearBg();
      this._matchOnKeyUp = true;
    } else {
      /* Since we're running this on keydown but the textbox's value doesn't change until code for the
      event finishes, run the match after 0ms as a workaround. */
      switch (srcEl) {
        case RegexPal.fields.search.textbox: // fallthru
        case RegexPal.fields.input.textbox:
          setTimeout(function () {RegexPal.highlightMatches.call(RegexPal);}, 0);
          break;
        // There might be other elements to handle in the future
      }
    }
  },

  _filterKeys: function (e) {
    var srcEl = e.srcElement || e.target,
      f = RegexPal.fields;

    // If the user pressed a key which does not change the input, return false to prevent running a match
    if (this._deadKeys.indexOf(e.keyCode) > -1)
      return false;

    // If the user pressed tab (keyCode 9) in the search or input fields, override the default behavior
    if ((e.keyCode === 9) && (srcEl === f.input.textbox || (srcEl === f.search.textbox && !e.shiftKey))) {
      /* Moving focus between the search and input fields can't be reliably achieved in
      Firefox using tabindex alone because of how the markup is structured */

      if (srcEl === f.input.textbox) {
        if (e.shiftKey) {
          f.search.textbox.focus();
        } else {
          // Insert a tab character, overwriting any selected text
          replaceSelection(srcEl, "\t");
          // Opera's tabbing mechanism fires before keydown, so bring back the focus
          if (window.opera)
            setTimeout(function () {srcEl.focus();}, 0);
        }
      } else {
        f.input.textbox.focus();
      }

      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
    }

    return true;
  },

  _matchOnKeyUp: false,
  _keydownCount: 0,
  _deadKeys: [16,17,18,19,20,27,33,34,35,36,37,38,39,40,44,45,112,113,114,115,116,117,118,119,120,121,122,123,144,145]
});

/* Killed key codes:
16:  shift          17:  ctrl           18:  alt            19:  pause          20:  caps lock
27:  escape         33:  page up        34:  page down      35:  end            36:  home
37:  left           38:  up             39:  right          40:  down           44:  print screen
45:  insert         112: f1             113: f2             114: f3             115: f4
116: f5             117: f6             118: f7             119: f8             120: f9
121: f10            122: f11            123: f12            144: num lock       145: scroll lock

These could be included, but Opera handles them incorrectly:
91:  Windows (Opera reports both the Windows key and "[" as 91.)
93:  context menu (Opera reports the context menu key as 0, and "]" as 93.) */


//---------------------------------------------------------------------+
// Page setup
//---------------------------------------------------------------------+

(function () {
  var f = RegexPal.fields,
    o = f.options;

  onresize = function (e) {
    // Make the input field fill viewport height
    f.input.field.style.height = Math.max((window.innerHeight || document.documentElement.clientHeight) - 210, 60) + "px";
    f.search.setDimensions();
    f.input.setDimensions();
  };
  onresize(); // Immediately resize to viewport height

  // Run a match and syntax highlighting with whatever data exists onload
  RegexPal.highlightSearchSyntax();
  RegexPal.highlightMatches();

  for (var flag in o.flags) {
    o.flags[flag].onclick = RegexPal.highlightMatches;
  }

  o.highlightSyntax.onclick  = RegexPal.highlightSearchSyntax;
  o.highlightMatches.onclick = RegexPal.highlightMatches;
  o.invertMatches.onclick    = RegexPal.highlightMatches;

  function makeResetter (field) {
    return function () {
      field.clearBg();
      field.textbox.value = "";
      field.textbox.onfocus = null;
    };
  };
  if (f.search.textbox.value === "Enter regex here") {
    f.search.textbox.onfocus = makeResetter(f.search);
  }
  if (f.input.textbox.value === "Enter test data here") {
    f.input.textbox.onfocus = makeResetter(f.input);
  }

  // The implementation for the options and quick reference behavior could be a lot more fancy, but whatever...

  var refDropdown = $("quickReferenceDropdown"),
    refBox      = $("quickReference"),
    refBoxPin   = getElementsByClassName("pin", "img", refBox)[0],
    refBoxClose = getElementsByClassName("close", "img", refBox)[0];

  refDropdown.onmouseover = function (e) {
    removeClass("hidden", refBox);
    addClass("hover", this);
  };
  refDropdown.onmouseout = function (e) {
    if (!hasClass("pinned", refBox)) {
      addClass("hidden", refBox);
      removeClass("hover", this);
    }
  };
  refBox.onmouseover = function (e) {refDropdown.onmouseover();};
  refBox.onmouseout  = function (e) {refDropdown.onmouseout();};
  refBoxPin.onclick  = function (e) {
    this.src = "images/" + (hasClass("pinned", refBox) ? "pin" : "pinned") + ".gif";
    toggleClass("pinned", refBox);
  };
  refBoxClose.onclick = function (e) {
    swapClass("pinned", "hidden", refBox);
    refBoxPin.src = "images/pin.gif";
  };

  if (isIE6) {
    var optionsDropdown = $("optionsDropdown");
    // IE6 only supports the :hover pseudo-class for anchor elements, so mimic it with class "hover"
    optionsDropdown.onmouseenter = function () {addClass("hover", this);};
    optionsDropdown.onmouseleave = function () {removeClass("hover", this);};

    onunload = function (e) {
      // No need to purge the potentially numerous descendants of the background <pre> elements
      f.search.clearBg();
      f.input.clearBg();
      // Remove event handlers to clear memory leaks
      purge(document.body);
    };
  }
})();
