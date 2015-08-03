Zend Starter Project Notes
--------------------------

### Go to: MAMP Preferences -> Apache -> Document root:
    <!-- Set it to be: -->
    /Applications/MAMP/htdocs/learn_Zend/ZendSkeletonApplication-master/public

### Go to:
    /private/etc/apache2/httpd.conf

### Look for this line
    #
    # AllowOverride controls what directives may be placed in .htaccess files.
    # It can be "All", "None", or any combination of the keywords:
    #   Options FileInfo AuthConfig Limit
    #   CHANGED
    AllowOverride None

### Edit to be:
    AllowOverride FileInfo

### Then add this:
    <VirtualHost *:80>
        ServerName zf2-tutorial.localhost
        DocumentRoot /Applications/MAMP/htdocs/learn_Zend/ZendSkeletonApplication-master/public
        SetEnv APPLICATION_ENV "development"
        <Directory /Applications/MAMP/htdocs/learn_Zend/ZendSkeletonApplication-master/public>
            DirectoryIndex index.php
            AllowOverride All
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost>

### I put mine directly under this line
    # 'Main' server configuration
    #
    # The directives in this section set up the values used by the 'main'
    # server, which responds to any requests that aren't handled by a
    # <VirtualHost> definition.  These values also provide defaults for
    # any <VirtualHost> containers you may define later in the file.
    #
    # All of these directives may appear inside <VirtualHost> containers,
    # in which case these default settings will be overridden for the
    # virtual host being defined.
    #
    <!-- right here -->

### Then go here:
    /private/etc/hosts

### Edit from this:
    ##
    # Original:
    # 127.0.0.1 localhost
    # 255.255.255.255   broadcasthost
    # ::1             localhost 
    # fe80::1%lo0   localhost
    ##

### To look like this:
    ##
    # Zend Tutorial
    127.0.0.1   zf2-tutorial.localhost
    255.255.255.255 broadcasthost
    ::1             zf2-tutorial.localhost
    fe80::1%lo0 zf2-tutorial.localhost
    #

### Make sure you have composer installed by typing this into the terminal:
    php composer.phar install

### Then go to your terminal and type in:
    # to navigate to the correct directory
    cd  path/to/zend/project/directory
    # mine was: 
    #/Applications/MAMP/htdocs/learn_Zend/ZendSkeletonApplication-master/
    
    # to install the  zend framework into this directory
    php composer.phar self-update
    php composer.phar install










