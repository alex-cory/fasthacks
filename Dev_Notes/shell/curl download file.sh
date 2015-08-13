# The -o --output option means curl writes output to file you specicify instead of stdout, you put the url after -o, so the curl thinks # the url is a file to write and no url specified. You need a file name after the -o, then the url. Since the url is HTTPS-based, maybe # you also need the -k option:

curl -o ./filename -k https://github.com/jdfwarrior/Workflows.git  # MAKE SURE YOU HAVE THE "RAW URL" otherwise it might not work


# Reference: (http://goo.gl/3iQRcn)