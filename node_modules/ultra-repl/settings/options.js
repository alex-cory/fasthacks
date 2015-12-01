module.exports = {
  inspector: {
    builtins: true,
    hiddens: false,
    protos: true,
    multiItemLines: true,
    globalExec: true,
    ignoreInspect: false,
    alphabeticalSorting: true,
    depth: 4
  },
  execution: {
    addCompletionsToGlobal: true,
    codeIntel: true,
  },
  autoload: [
    'basic',
    'navigation',
    'contexts',
    'library',
    'npm',
    'toggles',
  ]
};
