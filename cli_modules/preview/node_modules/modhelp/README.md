# modhelp

<img src="modhelp1.gif"/>

Uses `marked-terminal` to render a README.md for any `npm` module in the terminal.

Now with built-in pager!  Page up/down, arrow keys to scroll line-by-line, q to quit.  I added this because piping to `less`, even with -r, doesn't work right with ANSI escape codes.

## Install

```sh
npm install -g modhelp
```

## Usage

```sh
modhelp themodule
```

[Tiny Villages: Horizontally Scaling Society](http://runvnc.github.io/tinyvillage)
