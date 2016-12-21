define(
  'ephox.dragster.detect.InDrag',

  [
    'ephox.perhaps.Option',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events'
  ],

  function (Option, Event, Events) {
    return function () {

      var previous = Option.none();

      var reset = function () {
        previous = Option.none();
      };

      // Return position delta between previous position and nu position, 
      // or None if this is the first. Set the previous position to nu.
      var update = function (mode, nu) {
        var result = previous.map(function (old) {
          return mode.compare(old, nu);
        });

        previous = Option.some(nu);
        return result;
      };

      var onEvent = function (event, mode) {
        var dataOption = mode.extract(event);

        // Dragster move events require a position delta. The moveevent is only triggered
        // on the second and subsequent dragster move events. The first is dropped.
        dataOption.each(function (data) {
          var offset = update(mode, data);
          offset.each(function (d) {
            events.trigger.move(d);
          });
        });
      };

      var events = Events.create({
        move: Event([ 'info' ])
      });

      return {
        onEvent: onEvent,
        reset: reset,
        events: events.registry
      };
    };

  }
);
