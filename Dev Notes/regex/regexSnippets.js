/**
 * Regex Quick Snippets
 *
 */

/*
 * 
 * * * A 6+ letter password with at least:
 *     one number, one letter and one symbol
 * 
 *        /^(?=.*\d)(?=.*[a-z])(?=.*[\W_]).{6,}$/i
 *
 * * * Any number that's not divisible 
 *
 *        /\b(?!\d+[50]0)\d+\b/
 *
 * * * Anything that doesn't contain foo
 * 
 *        /^(?!.*foo).+$/
 * 
 * * * Check if string is non-blank  */

    var isNonblank_re    = /\S/;
    function isNonblank (s) {
       return String (s).search (isNonblank_re) != -1
    }

/*
 * * * Checks that an input string looks like a valid email address. */

  var isEmail_re       = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  function isEmail (s) {
     return String(s).search (isEmail_re) != -1;
  }

/* 
 * * * Check for valid credit card type/number

  var creditCardList = [
     //type      prefix   length
     ["amex",    "34",    15],
     ["amex",    "37",    15],
     ["disc",    "6011",  16],
     ["mc",      "51",    16],
     ["mc",      "52",    16],
     ["mc",      "53",    16],
     ["mc",      "54",    16],
     ["mc",      "55",    16],
     ["visa",    "4",     13],
     ["visa",    "4",     16]
  ];
  function isValidCC (cctype, ccnumber) {
     var cc = getdigits (ccnumber);
     if (luhn (cc)) {
        for (var i in creditCardList) {
           if (creditCardList [i][0] == (cctype.toLowerCase ())) {
              if (cc.indexOf (creditCardList [i][1]) == 0) {
                 if (creditCardList [i][2] == cc.length) {
                    return true;
                 }
              }
           }
        }
     }
     return false;
  }
 
/* 
 * * * Get String Length

  function regGetStrLength(fData)
  {
      var valLength = fData.length;
      var reg = new RegExp(”^[\u0391-\uFFE5]$”);
      var result = 0;
      for(i=0; i< valLength; i++)
      {
          if(reg.test(fData.charAt(i)))
          {
              result += 2;
          }
          else
          {
              result ++;
          }
      }
      return result;
  }
/* 
 * * * Regular expression to pull the domain from a URL.
 * 
 *        /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i 
 * 
 * * * 
 * 
 * 
 * 
 */

