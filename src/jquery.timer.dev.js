/**
 * @package jQuery Timer 
 * @desc this plugin for jQuery of Timer as based from jQuery ui plugin frame 
 * @date 2013-5-10
 * @version 1.0.1
 * @author viticm
 */
( function( $, undefined )
{
    $.timer = $.timer || {};
    $.timer.console = $.timer.console || {}; // debug 
    if( 'undefined' == typeof console ) // if not found client object then use default output function	
    {
        $.extend( $.timer.console,
        {
            error: function( cErrorStr )
            {
                alert( '[ERROR] '+cErrorStr );
                return;
            },
            warn: function( cWarningStr )
            {
                alert( '[WARNING] '+cWarningStr );
            },
            log: function( cLogStr )
            {
                alert( '[LOG] '+cLogStr );
            }
        });
    }
    else
    {
    	$.timer.console = console; // notice: this( console ) object can't extend
    }
    $.extend( $.timer,
    {
        version: '1.0.1',
        options:
        {
    	    iTimerDelay: 1000,
    	    iRepeatCount: 10,
    	    iCurrentCount: 0,
    	    bRunning: false,
    	    cRepeatType: null == this.iRePeatCount || 1 > this.iRepeatCount ? 'interval' : 'timeout',
    	    bCompleted: false,
    	    timerEventRun: { bBubbles: false, bCancleable: false },
    	    timerEventComplete: { bBubbles: false, bCancleable: false },
    	    funcListener: null,
    	    bDebug: false,
    	    name: '',
    	    OBJ_StartDate: null,
    	    userData: {},
        },
        iTimerId: 0,
        OBJ_TimerEventRun: null,
        OBJ_TimerEventComplete: null,
        handler: {},
    });
    $.extend( $.timer,
    {
        init: function( options )
        {
            $.extend( this.options, this.options, options || {} );
            this.OBJ_TimerEventRun = this.timerEvent.init( this.timerEventRun );
            this.OBJ_TimerEventComplete = this.timerEvent.init( this.timerEventComplete );
            var Arr_ListenerMap = []; //hanler listener map
            Arr_ListenerMap[ this.timerEvent.TIMER ] = [];
            Arr_ListenerMap[ this.timerEvent.TIMER_COMPLETE ] = [];
            this.handler = Arr_ListenerMap;
            return $.extend( true, {}, this );
        },
        
    });
    
    $.extend( $.timer, 
    {
        timerEvent:
        {
            cType: 'timer',
            bBubbles: false,
            bCancleable: false,
            init: function( timerEventSet )
            {
            	var timerEventSet = 'undefined' === typeof timerEventSet ? {} : timerEventSet;
                this.cType = undefined === timerEventSet.cType ? this.cType : timerEventSet.cType;
                this.bBubbles = timerEventSet || undefined === timerEventSet.bBubbles ? this.bBubbles : timerEventSet.bBubbles;
                this.bCancleable = undefined === timerEventSet.bCancleable ? this.bCancleable : timerEventSet.bCancleable;
                return this;
            },
            TIMER: 'timer',
            TIMER_COMPLETE: 'timerComplete',
            toString: function()
            {
                return '[timerEvent type='+this.cType
                    +' bubbles='+this.bBubbles
                    +' cancleable='+this.bCancleable
                    +']';
            }
        }
    });
     
    // listeners
    $.extend( $.timer,
    {
        addEventListener: function( cType, funcListener, bUseCapture )
        {
            if( this.timerEvent.TIMER == cType || this.timerEvent.TIMER_COMPLETE == cType )
            {
                if( !funcListener && true === this.options.bDebug ) 
                    $.timer.console.warn( 'not found listener function! timer name: ' + this.options.name );
                if( true === bUseCapture )
                {
                    this.handler[ cType ].splice( 0, 0, [ funcListener ] );
                }
                else
                {
                    this.handler[ cType ].push( funcListener );
                }
            }
        },
        removeEventListener: function( cType, funcListener )
        {
            if( this.timerEvent.TIMER === cType || this.timerEvent.TIMER_COMPLETE === cType )
            {
                if( !funcListener )
                {
                    this.handler[ cType ] = [];
                }
                else
                {
                    var Arr_TypeListener = this.handler[ cType ];
                    for( var index = 0; index < Arr_TypeListener; index++ )
                    {
                        if( funcListener === Arr_TypeListener[ index ] )
                        {
                            Arr_TypeListener.splice( index, 1 );
                            break;
                        }
                    }
                }
            }
        },
        // delay function for time out
        delayExecute: function( Arr_Listener )
        {
        	var OBJ_TimerThis = this;
            this.dispatchListener( Arr_Listener, this.OBJ_TimerEventRun );
            this.options.iCurrentCount++;
            if( this.options.iCurrentCount < this.options.iRepeatCount )
            {
                if( true === this.options.bRunning )
                {
                    this.iTimerId = setTimeout( function()
                    {
                    	OBJ_TimerThis.delayExecute( Arr_Listener );
                    }, this.options.iTimerDelay );
                }
            }
            else
            {
                this.options.bRunning = false;
            }
            if( false === this.options.bRunning )
            {
                if( false === this.options.bCompleted )
                {
                    this.dispatchListener( this.handler[ this.timerEvent.TIMER_COMPLETE ], 
                        this.OBJ_TimerEventComplete );
                    this.options.bCompleted = true;
                }
            }
        },
        // normal do listener function
        dispatchListener: function( Arr_Listener, OBJ_TimerEvent )
        {
            for( var prop in Arr_Listener )
            {
                Arr_Listener[ prop ]( OBJ_TimerEvent );
            }
        }
    });
    
    // actions
    $.extend( $.timer,
    {
        start: function()
        {
        	var OBJ_TimerThis = this;
            if( true === this.options.bRunning || true === this.options.bCompleted )
                return;
            if( 0 === this.handler[ this.timerEvent.TIMER ].length 
                && 0 === this.handler[ this.timerEvent.TIMER_COMPLETE ].length )
            {
                this.console.warn( 'not found listener function! timer name: ' + this.options.name );
                return;
            }
            this.options.bRunning = true;
            this.options.OBJ_StartDate = new Date();
            if( 'timeout' == this.options.cRepeatType )
            {
                this.iTimerId = setTimeout( function()
                {
                	OBJ_TimerThis.delayExecute( OBJ_TimerThis.handler[ OBJ_TimerThis.timerEvent.TIMER ], 
                    		OBJ_TimerThis.OBJ_TimerEventRun );
                    
                }, this.options.iTimerDelay );
            }
            else
            {
                this.iTimerId = setInterval( function()
                {
                	OBJ_TimerThis.dispatchListener( OBJ_TimerThis.handler[ OBJ_TimerThis.timerEvent.TIMER ], 
                			OBJ_TimerThis.OBJ_TimerEventRun );
                }, this.options.iTimerDelay );
            }
            
        },
        stop: function()
        {
            if( null === this.iTimerId ) return;
            if( 'timeout' == this.options.cRepeatType )
            {
                clearTimeout( this.iTimerId );
                this.options.bRunning = false;
            }
            else
            {
                clearInterval( this.iTimerId );
            }
            if( false === this.options.bCompleted )
            {
                this.dispatchListener( this.handler[ this.timerEvent.TIMER_COMPLETE ],
                    this.OBJ_TimerEventComplete );
            }
            this.options.bCompleted = true;
        },
        reset: function()
        {
            this.options.iCurrentCount = 0;
            this.options.bRunning = true;
            this.options.bCompleted = false;
            this.options.OBJ_StartTime = new Date();
        }
    });
    
    // extend functions
    $.extend( $.timer,
    {
        getRunTime: function()
        {
            var OBJ_NowDate = new Date();
            if( !this.options.OBJ_StartDate ) return false;
            return OBJ_NowDate.getTime() - this.options.OBJ_StartDate.getTime();
        }
    });
})( jQuery );