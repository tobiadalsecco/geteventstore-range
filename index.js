function EventStoreRange(es, opts){

  this.es = es;

  this.opts = opts || {};

  if(!this.opts.chunkSize) this.opts.chunkSize = 100;

  this.readApparelStreamFromEndTo = function(eventToReach, streamName, onComplete){
    var enumerator = this.es.eventEnumerator(streamName, 'backward');
    var accumulator = [];
    var maxEvent = 0;
    this.goBackwardUntil(eventToReach, accumulator, enumerator, maxEvent, function(error, events){
      onComplete(error, events);
    });
  }
  this.goBackwardUntil = function(eventToReach, accumulator, enumerator, maxEvent, onComplete){
    var me = this;
    enumerator.next(this.opts.chunkSize).then(function(result) {
      if(result.events.length == 0){
        return onComplete(null, accumulator);
      }
      var complete = false;
      var events = result.events;
      var counter = 0;
      // if the target event is bigger than the last eventNumber, the script woulkd loop forever.
      // let's avoid it by detecting the loop. it's the only way, because we don't know the last eventNumber yet.
      // well... we could get this info, but we want to mantain it lazy for cdb alls, so just monitor this (rare) case.
      if(events[0].eventNumber == maxEvent){
        return onComplete('Target Event out of range');
      }
      newMaxEvent = Math.max(events[0].eventNumber, maxEvent);
      for(var i in events){
        counter++;
        var currEvent = events[i];
        accumulator.unshift(currEvent);
        if(currEvent.eventNumber == eventToReach){
          complete = true;
          break;
        }
      }
      if(!complete){
        me.goBackwardUntil(eventToReach, accumulator, enumerator, newMaxEvent, onComplete);
      } else {
        onComplete(null, accumulator);
      }
    });
  }



  this.readApparelStreamFromStartTo = function(eventToReach, streamName, onComplete){
    var enumerator = this.es.eventEnumerator(streamName, 'forward');
    var accumulator = [];
    this.goForwardUntil(eventToReach, accumulator, enumerator, function(error, events){
      onComplete(error, events);
    });
  }
  this.goForwardUntil = function(eventToReach, accumulator, enumerator, onComplete){
    var me = this;
    enumerator.next(this.opts.chunkSize).then(function(result) {
      if(result.events.length == 0){
        return onComplete(null, accumulator);
      }
      var complete = false;
      var events = result.events;
      for(var i in events){
        var currEvent = events[i];
        accumulator.push(currEvent);
        if(currEvent.eventNumber == eventToReach){
          complete = true;
          break;
        }
      }
      if(!complete){
        me.goForwardUntil(eventToReach, accumulator, enumerator, onComplete);
      } else {
        onComplete(null, accumulator);
      }
    });
  }



  this.readFullApparelStream = function(streamName, onComplete){
    var enumerator = this.es.eventEnumerator(streamName, 'forward');
    var accumulator = [];
    this.concatStream(accumulator, enumerator, function(error, events){
      onComplete(error, events);
    });
  }
  this.concatStream = function(accumulator, enumerator, onComplete){
    var me = this;
    enumerator.next(this.opts.chunkSize).then(function(result) {
      if(result.events.length == 0){
        return onComplete(null, accumulator);
      }
      var events = result.events;
      for(var i in events){
        var currEvent = events[i];
        accumulator.push(currEvent);
      }
      if(!result.isEndOfStream){
        me.concatStream(accumulator, enumerator, onComplete);
      } else {
        onComplete(null, accumulator);
      }
    });
  }



  this.getStreamRange = function(streamName, fromEvent, toEvent, onComplete){
    if(fromEvent == 'start' || fromEvent == 0){
      if(toEvent == 'end'){
        this.readFullApparelStream(streamName, function(error, events){
          onComplete(error, events);
        });
      } else {
        this.readApparelStreamFromStartTo(toEvent, streamName, function(error, events){
          onComplete(error, events);
        });
      }
      
    } else {
      if(toEvent == 'end'){
        this.readApparelStreamFromEndTo(fromEvent, streamName, function(error, events){
          onComplete(error, events);
        });
      } else {
        onComplete('no such range option at the moment');
      }
    }
  }

}

module.exports = EventStoreRange;