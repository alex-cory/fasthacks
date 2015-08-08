# Django Notes

### Create New Project

    django-admin.py startproject FirstBlog


### Creates new Database

    python FirstBlog/manage.py syncdb


### Create New App

    python manage.py startapp polls

Creates Directory that looks like:

    polls/
        __init__.py
        admin.py
        migrations/
            __init__.py
        models.py
        tests.py
        views.py


### Use our Models to create tables in the database by running the following command

    python2.6 manage.py syncdb


### Start Server

    mysqld



### Start Development Server

  python2.6 manange.py runserver


### Automatic reloading of runserver

The development server automatically reloads Python code for each request as needed. You
don’t need to restart the server for code changes to take effect. However, `some actions
like adding files don’t trigger a restart, so you’ll have to restart the server in these
cases.`

### Projects vs. apps

What’s the difference between a project and an app? An app is a Web application that does
something – e.g., a Weblog system, a database of public records or a simple poll app. A
project is a collection of configuration and apps for a particular Web site. A project
can contain multiple apps. An app can be in multiple projects.

### Don’t repeat yourself (DRY)

Every distinct concept and/or piece of data should live in one, and only one, place. Redundancy
is bad. Normalization is good.

The framework, within reason, should deduce as much as possible from as little as possible.

### Make Migrations
By running makemigrations, you’re telling Django that you’ve made some changes to your models
(in this case, you’ve made new ones) and that you’d like the changes to be stored as a migration.

Migrations are how Django stores changes to your models (and thus your database schema) - they’re
just files on disk. You can read the migration for your new model if you like; it’s the file
polls/migrations/0001_initial.py.

    python manage.py makemigrations polls

    # Output
    Migrations for 'polls':
      0001_initial.py:
        - Create model Question
        - Create model Choice
        - Add field question to choice

### SQL Migrate
The sqlmigrate command takes migration names and returns their SQL

    python manage.py sqlmigrate polls 0001

    # Ouput
    BEGIN;
    CREATE TABLE "polls_choice" (
        "id" serial NOT NULL PRIMARY KEY,
        "choice_text" varchar(200) NOT NULL,
        "votes" integer NOT NULL
    );
    CREATE TABLE "polls_question" (
        "id" serial NOT NULL PRIMARY KEY,
        "question_text" varchar(200) NOT NULL,
        "pub_date" timestamp with time zone NOT NULL
    );
    ALTER TABLE "polls_choice" ADD COLUMN "question_id" integer NOT NULL;
    ALTER TABLE "polls_choice" ALTER COLUMN "question_id" DROP DEFAULT;
    CREATE INDEX "polls_choice_7aa0f6ee" ON "polls_choice" ("question_id");
    ALTER TABLE "polls_choice"
      ADD CONSTRAINT "polls_choice_question_id_246c99a640fbbd72_fk_polls_question_id"
        FOREIGN KEY ("question_id")
        REFERENCES "polls_question" ("id")
        DEFERRABLE INITIALLY DEFERRED;

    COMMIT;

### Check For Problems
Checks for any problems in your project without making migrations or touching the database

    python manage.py check

    # Output
    System check identified no issues (0 silenced).

### 3 Step Guide To Making Model Changes:
  1. Change your models (in models.py)
  2. Run `python manage.py makemigrations` to make migrations for those changes
  3. Run `python manage.py migrate` to apply those changes to the database

### The importance of `__str__()` methods
It’s important to add `__str__()` methods to your models, not only for your own convenience when
dealing with the interactive prompt, but also because objects’ representations are used
throughout Django’s automatically-generated admin.
Reference: http://bit.ly/1MWJo39

### Python Shell Tips
A great way to introspect an unfamiliar object is to type the object name followed by a dot then hit tab.
You will see the methods and attributes for that object.

You can get the output from the last command run with the variable `_` (underscore). For example:

    >>> {1:2, 3:4}
    {1: 2, 3: 4}
    >>> t = _
    >>> t
    {1: 2, 3: 4}

Use the built-in help() method to get more info on a function or module. For example:

    >>> import os
    >>> help(os)
    Help on module os:
    ...

### Django Source Files

    $ python -c "
    import sys
    sys.path = sys.path[1:]
    import django
    print(django.__path__)"


### Making Views In Django
(http://bit.ly/1M1J0Sn)
- `url()` function is passed 4 arguments. 2 required (`regex` and `view`).  2 optional (`kwargs` and `name`)

#### url() argument: regex
- regex doesn't search for GET and POST params
- URLconf looks for `myapp/`
- super fast as they are loaded first

#### url() argument: view
- When Django finds a regular expression match, Django calls the specified view function, with an HttpRequest object
  as the first argument and any “captured” values from the regular expression as other arguments.

#### url() argument: kwargs
- Arbitrary keyword arguments can be passed in a dictionary to the target view. We aren’t going to use this feature
  of Django in the tutorial.

#### url() argument: name
- allows you to make global changes to the url patterns of your project while only touching a single file.


### 
Always return an HttpResponseRedirect after successfully dealing
with POST data. This prevents data from being posted twice if a
user hits the Back button.

### request.POST 
- a dictionary-like object that lets you access submitted html form data by key name.
- values are always strings

### HttpResponseRedirect
- you should always return an HttpResponseRedirect after successfully dealing with POST data. This tip
  isn’t specific to Django; it’s just good Web development practice.
