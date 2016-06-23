# geteventstore-range

A small geteventstore-promise extension to retrieve events ranges from EventStore.

Use along with [geteventstore-promise](https://www.npmjs.com/package/geteventstore-promise) to enrich your events queries. 

Very useful for snapshots, or when you don't know where your stream end but you know where you want to begin to read. Or vice-versa.

geteventstore-range abstracts the effort to load very long streams by retrieving it in many reasonable chunks (you define the size, that is the number of events to load on every request). It does it thanks to the geteventstore-promise eventEnumerator plus some own logic. It always try to be as lazy as possible about database hits, in an optimistic way.



# Installation
At the command-line, install geteventstore-range AND geteventstore-promise:
> npm install geteventstore-range geteventstore-promise

# Usage
In your Node.js application, inject a EventStore client into the GES Range object:

```javascript

var eventstore = require('geteventstore-promise');
var EventStoreRange = require('geteventstore-range');

var client = eventstore.tcp({
    hostname: 'localhost',
    port: 1113,
    credentials: {
        username: 'admin',
        password: 'changeit'
    }
});

var esRange = new EventStoreRange(client);

```

# Methods

There is only one method available, with different arguments

## getStreamRange

If you want to retrieve from start to a defined event number:

```javascript

esRange.getStreamRange('MyStreamName', 'start', 42, function(error, response){
  console.log(error, response);
});

```


If you want to retrieve from a defined event number to the end of the stream:

```javascript

esRange.getStreamRange('MyStreamName', 42, 'end', function(error, response){
  console.log(error, response);
});

```


If you just want all the stream:

```javascript

esRange.getStreamRange('MyStreamName', 'start', 'end', function(error, response){
  console.log(error, response);
});

```

At the moment there is no option of the range start and end to be both numbers. It wasn't needed when i develop this module, but i may implement it in the future. Or, who knows, you can help me with it!

### Range Tolerance

If the range numbers you define are out of the real stream size, the method will not crash or loop forever. It will return de available streams when it is possible, or return an out of range error.

# Tests

Some basic tests are implemented, using [Mocha](https://mochajs.org/). To run them type in your terminal:

> EVENTSTORE_HOST="localhost" EVENTSTORE_PORT="1113" EVENTSTORE_USER="admin" EVENTSTORE_PASS="changeit" npm test