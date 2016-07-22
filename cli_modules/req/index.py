import click

@click.command()
def req(default_host):
    set_default_host(default_host)
    for x in range(count):
        click.echo('Hello %s!' % name)

if __name__ == '__main__':
    hello()

def set_default_host(host):
    file = open('~/.reqrc', 'w')
    file.write(host)
    file.close()

@click.command()
def GET():
    pass


@click.command()
def POST():
    pass


@click.command()
def PUT():
    pass


@click.command()
def PATCH():
    pass


@click.command()
def DELETE():
    pass


@click.command()
def OPTIONS():
    pass


@click.command()
def HEAD():
    pass


@click.command()
def CONNECT():
    pass


@click.command()
def TRACE()
    pass
