// https://developer.mozilla.org/en-US/docs/Web/Events/resize#Example
// Since resize events can fire at a high rate, the event handler shouldn't execute computationally expensive operations such as DOM modifications. Instead, it is recommended to throttle the event using requestAnimationFrame, setTimeout or customEvent, as follows:
;( function() {
var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
};

/* init - you can init any event */
throttle("resize", "optimizedResize");
} )();