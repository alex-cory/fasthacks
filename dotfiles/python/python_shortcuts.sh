#!/bin/sh
# Python Shortcuts, Aliases, Functions, and more! :p

# Django Source Files # TODO: make this have no quotes or brackets with output
alias django_src="$(echo 'python -c "
import sys
sys.path = sys.path[1:]
import django
print(django.__path__)"' | sed -e 's/^["'//' -e 's/'"]$//')"


