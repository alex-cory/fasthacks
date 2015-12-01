module.exports = controls;

function controls(keywords, command, keybind){
  return {
    //General Usage
    'Command List'       : keybind('f1'),
    'Next Page'          : keybind('pgdn'),
    'Previous Page'      : keybind('pgup'),
    'Clear Input'        : keybind('esc'),
    'Clear Screen'       : keybind('esc esc'),
    'Exit'               : keybind('ctrl+d'),
    'Inspect Context'    : keybind('ctrl+z'),
    'Load Plugin'        : command('.plugin'),

    //NPM
    'npm command'        : command('.npm'),
    'npm search'         : command('.search'),

    //Keyboard Navigation
    'Delete Right'       : keybind('del'),
    'Delete Left'        : keybind('bksp'),
    'Delete Word Right'  : keybind('ctrl+del'),
    'Delete Word Left'   : keybind('ctrl+bksp'),
    'Delete Line Right'  : keybind('ctrl+shift+del'),
    'Delete Line Left'   : keybind('ctrl+shift+bksp'),

    'Move Left'          : keybind('left'),
    'Move Right'         : keybind('right'),
    'Word Left'          : keybind('ctrl+left'),
    'Word Right'         : keybind('ctrl+right'),
    'Line Left'          : keybind('home'),
    'Line Right'         : keybind('end'),

    'Select Left'        : keybind('shift+left'),
    'Select Right'       : keybind('shift+right'),
    'Select Word Left'   : keybind('ctrl+shift+left'),
    'Select Word Right'  : keybind('ctrl+shift+right'),
    'Select Line Left'   : keybind('shift+home'),
    'Select Line Right'  : keybind('shift+end'),

    'History Prev'       : keybind('up'),
    'History Next'       : keybind('down'),

    'Line'               : keybind('enter'),
    'Tab Complete'       : keybind('tab'),

    // Toggles
    'Hiddens'            : keybind('f2'),
    'Builtins'           : keybind('f3'),
    '[[proto]]'          : keybind('f4'),
    'Multi-item Lines'   : keybind('f5'),
    'Global/Local'       : keybind('f6'),
    'Depth--'            : keybind('alt+1'),
    'Depth++'            : keybind('alt+2'),
    'Alphabetize'        : keybind('alt+q'),
    'Colors'             : keybind('f9'),
    'Set Depth'          : command('.depth'),

    // Context Controls
    'Node Builtins'      : keybind('alt+a'),
    'Create Context'     : keybind('ctrl+shift+up'),
    'Delete Context'     : keybind('ctrl+shift+down'),
    'Reset Context'      : command('.r'),
    'Next Context'       : keybind('ctrl+up'),
    'Previous Context'   : keybind('ctrl+down'),
    'Label Context'      : command('.label'),

    // REPL Development
    'Stack Trace'        : keybind('alt+s'),
    'Color Test'         : keybind('f10'),
    'Key Display'        : keybind('f11'),
    'Inject REPL'        : keybind('f12'),
  };
}
