" Alex Cory's Vimrc
" n Jul 25, 2016 4:03PM PDT'
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" Override color scheme to make split the same color as tmux's default
" autocmd ColorScheme * highlight VertSplit cterm=NONE ctermfg=Green ctermbg=NONE
" TODO:
" - setup ctags               <-doesn't work w/ current build of nodejs
"   - http://raygrasso.com/   <-ctags config
" - clean up .vimrc via reorganizing
" - Checkout Plug (minimalist plugin manager) https://github.com/junegunn/vim-plug

" TO MAKE:
"   - Find: f' searches for single quotes first, if none, searches for double
"     quotes
"   - delete in object
"   - delete around object
"   - TODO: ONE SPACE LINE NAVIGATION (on releasing space, go to line)

" Let's you search with ctrlp from within the current directory if there's no
" .git so you're aren't searching your entire machine
:map <leader>cf :CtrlPCurFile<CR>
set wildignore+=*/tmp/*,*.so,*.swp,*.zip,*.pyc     " MacOSX/Linux "

" Can't figure out how to get name of current file to run it
" :let myfile = expand('%:t')
" function Myex()
"   " echo "hello"
"    execute ':w'
"    execute ':!!'
" endfunction
" :map <F2> <Esc>:w<CR>:echo myfile
" nnoremap <F1> :call Myex()<cr>
"execute ':!zsh ' . file

" Quickly repeat previous : cmd. Use case:  ":w !preview preview.js" will save
" and run the file again really quickly
" nmap <leader>r :@:<CR>
" :nmap <leader>r :w<cr>:!%<cr>
" map <leader>r :w<CR>| :!!<CR>
" map <leader>m <Esc>:w<CR>:!%:p<CR>
nnoremap <leader>r :w<CR>:!!<CR>

""""" EasyMotion """""
" Gif config
map  / <Plug>(easymotion-sn)
omap / <Plug>(easymotion-tn)
" These `n` & `N` mappings are options. You do not have to map `n` & `N` to EasyMotion.
" Without these mappings, `n` & `N` works fine. (These mappings just provide
" different highlight method and have some other features )
map  n <Plug>(easymotion-next)
map  N <Plug>(easymotion-prev)
" nmap f <leader><leader>w
nmap sj <Plug>(easymotion-w)
nmap sk <Plug>(easymotion-b)
" Gif config
map sl <Plug>(easymotion-lineforward)
map ssj <Plug>(easymotion-j)
map ssk <Plug>(easymotion-k)
map sh <Plug>(easymotion-linebackward)

let g:EasyMotion_startofline = 0 " keep cursor column when JK motion

" Allow .bashrc aliases to work in vim's :! shell <- TODO
" :!bash -c ". ~/.alias; gitlog"
" set shell=/bin/bash\ -i
" set shell=zsh\ -i
" set shell=/bin/bash\ --rcfile\ ~/.bashrc


""""" SuperTab """""
" Super Tab work around
" let g:ycm_key_list_select_completion = ['<C-n>', '<Down>']
" let g:ycm_key_list_previous_completion = ['<C-p>', '<Up>']
"let g:SuperTabDefaultCompletionType = '<C-n>'

" better key bindings for UltiSnipsExpandTrigger
let g:UltiSnipsExpandTrigger = "<tab>"
let g:UltiSnipsJumpForwardTrigger = "<tab>"
let g:UltiSnipsJumpBackwardTrigger = "<s-tab>"

" Clear's the CtrlP Cache
:map <F5> :CtrlPClearCache<cr>

" Opens Ctrlp but in buffer search mode to quickly search in recent files
":nmap <leader>b :CtrlPBuffer<CR>
nmap <leader>d <Plug>DashSearch

" Visually Select Recently Pasted Text
nnoremap <expr> vp '`[' . getregtype()[0] . '`]'

"nnoremap gv `[v`]=
:nmap <leader>i :PluginInstall<cr>
:nmap <leader>u :PluginUpdate<cr>
:nmap <leader>pc :PluginClean<cr>

" Switch more precise go to last edit to closer key
nnoremap '' ``zz
nnoremap `` ''

" fun! PullAndRefresh()
"   set noconfirm
"   !git pull
"   bufdo e!
"   set confirm
" endfun
"
" nmap <leader>gl call PullAndRefresh()

" Should auto refresh after git pull (needs :set autoread too)
" :checkt[ime]
" Auto-Refreshes NerdTree
" :set autoread
"au CursorHold * if exists("t:NerdTreeBufName") | call <SNR>15_refreshRoot() | endif


" Allow saving of files as sudo when I forgot to start vim using sudo.
cmap w!! w !sudo tee > /dev/null %

" Vim Hard Mode UNCOMMENT AS SOON AS YOUR HAND STARTS FEELING BETTER!!!!!
"autocmd VimEnter,BufNewFile,BufReadPost * if !strlen(&buftype) | silent! call HardMode() | endif

" Work Arounds FIXME {{{
" }}}

" Plugin List {{{

""" Installed plugins

" Python syntax and style checker
Plugin 'nvie/vim-flake8'
" Vim Taskwarrior: managing tasks within vim
Bundle 'farseer90718/vim-taskwarrior'
" command Around/In function  'DOESN'T WORK WITH JS :(
" Plugin 'kana/vim-textobj-function'
" Matchit: allows you to configure % to match more than just single characters.
Plugin 'matchit.zip'
" Ag: Aka, the silver searcher. Like a search in all files for search term feature. <- DEPRICATED (T_T)
" Plugin 'rking/ag.vim'
" Ack: Basically the same as Ag (this silver searcher)
Plugin 'mileszs/ack.vim'
" Hard Mode: Turns off hjkl single motion.
Plugin 'wikitopian/hardmode'
" Unimpaired: quick mappings such as >p and =p etc.
Plugin 'tpope/vim-unimpaired'
" Vim Markdown: syntax highlighting and shortcuts
Plugin 'plasticboy/vim-markdown'
" CSS Colors: preview colors in source code while editing
Plugin 'skammer/vim-css-color'
" Dash: quickly see documentation for a fuction your cursor is currently on
Plugin 'rizzatti/dash.vim'
"Plugin 'xolox/vim-misc'
"Plugin 'xolox/vim-easytags'
" Colors Solarized: precision color scheme
Plugin 'altercation/vim-colors-solarized'
" Tern: kind of like c-tags
" Plugin 'marijnh/tern_for_vim'
" Vundle: Vim package manager
Bundle 'gmarik/vundle'
"Plugin 'jeffkreeftmeijer/vim-numbertoggle'
" Tabular: Quickly aligns code based off of =, commas, pipes, colons, etc
Plugin 'godlygeek/tabular'
" Emmet: Super fast html and css coding. Also really great shortcuts
Plugin 'mattn/emmet-vim'
" Bundle 'corntrace/bufexplorer'
" Vim Airline: Status tabline for the bottom of vim.
Bundle 'bling/vim-airline'
" Airline themes
Plugin 'vim-airline/vim-airline-themes'
" Ctrl P: Full path fuzzy file, buffer, mru, tag, ... finder for Vim.
Bundle 'kien/ctrlp.vim'
" Nerd Tree: A file tree explorer plugin. Think of it as the sidebar of a text editor/IDE.
Bundle 'scrooloose/nerdtree'
" TComment: an extensible & universal comment vim-plugin that also handles embedded filetypes.
Plugin 'tomtom/tcomment_vim'
"Plugin 'scrooloose/nerdcommenter'
" Syntastic: Syntax check.  Shows the lines that are currently messed up.
Bundle 'scrooloose/syntastic'
" Macvim Transparency: Able to adjust the transparency of macvim.
Plugin 't9md/vim-macvim-transparency'
" EasyMotion: super fast word navigation
Bundle 'Lokaltog/vim-easymotion'
" SuperTab: Vim completions with tab.
" Bundle 'ervandew/supertab'
"Bundle 'shawncplus/phpcomplete.vim'
" YouCompleteMe: Same as SuperTab
" Plugin 'Valloric/YouCompleteMe'
" Sparkup: Like an emmet knockoff
" Bundle 'rstacruz/sparkup', {'rtp': 'vim/'}
" Fugitive: a git wrapper so awesome it should be illegal.
Bundle 'tpope/vim-fugitive'
" PDV: php document editor
" Bundle 'tobyS/pdv'
" Ultisnips: filepath completion & snippets
Bundle 'SirVer/ultisnips'
" Git Gutter: Displays line changes relative to the previous commit.
"Bundle 'airblade/vim-gitgutter'
" Twig: Syntax highlighting, snipMate, etc.
Bundle 'evidens/vim-twig'
" Autoclose: Autoclose characters for you, like (), {}, []
Bundle 'Townk/vim-autoclose'
" Tmuxline: TODO:
Bundle 'edkolev/tmuxline.vim'
" Js Ctags: Ctags for javascript. Help you navigate from function call to function definition.
Plugin 'ramitos/jsctags'
" Bundle 'jelera/vim-javascript-syntax'
Plugin 'pangloss/vim-javascript'
Plugin 'sidorares/node-vim-debugger'
"http://bit.ly/1FeTOLT
Plugin 'jadejs/jade'
Plugin 'joyent/node'
Plugin 'caolan/nodeunit'
"Plugin 'balderdashy/sails'
" Plugin 'jamescarr/snipmate-nodejs'
" Undotree: Shows edit history up to the second of a file.
Plugin 'mbbill/undotree'
" Plugin 'justinj/vim-react-snippets'
" Handlebars Syntax Highlighting
" Plugin 'mustache/vim-mustache-handlebars'
" SnipMate and its dependencies:
Bundle "garbas/vim-snipmate"
Bundle "MarcWeber/vim-addon-mw-utils"
Bundle "tomtom/tlib_vim"
" vim-snippets: repository of snippets
Bundle "honza/vim-snippets"
" http://bit.ly/1IteUaf

Plugin 'mxw/vim-jsx'
" Surround: Allows you to quickly surround pieces of text.
Plugin 'tpope/vim-surround'
" Repeat: Allows all your plugins to be repeated with `.`
Plugin 'tpope/vim-repeat'
"Plugin 'majutsushi/tagbar' " http://vimawesome.com/plugin/tagbar
" }}} "

" Editing Options {{{
" ============================================================================ "
" ===                           EDITING OPTIONS                            === "
" ============================================================================ "
"
" Function shortcuts
" " Delete
" :nmap dif 0%j[mdi{
" :nmap daf 0%j[mda{dd
" :nmap dr 0%j[m0/)<cr>adi(
" :nmap dfn 0%j[m0wdiw
" " Visual
" :nmap vif 0%j[mvi{
" :nmap vaf 0%j[mva{dd
" :nmap vfr 0%j[m0/)<cr>avi(
" :nmap vfn 0%j[m0wviw
" " Remove and go into insert
" :nmap cif 0%j[mci{
" :nmap caf 0%j[mca{dd
" :nmap cfr 0%j[m0/)<cr>aci(
" :nmap cfn 0%j[m0wciw

" " Delete (without custom easymotion setup)
" Delete in function
:nmap dif 0%j[mdi{
" Delete around function
:nmap daf 0%j[mda{dd
" Delete args of function
:nmap dr 0%j[m0f)di(
" Delete function name
:nmap dfn 0%j[m0wdiw
" Visual (without custom easymotion setup)
:nmap vif 0%j[mvi{
:nmap vaf 0%j[mva{dd
:nmap vfr 0%j[m0f)vi(
:nmap vfn 0%j[m0wviw
" Remove and go into insert (without custom easymotion setup)
:nmap cif 0%j[mci{
:nmap caf 0%j[mca{dd
:nmap cfr 0%j[m0f)ci(
:nmap cfn 0%j[m0wciw


" Quickly Comment files in JSX
" TODO: make this work
"map: <leader>cj

"fix
:nmap >p p`[v`]>>

" If file changes outside of vim, autoreload it
:set autoread

""save and close all files and save global session
" nnoremap <leader>q :mksession! ~/.vim/Session.vim<CR>:wqa<CR>
""close all files without saving and save global session
"nnoremap <leader>www :mksession! ~/.vim/Session.vim<CR>:qa!<CR>

" function! RestoreSession()
"   if argc() == 0 "vim called without arguments
"     execute 'source ~/.vim/Session.vim'
"   end
" endfunction
" autocmd VimEnter * call RestoreSession()

set lazyredraw          " redraw only when we need to.
filetype indent on      " load filetype-specific indent files
"set autoindent          "Keep indentation from previous line
"set smartindent         "Automatically inserts indentation in some cases
set cindent             "Like smartindent, but stricter and more customisable

" Quickly Move Between Windows
:nmap <silent> <c-h> :wincmd h<cr>
:nmap <silent> <c-j> :wincmd j<cr>
:nmap <silent> <c-k> :wincmd k<cr>
:nmap <silent> <c-l> :wincmd l<cr>

" remap leader key to ,
let mapleader=","

" line numbers
set nu

" highlight current line
:set cursorline

map <leader>n :NERDTreeToggle<cr>

if has("gui_running")
    set guioptions=egmrt
endif

" hide scrollbars
set guioptions-=r
" hide toolbars
set guioptions-=t
" hide scrollbar in nerd tree
"set guioptions-=l
" Hide Left Scrollbar in MacVim
set go-=L

" edit vimrc/zshrc and load vimrc bindings
nnoremap .v :vsp $MYVIMRC<cr>
" edit vim notes quickly
nnoremap <leader>vn :vsp /Users/AlexCory/GoogleDrive/_Server_/Developer/git\ repositories/fasthacks/Dev\ Notes/vim\ notes.md<cr>
"nnoremap <leader>ez :vsp ~/.zshrc<cr>
nnoremap <leader>sv :source $MYVIMRC<cr>

nnoremap <leader>s :SnipMateOpenSnippetFiles<cr>
" nnoremap <leader>s :vsp ~/.vim/bundle/vim-react-snippets/snippets/javascript.snippets<cr>
nnoremap <leader>ss :source ~/.vim/bundle/vim-react-snippets/snippets/javascript.snippets<cr>


" Tabs as 4 spaces
set expandtab
set softtabstop=2
set shiftwidth=2

" Backspace works as it damn well should!
set backspace=indent,eol,start

" yank and paste with the system clipboard
set clipboard=unnamed
" set clipboard=unnamedplus

" Search highlighting
" set hlsearch
set nohlsearch

" Syntax highlighting and colors
syntax enable

" Enable matching pairs for match-it
filetype plugin on

" Hides buffers instead of closing them
set hidden

" do not wrap long lines by default
set nowrap

"set nolist

" incremental search
set incsearch

" ignore case when searching
set ignorecase

" if the search string has an upper case letter in it, the search will be case sensitive
set smartcase

" }}} "

" Misc. {{{
" ============================================================================ "
" ===                                 MISC.                                === "
" ============================================================================ "
" After writing to any .vimrc, source that file
au! BufWritePost .vimrc so %

" Possible fix for fugitive conflict with CtrlP
"au BufReadPost fugitive://* set bufhidden=delete

set encoding=utf-8

" Autocomplete in menu will list all available options that match
set wildmenu

" allow for tab completion in the command line
set wildmode=list:longest

"  autocmd BufRead,BufNewFile *.go set filetype=go
"  autocmd BufRead,BufNewFile *.go set makeprg=go\ build\ %

" Make any custom changes here. If this file doesn't exists, the
" base vimrc.custom is copied here to give you some font options
" If it already exists when you do a git pull it won't be overwritten
" if filereadable(expand("~/.vim/vimrc.local"))
"   source ~/.vim/vimrc.local
" endif

" highlight last inserted text
nnoremap gp `[v`]

" toggle undo tree
function! ToggleFocusUndoTree()
    :UndotreeToggle
    :UndotreeFocus
endfunction
nnoremap U :call ToggleFocusUndoTree()<cr>

" move vertically by visual line
nnoremap j gj
nnoremap k gk

" }}} "

" Display Setup {{{
" ============================================================================ "
" ===                            DISPLAY SETUP                             === "
" ============================================================================ "
" Set's relative line numbers (next 2 lines)
set number
set relativenumber

" Keeps React syntax highlighting in order
let g:jsx_ext_required = 0

" Toggles relative numbers
"function! NumberToggle()
  "if(&relativenumber == 1)
    "set number
  "else
    "set relativenumber
  "endif
"endfunc
"nnoremap <leader>n :call NumberToggle()<cr>
" Turns off relative numbers when focus is lost
":au FocusLost * :set number
":au FocusGained * :set relativenumber
" Use relative numbers when in normal mode
" autocmd InsertLeave * :set relativenumber
" Use absolute numbers when in insert mode
" autocmd InsertEnter * :set number
" au InsertEnter * :set nu
" au InsertLeave * :set rnu
" autocmd WinEnter,FocusGained * :setlocal number relativenumber
" autocmd WinLeave,FocusLost * :setlocal number norelativenumber

" ### Font and colorsheme ### "
try
    set background=dark
    colorscheme solarized
    let g:airline_theme = 'solarized'   " -- Airline color theme
  " Quickly toggle background
  map <F10> :let &background = ( &background == "dark"? "light" : "dark" )<CR>
catch
    colorscheme default
endtry

" Font setup
if has("gui_running")
  if has("gui_gtk2")
    set guifont=InconsolataForPowerline\ 10
  elseif has("gui_macvim")
    " Change splits to be just ║'s
    set fillchars=vert:║,fold:-
    highlight VertSplit guifg=fg guibg=bg
    " set guifont=Inconsolata+for+Powerline:h13
    let g:airline_powerline_fonts=1
    set guifont=Source\ Code\ Pro\ for\ Powerline:h12 "make sure to escape the spaces in the name properly
    " Line Number bg Color
    hi LineNr guibg=bg
  elseif has("gui_win32")
    set guifont=Consolas:h10:cANSI
  else
    highlight VertSplit ctermfg=fg ctermbg=bg
  endif
endif
" air-line
let g:airline_powerline_fonts = 1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

" unicode symbols
let g:airline_left_sep = '»'
let g:airline_left_sep = '▶'
let g:airline_right_sep = '«'
let g:airline_right_sep = '◀'
let g:airline_symbols.linenr = '␊'
let g:airline_symbols.linenr = '␤'
let g:airline_symbols.linenr = '¶'
let g:airline_symbols.branch = '⎇'
let g:airline_symbols.paste = 'ρ'
let g:airline_symbols.paste = 'Þ'
let g:airline_symbols.paste = '∥'
let g:airline_symbols.whitespace = 'Ξ'

" airline symbols
let g:airline_left_alt_sep = ''
" let g:airline_left_sep = '▶'
" let g:airline_right_sep = '◀'
let g:airline_left_sep = ''
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
let g:airline_symbols.linenr = ''
" }}}

" Plugin Setup {{{
" ============================================================================ "
" ===                             PLUGIN SETUP                             === "
" ============================================================================ "
" Access in and around parenthesis, brackets, and curly braces from anywhere on a line
nnoremap di( %di(
nnoremap da( %da(
nnoremap ci( %ci(
nnoremap ca( %ca(
nnoremap vi( %vi(
nnoremap va( %va(
nnoremap yi( %yi(
nnoremap ya( %ya(
nnoremap pi( %vi(p
nnoremap pa( %va(p
nnoremap di[ %di[
nnoremap da[ %da[
nnoremap ci[ %ci[
nnoremap ca[ %ca[
nnoremap vi[ %vi[
nnoremap va[ %va[
nnoremap yi[ %yi[
nnoremap ya[ %ya[
nnoremap pi[ %vi[p
nnoremap pa[ %va[p
nnoremap di{ %di{
nnoremap da{ %da{
nnoremap ci{ %ci{
nnoremap ca{ %ca{
nnoremap vi{ %vi{
nnoremap va{ %va{
nnoremap yi{ %yi{
nnoremap ya{ %ya{
nnoremap pi{ %vi{p
nnoremap pa{ %va{p

" PEP8/flake8 Setup
" to get workig on mac you need to symlink. Run this command: ln -s ~/.vim/bundle/vim-flake8/plugin ~/.vim/bundle/vim-flake8/ftplugin
" let g:PyFlakeOnWrite = 1
let g:flake8_show_in_gutter=1
autocmd BufWritePost *.py call Flake8()

" Syntastic Setup
let g:syntastic_javascript_checkers = ['standard']
" automatic formatting on save
" autocmd bufwritepost *.js silent !standard-format -w %
" set autoread

" The Silver Searcher
if executable('ag')
  " Use ag over grep
  set grepprg=ag\ --nogroup\ --nocolor

  " Use ag in CtrlP for listing files. Lightning fast and respects .gitignore
  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'

  " ag is fast enough that CtrlP doesn't need to cache
  let g:ctrlp_use_caching = 0
endif
" bind K to grep word under cursor
nnoremap K :grep! "\b<C-R><C-W>\b"<CR>:cw<CR>
" When \ is pressed, Vim waits for our input
" let g:ackprg = 'ag --nogroup --column'
nnoremap <leader>f :Ack<SPACE>

" t_comment remap
:nmap gci <c-_>i
:nmap gr <c-_>r
:nmap gb <c-_>b
:nmap gs <c-_>b
:nmap gp <c-_>p
" comment function
:nmap gcf 0%j[mgca{

" function! ShowFuncName()
"     let cursor_pos = getpos('.')
"     echohl ModeMsg
"     normal! [k
"     echo getline('.')
"     echohl None
"     call setpos('.', cursor_pos)
" endfunction
" nmap [[k :call <SID>ShowFuncName()

"imap <expr> <tab> emmet#expandAbbrIntelligent("\<tab>")
"let g:user_emmet_expandabbr_key = '<Tab>'
" When in, expand to 'className' (for jsx support) TODO: doesn't work
"let g:user_emmet_settings = {
"\    'javascript': {'extends': 'html', 'attribute_name': {'class': 'className'}}
"\ }


" Tabularize {   (Video: http://bit.ly/1RjVya3)
if exists(":Tabularize")
  " Aligns all equals signs around cursor
  nmap <Leader>a= :Tabularize /=<CR>
  vmap <Leader>a= :Tabularize /=<CR>
  " Aligns all colon signs around cursor
  nmap <Leader>a; :Tabularize /:<CR>
  vmap <Leader>a; :Tabularize /:<CR>
  " Aligns values after colons (i.e. JSON or JavaScript Files)
  nmap <Leader>a;; :Tabularize /:\\zs<CR>
  vmap <Leader>a;; :Tabularize /:\\zs<CR>
  " Aligns commas around cursor
  nmap <Leader>a, :Tabularize /,<CR>
  vmap <Leader>a :Tabularize /,<CR>
  " Aligns pipes around cursor
  "nmap <Leader>| :Tabularize /|<CR>
  "vmap <Leader>| :Tabularize /|<CR>
endif

" Auto aligns things after they've been aligned
inoremap <silent> <Bar>   <Bar><Esc>:call <SID>align()<CR>a

function! s:align()
 let p = '^\s*|\s.*\s|\s*$'
 if exists(':Tabularize') && getline('.') =~# '^\s*|' && (getline(line('.')-1) =~# p || getline(line('.')+1) =~# p)
   let column = strlen(substitute(getline('.')[0:col('.')], '[^|]', '', 'g'))
   let position = strlen(matchstr(getline('.')[0:col('.')], '.*|\s*\zs.*'))
   Tabularize/|/l1
   normal! 0
   call search(repeat('[^|]*|', column).'\s\{-\}'.repeat('.', position), 'ce', line('.'))
 endif
endfunction
"}

" ### Vim airine ### "
"set laststatus=2" -- Show airline even when only one split is open
" -- Hide default mode indicator
set noshowmode
"let g:airline_powerline_fonts = 1 " -- Allow fancy separators
"let g:airline#extensions#syntastic#enabled = 1
"let g:airline#extensions#branch#enabled = 1
"let g:airline#extensions#tmuxline#enabled = 1
"let g:airline_section_warning = 'syntastic'
"Custom setup that removes filetype/whitespace from default vim airline bar
"let g:airline#extensions#default#layout = [[ 'a', 'b', 'c' ], ['x', 'warning' ]]
" Keep list of open files in buffer at top
"let g:airline#extensions#tabline#enabled = 1

" ### PDV ### "
"let g:pdv_template_dir = $HOME ."/.vim/bundle/pdv/templates"

" ### Ctrlp ### "
" Define default location for ctrlp to begin searching
let g:ctrlp_working_path_mode = 'ra'
let g:ctrlp_custom_ignore = 'node_modules\|DS_Store\|git'

" ### Syntastic ### "
" ReactJS Syntax Linter:
" let g:syntastic_javascript_checkers = ['eslint', 'jsxhint']
" JavaScript Syntax Linter:
let g:syntastic_javascript_checkers = ['eslint']
"autocmd! BufEnter  *.jsx  let b:syntastic_checkers=['jsxhint']
" Disable some features to make syntastic faster
"let g:syntastic_enable_signs = 0
"let g:syntastic_enable_balloons = 0

" ### SuperTab ### "
let g:SuperTabDefaultCompletionType = "context"
let g:SuperTabContextTextOmniPrecedence = ['&omnifunc', '&completefunc']
let g:SuperTabLongestHighlight = 2
let g:SuperTabClosePreviewOnPopupClose = 1

" ### Tagbar Options ### "
"map <F12> :TagbarToggle<CR>
"let g:tagbar_ctags_bin

" ### Nerdtree ### "
" Only open nerdtree if no file was specified on startup
" function! StartUpNerdtree()
"     if 0 == argc()
"         NERDTree
"     end
" endfunction
"
" autocmd VimEnter * call StartUpNerdtree()
autocmd VimEnter * NERDTree
" Nerd Tree Ignore certain files by extension
let NERDTreeIgnore = ['\.pyc$']
" }}} "

" Key Mappings {{{
" ============================================================================ "
" ===                             KEY MAPPINGS                             === "
" ============================================================================ "
" Note: This section is useful to get a quick idea of all the built-in
" shortcuts so you have a better idea of what can be done with the default
" setup
" Quickly move to middle of current line
" :map <c-m> :call cursor(0, len(getline('.'))/2)<cr>
" Quick save all
:map <leader>a :wa<CR>
" Open new vertical pane
:map <leader>t <C-w>v<C-w>l
:map <leader>T <C-w>S<C-w>j
" Quick save and quit
:map <leader>w :wq<CR>
" Quick quit
:map <leader>q :q<CR>
" Quick quit all
:map <leader>x :qa<CR>
" For quick jump to line
:map <SPACE> Gzz
" STOP USING ARROW KEYS! A.K.A. Vim Hard Mode
  " Keeps you from using arrow keys in insert mode
   "noremap  <Up> ""
   "noremap! <Up> <Esc>
   "noremap  <Down> ""
   "noremap! <Down> <Esc>
   "noremap  <Left> ""
   "noremap! <Left> <Esc>
   "noremap  <Right> ""
   "noremap! <Right> <Esc>
   "" Keeps you from hitting j twice
   ""noremap hh <NOP> noremap j <NOP> noremap k <NOP> noremap l <NOP>
   "function! DisableIfNonCounted(move) range
       "if v:count
           "return a:move
       "else
           "" You can make this do something annoying like:
              "" echoerr "Count required!"
              "" sleep 2
           "return ""
       "endif
   "endfunction

   "function! SetDisablingOfBasicMotionsIfNonCounted(on)
       "let keys_to_disable = get(g:, "keys_to_disable_if_not_preceded_by_count", ["j", "k", "l", "h"])
       "if a:on
           "for key in keys_to_disable
               "execute "noremap <expr> <silent> " . key . " DisableIfNonCounted('" . key . "')"
           "endfor
           "let g:keys_to_disable_if_not_preceded_by_count = keys_to_disable
           "let g:is_non_counted_basic_motions_disabled = 1
       "else
           "for key in keys_to_disable
               "try
                   "execute "unmap " . key
               "catch /E31:/
               "endtry
           "endfor
           "let g:is_non_counted_basic_motions_disabled = 0
       "endif
   "endfunction

   "function! ToggleDisablingOfBasicMotionsIfNonCounted()
       "let is_disabled = get(g:, "is_non_counted_basic_motions_disabled", 0)
       "if is_disabled
           "call SetDisablingOfBasicMotionsIfNonCounted(0)
       "else
           "call SetDisablingOfBasicMotionsIfNonCounted(1)
       "endif
   "endfunction

   "command! ToggleDisablingOfNonCountedBasicMotions :call ToggleDisablingOfBasicMotionsIfNonCounted()
   "command! DisableNonCountedBasicMotions :call SetDisablingOfBasicMotionsIfNonCounted(1)
   "command! EnableNonCountedBasicMotions :call SetDisablingOfBasicMotionsIfNonCounted(0)

   "DisableNonCountedBasicMotions

" Document php function by placing cursor on function line
" Can write your own templates or use default templates
"nnoremap <leader>g :call pdv#DocumentCurrentLine()<CR>

" provide hjkl movements in Insert mode via the <Alt> modifier key
"imap ˙ <C-o>b
"imap ¬ <C-o>w
"imap ˚ <C-o>k
"imap ∆ <C-o>j
" Beginning and End of line in insert mode
"inoremap <A-b> <C-o>b
"inoremap <A-w> <C-o>w

" Clear highlighted search terms while preserving history
nmap <silent> <leader><space> :nohlsearch<CR>

" find/search and replace (another windows shortcut)
map <leader>/ :%s//gc<left><left><left>

" === Nerdtree shorcuts === "
" Open Nerdtree
" nmap <leader>n :NERDTree<CR>

" Opens current file heiarchy in Nerdtree
" nmap <leader>f :NERDTreeFind<CR>

" === Tagbar shortcuts === "
"Open Tagbar or jump to it if already open (useful for split windows)
"nmap <leader>] :TagbarOpen j<CR>

" Toggle Tagbar on and off with F6
"nmap <c-j> :TagbarToggle<cr>

" === Ctrlp shortcuts === "
" Fuzzy search for files. You can specify where ctrlp will start searching
" above. Having these duplicate settings may be unecessary
" nmap <leader>t :CtrlP<CR>
" let g:ctrlp_map = "<leader>t"

" Opens Ctrlp but in buffer search mode to quickly search in recent files
" nmap <leader><leader> :CtrlPBuffer<CR>

" Svn blame highlighted lines in visual mode for svn users
" vmap gl :<C-U>!svn blame <C-R>=expand("%:p") <CR> \| sed -n <C-R>=line("'<") <CR>,<C-R>=line("'>") <CR>p <CR>

" Remove trailing whitespace
function! <SID>StripTrailingWhitespace()
  " Preparation: save last search, and cursor position.
  let _s=@/
  let l = line(".")
  let c = col(".")
  " Do the business:
  %s/\s\+$//e
  " Clean up: restore previous search history, and cursor position
  let @/=_s
  call cursor(l, c)
endfunction
nmap <silent> <leader>y :call <SID>StripTrailingWhitespace()<CR>
" fun! StripTrailingWhitespace()
"     " Only strip if the b:noStripeWhitespace variable isn't set
"     if exists('b:noStripWhitespace')
"         return
"     endif
"     %s/\s\+$//e
" endfun
"
" autocmd BufWritePre * call StripTrailingWhitespace()
" autocmd FileType ruby,javascript,perl let b:noStripWhitespace=1
" }}} "

" Misc. Options {{{
" ============================================================================ "
" ===                            MISC. OPTIONS                             === "
" ============================================================================ "
" Change case of a word by tapping ~ until you get the correct case
function! TwiddleCase(str)
  if a:str ==# toupper(a:str)
    let result = tolower(a:str)
  elseif a:str ==# tolower(a:str)
    let result = substitute(a:str,'\(\<\w\+\>\)', '\u\1', 'g')
  else
    let result = toupper(a:str)
  endif
  return result
endfunction
vnoremap ~ y:call setreg('', TwiddleCase(@"), getregtype(''))<CR>gv""Pgv

" Quick Remap of Window Size    (Ref: http://bit.ly/1e8sW4a)
:map ˚ :vertical resize +5<CR>
:map ∆ :vertical resize -5<CR>

" For quick save/quit
nnoremap ; :

" Allows you to save files you opened without write permissions
"cmap w!! w !sudo tee %

" Go support
"set rtp+=$GOROOT/misc/vim

" Highlight trailing whitespace
autocmd InsertEnter * syn clear EOLWS | syn match EOLWS excludenl /\s\+\%#\@!$/
autocmd InsertLeave * syn clear EOLWS | syn match EOLWS excludenl /\s\+$/
highlight EOLWS ctermbg=red guibg=red

" Auto-format go code on save
"fun! Gofix()
"let regel=line(".")
"%!$GOROOT/bin/gofmt
"call cursor(regel, 1)
"endfunction

"autocmd Filetype go command! Fmt call Gofix()

" Set backups
if has('persistent_undo')
  set undodir=~/.vim/tmp/undo//     " undo files
  set undofile
  set undolevels=3000
  set undoreload=10000
endif
set backupdir=~/.vim/tmp/backup// " backups
set directory=~/.vim/tmp/swap//   " swap files
set backup
set noswapfile

" }}} "
hi VertSplit ctermbg=NONE guibg=NONE
set fillchars+=vert:⎸

" space open/closes folds
nnoremap <leader>. za
set foldnestmax=10      " 10 nested fold max "
set foldlevelstart=10   " open most folds by default "
set foldenable          " enable folding "
set modelines=1
" vim:foldmethod=marker:foldlevel=0
