#RESTful APIs

REST: Representational State Transfer
-------------------------------------

### Resources
 - Wikipedia: http://bit.ly/1Jo5YTQ

"The fastest request is one you don't have to perform" -Keith Casey (lynda)

 - REST is NOT pretty urls, not necessarily XML or even JSON
 - REST is a generally agreed upon set of principles and constraints

| SOAP           |          REST                                       |
| -------------- | --------------------------------------------------- |
| like a morgage |  like borrowing $10                                 |
| documented     |   No documentation up front                         |
|  detailed      |   No hard and fast requirements                     |
|                |   Agreement to pay back friend is implicit, not explicit |
|                |   You may pay them back in a variety of ways (i.e. buy them lunch, pay tomorrow, etc.)|


6 Constraints of REST
---------------------
1. Client-Server
  - Ex: web browser and web server
  - By seperating the two, they can be upgraded independently
  - Scalability and reliability
2. Stateless
  - allows each request to stand on it's own in any order required
  - sending credentials with each request because we can't count on the login request getting their before subsequent requests
  - Ex: curl -X POST 'https://api.twilio.com/2010-04-01/Accounts/ACxxxx/SMS/Messages.xml'
        -d 'From=13174323180'
        -d 'To=16503088073'
        -d 'Body=This+is+an+awesome+freaking+sentence.' (the -d adds data)
        -u ACxxxx:{AuthToken}                           (the -u part is key)
  - STRENGTH: this allows us to send 1 request, in any order
  - Advantages:
    - Flexibility (don't have to predict every scenario before launching the system)
    - Stability
    - Reliability  (if we lose a request, later requests will still work)
3. Cacheable
  - Each message should describe whether it's cacheable
  - Primary Benefit:
    - Improve network and application usage by reducing and eliminating requests
    - This makes the system more reliable and scalable
  - Item Potency:
    - This is the idea that you can make the same request multiple times and you end up with the same result you had on the first request.
  - GET, PUT, DELETE shoud be idempotent, or "safe"
    __The word `safe` means that if a given HTTP method is invoked, the resource state on the server remains unchanged.__
  - POST can be used for multiple operations and so cannot be cached (POST IS NOT CONSIDERED CACHEABLE)
  - TOOLS:
    - Signaling
      - Etags:  (Used to inform the cache on what is cacheable and what is not)
        - Built for cache signaling
        - Generated for individual requests
        - Compare to see if anything has changed
        - Available via the HEAD verb
        - How it works:
          - For each request, a new tag is generated to go along with the content. The etags are sent in the headers.
          - When a new request is made, the etag value is checked.  If it's the same, we know the content hasn't changed.
          - Wikipedia: http://bit.ly/1MnYoqT
    - Caching
      - Varnish
      - Memcache
4. Layered System
    - Don't count on the client interacting directly with the server
    - We use this on the web every day (when databases talk to web servers)
    - Adds silent, invisible dependencies (using an IP address instead of a domain name to connect the web server to a database server)
    - Why?
        - Allows in-between systems to add/improve functionality
        - Allows load balancers, caches, logging, authorization, etc.
5. Code on Demand (optional)
    - A request doesn't just retrieve a resource, but also the code to act upon it
    - We don't have to know or understand the code, just how to run it
    - Allows for flexibility, upgradability
6. Uniform Interface
    1. Identification of resources (each resource should be uniquly accesible via a particular URL)
        - Generally
            /noun/id
            /noun/action/id
        - But not required
            /?n=noun&id=id
            /?n=noun&a=action&id=id
    2. Manipulation of Resources through these Representations
        - Example using Twilio API
            /2010-04-01/Accounts/{AccountSid}/Calls/{CAxxx}
            /2010-04-01/Accounts/{AccountSid}/Recordings/{RExxx}
            /2010-04-01/Accounts/{AccountSid}/SMS/{SMxxx}
            ================================================
            GET     {all}
            POST    {only for Calls & SMS}
            PUT     n/a
            DELETE  {only for Recordings}
    3. Self-descriptive Messages
        - Each message should tell you:
            - if that resource is cacheable
            - how to process itself                     (because of this, our client only needs to know how to retrieve and execute those instructions, not generate them)
            - how to request the next resource          (we don't need to figure out how to view a resource such as an email, the payload tells us how to do that)
    4. Hypermedia as the engine of application state (HATEOAS)



Using Curl  
----------  
Show header: `curl -I https://api.github.com` ( -I = Fetch the HTTP-header only!)
```bash
Create Repo: curl -u alex-cory -X POST https://api.github.com/user/repos -d '{"name":"cool"}'
Delete Repo: curl -X DELETE -H 'Authorization: token {access token goes here w/ out curly braces}' https://api.github.com/repos/{username}/{name of repo}
Get Repos:   curl -i https://api.github.com/users/alex-cory/repos/
               curl -u alex-cory -X GET https://api.github.com/user/repos
```

HTTP Responses and Payloads
---------------------------
- Payload:
    - HTML, JSON, XML, or whatever comes back that you an view and process
- Headers:
    - 5 Types of HTTP Response Codes:
        1. 1xx  Informational
        2. 2xx  Sucess             (means whatever we were attempting to accomplish was successful)
            - 200 OK                      - successfully retrieved a resource
                  - Ex: curl -I https://api.github.com
                  - the above example pulls in the http header
            - 201 Created                 - resource successfully created
                  - Ex: curl -u alex-cory -X POST https://api.github.com/user/repos -d '{"name":"cool"}'
                  - the above example creates a new repo named cool
            - 202 Accepted                - the action is underway but not completed yet
            - 204 No Content              - primarily used when deleting a resource
        3. 3xx  Redirect            (used when an original resource is moved from it's URI)
            - 301 Moved Permanently       -
            - 301 Moved Temporarily       -
        4. 4xx  Client Error
            - 400 Bad Request             - the most recent attempt failed due to the Client itself
            - 401 Authentication Required - doesn't signify whether the operation would've worked or not
            - 403 Forbidden               - Almost opposite of 401, whatever action was understood, but explicitly failed (i.e. delete resouce w/ incorrect permissions)
            - 404 Not Found               - Whatever resource you are attempting to find was not found
        5. 5xx  Server Errors
    - Content-Type
        - Identifies the type of payload being passed back by the server
        - Ex: Content-Type: application/json; charset=utf-8
    - Media-Type
        - How the payload is structured and how things work together.
        - This allows the client parser to figure out how best to process the payload
        - Ex: X-Github-Media-Type: github.v3

DON'T CREATE YOUR OWN RESPONSE CODES

  "An Affordance is a quality of an object, or an environment, which allows a user to perform an action." - Mike Amundsen

Ex:
  - Doorknob: affordance for opening a door
  - Light Switch: affordance for turning on a light

Everything an api allows a user to do is an affordance.


3 Strategies for Building an API
--------------------------------  
  1. Bolt-On Strategy
    - This is when you have an existing application and you add an API after the fact.
    - Brute force approch.
    - Generally the fastest way to get something useful.
    - Problems in the application tend to "leak through" into the API
  2. Greenfield Strategy
    - Genearlly the "API first" or "mobile first" mindset
    - Not always possible to derive business value quickly or easily
  3. Facade Strategy (pronounced fassad)
    - The middle ground between bolt-on and greenfield.
    - Take existing business systems and fit them together.
    - Can be challenging with "multiple mindsets" in the system

Tips for API Modeling
---------------------  
  1. Don't worry about the tools
  2. Have a consistent process
  3. It doesn't count unless it's written down
  4. DOCMENT EVERYTHING!

  - A missing order
    - GET /orders/:id
  - Reorder the same order as last time
    - POST /cart/item/:item_id
    - copy
    - POST/order/:id
  - Cancel part of an order
    - GET /orders
    - PUT

RESTful Web APIs
----------------  
#### Most Important HTTP Header:
is `Content-Type,` which tells the HTTP client how to understand the `entity-body`. **It’s so important that its value has a special name.** We say the value of the `Content-Type header is the entity-body’s media type.` (It’s also called the `MIME type or the content type.` Sometimes “media type” is hyphenated: media-type.)  

#### Creator of REST  
Roy T. Fielding’s 2000 dissertation on software architecture, which gathered them together under the name “REST.”

#### Hypermedia Controls  
Ex: `<a>, <form>, <audio>, <video>, <iframe>, and <img>`[ref: 1]

#### AtomPub  
  - AtomPub has the same concepts as Collection+JSON, but uses different terminology. Instead of a “collection” that contains “items,” this is a “feed” that contains “entries.”
  - The Atom Publishing Protocol is a standardized workflow for editing and publishing news articles, using the Atom file format as the representation format. RFC 5023
  - The first standard to describe the collection pattern.

#### Profiles  
  - A profile is defined to not alter the semantics of the
    resource representation itself, but to allow clients to
    learn about additional semantics… associated with the
    resource representation, in addition to those defined
    by the media type… [2]

#### Idempotent  
  - Sending a request twice has the same effect on resource state as
    sending it once.
  - The DELETE method has another useful property: it’s idempotent. Once
    you delete a resource, it’s gone. The resource state has permanently
    changed. You can send another DELETE request, and you might get a 404
    error, but the resource state is exactly as it was after the first
    request. The resource is still gone. That’s idempotence. Sending a
    request twice has the same effect on resource state as sending it once.
  - The notion of idempotence comes from math. Multiplying a number by zero
    is an idempotent operation. 5 × 0 is zero, but 5 × 0 × 0 is also zero.
    Once you multiply a number by zero, you can keep multiplying it by zero
    indefinitely and get the same result: zero. HTTP DELETE effectively
    multiplies a resource by zero.
  - Reference: RESTful Web APIs (O'Reily book)

#### Referential transparency  
  - In the most simplest, yet somewhat incorrect way to put this, don't
    use global variables and make sure your functions keep a tighter scope
    to stay within the bounds of referential transparency. LOOK AT EXAMPLES
    BELOW! :)
  - Great Example: https://goo.gl/iDJr00
  - Quora Explanation: http://qr.ae/7NJJT4


References:
-----------
  - [1] http://bit.ly/1AR1vXf
  - [2] RFC 6906
  -
