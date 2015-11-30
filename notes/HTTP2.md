# HTTP/2 Notes

GO HERE: http://bit.ly/1gQIgDX
node.js server and HTTP/2 (2.0) with express.js: http://bit.ly/1HM9G6S
node-http2: https://github.com/molnarg/node-http2
TODO: Write a project description

## Installation

TODO: Describe the installation process

## Usage

TODO: Write usage instructions

## Features

1. Multiplex requests over a single TCP connection:
    - Overcome TCP slow start
2. Header Compression
    - Reduce bandwidth usage
3. Request Prioritization:
    - Important resources arrive first
4. Server push:
    - Reduce number of round trips
5. Run everything over TLS (Transport Layer Security)
6. No changes to methods, status codes, headers, or standard pors (80, 43)

### Header Compression
  - lots of repeated header content in each request
  - CRIME doesn't play well with encryption
  - As of August 2014, using HPACK (format for header compression)

### Server Push (http://bit.ly/1MN7TQ8)
  - Shove resources down browsers' throats (aka send resources to browsers unsolicited)
  - By the time the browser has parsed the HTML/JS and wants to request the resource,
    it's already in the browser cache.
  ```
  if (request.url === '/index.html' && response.push) {
    var stream = response.push('/jquery.js', {'Content-Type': 'text/javascript'},
    fs.createReadStream('/jquery.js').pipe(stream));
  }
  ```

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write licenseODO: Write license
