
# jquery.timer

jQuery is a simple timer plugin of jQuery.

It is about **3.75kb** minified, depend by jQuery, and has been tested in the following browsers:

- Internet Explorer 6+
- Safari
- Firefox
- Chrome


## Getting started

1.  Include jQuery and jQuery timer on your page before the closing ``</body>`` tag

    ```html
    <script src="/path/to/jquery.min.js"></script>
    <script src="/path/to/jquery.timer.min.js"></script>
    ```

2.  About jQuery timer functions

    ```html
    <script>
    $(document).ready( function(){
        // create new timer
        var OBJ_Timer = $.timer.init
	    ({
	        iTimerDelay: 1000, // timer delay time, it's same as javacript
            iRepeatCount: 10, // repeat count, when the timer type is only valid timeout
            cRepeatType: 'interval', // timer type: timeout|interval
            bDebug: false, // if open debug mode
            name: '', // timer name
            userData: {}, // user data	
	    });

        // add listener function
        OBJ_Timer.addEventListener( cType, funcListener, bUseCapture ); 
	    /**
            cType: listener type: timer( run ) or timerComplete( stop )
	        funcListener: listener function
	        bUseCapture: if insert listener function in listener map begin
	    **/
        
	    // remove listener function
        OBJ_Timer.removeEventListener( cType, funcListener ); 
	    /**
            cType: listener type: timer( run ) or timerComplete( stop )
	        funcListener: listener function
	    **/

        // timer start
        OBJ_Timer.start();

        // timer stop
        OBJ_Timer.stop();

        // timer reset
        OBJ_Timer.reset();

	   // get timer run time(ms)
	   var iRunTimer = OBJ_Timer.getRunTime();
    });
    </script>
    ```

3.  Example
    ```html
    <script src="/path/to/jquery.min.js"></script>
    <script src="/path/to/jquery.timer.min.js"></script>
    <script>
    $(document).ready( function(){
        // create new timer
        var OBJ_Timer = $.timer.init
	    ({
	        iTimerDelay: 1000, 
            iRepeatCount: 10, 
            cRepeatType: 'timeout', 
            name: 'my timer',
	    });
	
	    // run listener function
	    var funcRunListener = function()
	    {
	        alert( 'running...' );
	    };

        // complete function
	    var funcCompleteListener = function()
	    {
	        alert( '[' +OBJ_Timer.options.name+ '] is end!' );
	    };
        OBJ_Timer.addEventListener( 'timer', funcRunListener );
        OBJ_Timer.addEventListener( 'timerComplete', funcCompleteListener );
        OBJ_Timer.start();
    });
    </script>
    ```
    This timer will do run listener function on each delay time, and on at the repeat count stop and do complete function.

## Why use jQuery timer?

Easy and fast?

- The plug-in allows timer classified management, and the flexibility to use under different circumstances timeout or interval type.
- The parameter options more flexible extensions can even use them to add userData listener method requires the use of variable method, no longer worried about leaving the global variable code confusion.

## Tests

See <a href="http://www.cnblogs.com/lianyue/archive/2013/05/28/3105015.html" target="_blank">my blog</a>.

## Documentation

See <a href="http://www.cnblogs.com/lianyue/archive/2013/05/28/3105015.html" target="_blank">my blog</a>.
