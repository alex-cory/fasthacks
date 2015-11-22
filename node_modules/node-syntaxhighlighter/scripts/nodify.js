var child_process =  require('child_process')
  , exec          =  child_process.exec
  , spawn         =  child_process.spawn
  , fs            =  require('fs')
  , path          =  require('path')
  , log           =  require('npmlog')
  , util          =  require('util')
  ;

log.level = log.levels.silly;

function execute (command, args, callback) {
  var errors  =  []
    , infos   =  []
    , spawned =  spawn (command, args)
    ;

  log.silly(command, args);

  spawned.stdout.on('data', function(data) {
    var msg = util.format('%s', data.toString());
    if (msg.length === 0) return;

    log.info(command, msg);
    infos.push(msg);
  });
  spawned.stderr.on('data', function(data) {
    var msg = util.format('%s', data.toString());
    log.error(command, msg);
    errors.push(msg);
  });
  spawned.on('exit', function(code) {
    log.verbose(command, 'exited with: ' + code);
    callback((errors.length > 0 ? errors : null), infos);
  });
}

function gitClone(url, targetFolder, callback) {
  execute ('git', [ 'clone', url, targetFolder ], callback);
} 

function rmdir(dir, cb) {
  if (!fs.existsSync(dir)) 
    cb(null); 
  else
    execute('rm', ['-rf', dir], cb);
}

function copyDirRec(src, tgt, cb) {
  execute ('cp', ['-R', src, tgt], cb);
}

log.info('nodify', 'It succeeded if it ends wit OK.');

var lib = path.join(__dirname, '../lib')
  , repo = path.join(__dirname, '../repo')
  , url = 'git://github.com/alexgorbatchev/SyntaxHighlighter.git'
  ;
  
function cleanAndGetRepo (cb) {
  // Clean old stuff
  rmdir(lib, function (err) {
    if (err) log.error('removing', lib, error);
    else rmdir(repo, function (err) {
      if (err) log.error('removing', repo, error);
      else { 
        log.info('nodify', 'Removed old lib and repo folders.');
        cloneRepo();
      }
    });
    
  });

  function cloneRepo () {
    // Clone new version
    gitClone(url, repo, function (err, res) {
      if (err) log.error('nodify', err); else cb();
    });
  }
}

function nodify () {

  fs.mkdirSync(lib);

  var go = copyCssFiles;

  function copyCssFiles() { 
    var cssSrc = path.join(repo, 'styles')
      , cssTgt = path.join(lib, 'styles')
      ;

    copyDirRec(cssSrc, cssTgt, function (err) {
      if (err) log.error('nodify', err); else copyAndAdaptScripts();
    });
  }
    
  function copyAndAdaptScripts() {
    var scriptsSrc = path.join(repo, 'scripts')
      , scriptsTgt = path.join(lib, 'scripts')
      , xregExpReq = 'var XRegExp = require("./XRegExp").XRegExp;\n'
      ;

    fs.mkdirSync(scriptsTgt);

    // Pull scripts into lib folder while fixing require statements
    fs.readdirSync(scriptsSrc).forEach(function (script) {

      var content = fs.readFileSync(path.join(scriptsSrc, script)).toString();

      log.verbose('nodify', 'processing %j', { script: script, length: content.length });

      // properly export XRegExp
      if (script === 'XRegExp.js') {
        content += '\nmodule.exports.XRegExp = XRegExp;';
      }

      // fix shCore XRegExp require, global leaks and SyntaxHighlighter reference 
      else if (script === 'shCore.js') {
        content = 
          xregExpReq +
          'var className,\n   gutter;\n' +
          content
            .replace(
              /if +\(typeof\(SyntaxHighlighter\) +== +'undefined'\) +var +SyntaxHighlighter += +function\(\) +\{/,
              'var SyntaxHighlighter = function() {'
            )
            .replace(/.+require *\( *['"]XRegExp['"] *\).+/g, '// No op since required properly at top of file\n')
            ;
      }

      // fix Brushes SyntaxHighlighter requires
      else {
        content = 
          'var SyntaxHighlighter;\n' +
          content.replace(/require *\( *['"]shCore['"] *\)/g, 'require("./shCore")');
        
        // fix shBrushXml XRegExp require
        if (script == 'shBrushXml.js') content = xregExpReq + content;
      }
      
      fs.writeFileSync(path.join(scriptsTgt, script), content);
    });

    log.info('nodify', 'Everything is OK');
  }

  go();
}

cleanAndGetRepo(nodify);
