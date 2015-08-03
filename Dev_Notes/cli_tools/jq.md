# JQ Notes

## Examples

### Return the `hardLinks` and `softLinks` concatinated together via colons

    jq '.[] | [."hardLink", ."softLink"] | join(":")  +":" | @sh' dotfiles.json
    jq '.[] | .hardLink + ":" + .softLink + ":" | @sh' dotfiles.json
    jq '.[] | .hardLink as $hl | .softLink as $sl | "ln -s "  + $hl + " " + $sl' dotfiles.json
    jq '.[] | "ln -s "  + .hardLink + "/" + .file + " " + .softLink + "/" + .file+ "/" + .file' dotfiles.json

    # Data Before:
    [
      {
        "name": ".bash_profile",
        "hardLink": "/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bash_profile",
        "softLink": "/Users/AlexCory/.bash_profile"
      },
      {
        "name": ".bashrc",
        "hardLink": "/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bashrc",
        "softLink": "/Users/AlexCory/.bashrc"
      }
    ]

    # Data After:
    "'/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bash_profile:/Users/AlexCory/.bash_profile:'"
    "'/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bashrc:/Users/AlexCory/.bashrc:'"

### Variables, split()

    jq '.[] as $group | $group.hardLink | split("/")' dotfiles.json

    # Data After:
    [
      "",
      "Users",
      "AlexCory",
      "GoogleDrive",
      "_Server_",
      "Developer",
      "git_repositories",
      "fasthacks",
      "dotfiles",
      "bash"
    ]
    [
      "",
      "Users",
      "AlexCory",
      "GoogleDrive",
      "_Server_",
      "Developer",
      "git_repositories",
      "fasthacks",
      "dotfiles",
      "bash"
    ]

### String interpolation
  
    .[] | "ln -s '\(.hardLink)' '\(.softLink)'"

    # Data After:
    "ln -s '/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bash_profile' '/Users/AlexCory/.bash_profile:'"
    "ln -s '/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash/.bashrc' '/Users/AlexCory/.bashrc:'"


### map()

    jq 'map(.file, .hardLink)' dotfiles.json

    # Data After:
    [
      ".bash_profile",
      "/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash",
      ".bashrc",
      "/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles/bash",
    ]

### reduce()

    jq 'reduce .[] as $item (0; $item)' dotfiles.json

    # Data After:
    {
      "file": ".pythonrc",
      "hardLink": "/Users/AlexCory/GoogleDrive/_Server_/Developer/git_repositories/fasthacks/dotfiles",
      "softLink": "/Users/AlexCory"
    }
