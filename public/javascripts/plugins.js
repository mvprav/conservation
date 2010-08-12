/* PLUGINS INCLUDED:
 *
 * hoverIntent r5
 * Cycle 2.75
 * jQuery validation 1.6
 * Superfish v1.4.8
 * CurvyCorners 2.0.4
 * Cufon
 * Cufon register font (Aller)
 *
 */
 
 
 // JavaScript Document

/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
})(jQuery);
 
 
 
/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2009 M. Alsup
 * Version: 2.73 (04-NOV-2009)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 *
 * Originally based on the work of:
 *	1) Matt Oakes
 *	2) Torsten Baldes (http://medienfreunde.com/lab/innerfade/)
 *	3) Benjamin Sterling (http://www.benjaminsterling.com/experiments/jqShuffle/)
 */
;(function($) {

var ver = '2.73';

// if $.support is not defined (pre jQuery 1.3) add what I need
if ($.support == undefined) {
	$.support = {
		opacity: !($.browser.msie)
	};
}

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && window.console.log)
		window.console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
	//$('body').append('<div>'+Array.prototype.join.call(arguments,' ')+'</div>');
};

// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'stop', 'pause', 'resume', or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in conjunction with a options == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();
		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(opts2.currSlide, opts2.nextSlide, opts2, !opts2.rev);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts2.rev)}, startTime);
		}
	});
};

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop == undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'stop':
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			$(cont).removeData('cycle.opts');
			return false;
		case 'pause':
			cont.cyclePause = 1;
			return false;
		case 'resume':
			cont.cyclePause = 0;
			if (arg2 === true) { // resume now!
				options = $(cont).data('cycle.opts');
				if (!options) {
					log('options not found, can not resume');
					return false;
				}
				if (cont.cycleTimeout) {
					clearTimeout(cont.cycleTimeout);
					cont.cycleTimeout = 0;
				}
				go(options.elements, options, 1, 1);
			}
			return false;
		case 'prev':
		case 'next':
			var opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		};
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
};

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
};

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];
	opts.after.unshift(function(){ opts.busy=0; });

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.rev); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide)
		opts.startingSlide = parseInt(opts.startingSlide);

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		opts.randomIndex = 0;
		opts.startingSlide = opts.randomMap[0];
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z)
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit && opts.width)
		$slides.width(opts.width);
	if (opts.fit && opts.height && opts.height != 'auto')
		$slides.height(opts.height);

	// stretch container
	var reshape = opts.containerResize && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth;
			if (!h) h = e.offsetHeight;
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
	}

	if (opts.pause)
		$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
		this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();

		if ( $el.is('img') ) {
			// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
			// an image is being downloaded and the markup did not include sizing info (height/width attributes);
			// there seems to be some "default" sizes used in this situation
			var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
			var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
			var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
			var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loadingIE || loadingFF || loadingOp || loadingOther) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options)}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	if (opts.cssFirst)
		$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		while((opts.timeout - opts.speed) < 250) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		opts.nextSlide = opts.currSlide;
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (opts.before.length)
		opts.before[0].apply(e0, [e0, e0, opts, true]);
	if (opts.after.length > 1)
		opts.after[1].apply(e0, [e0, e0, opts, true]);

	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?-1:1)});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?1:-1)});
	if (opts.pager)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
};

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
};

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (p in txs) {
			tx = txs[p];
			if (txs.hasOwnProperty(p) && $.isFunction(tx))
				opts.fxs.push(p);
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
};

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$slides.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		$(els).stop(true,true);
		opts.busy = false;
	}
	// don't begin another timeout-based transition if there is one active
	if (opts.busy)
		return;

	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	if (manual || !p.cyclePause) {
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length)
				opts.lastFx = 0;
			fx = opts.fxs[opts.lastFx];
			opts.currFx = fx;
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
		};

		if (opts.nextSlide != opts.currSlide) {
			// get ready to perform the transition
			opts.busy = 1;
			if (opts.fxFn) // fx function provided?
				opts.fxFn(curr, next, opts, after, fwd);
			else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
				$.fn.cycle[opts.fx](curr, next, opts, after);
			else
				$.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
		}

		// calculate the next slide
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else { // sequence
			var roll = (opts.nextSlide + 1) == els.length;
			opts.nextSlide = roll ? 0 : opts.nextSlide+1;
			opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
		}

		if (opts.pager)
			$.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
	}

	// stage the next transtion
	var ms = 0;
	if (opts.timeout && !opts.continuous)
		ms = getTimeout(curr, next, opts, fwd);
	else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
		ms = 10;
	if (ms > 0)
		p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.rev) }, ms);
};

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
	$(pager).each(function() {
		$(this).find('a').removeClass('activeSlide').filter('a:eq('+currSlide+')').addClass('activeSlide');
	});
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn(curr,next,opts,fwd);
		while ((t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
};

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts, opts.rev?-1:1); };
$.fn.cycle.prev = function(opts) { advance(opts, opts.rev?1:-1);};

// advance slide forward or back
function advance(opts, val) {
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	if ($.isFunction(opts.prevNextClick))
		opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, val>=0);
	return false;
};

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
   $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
};

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder))
		a = opts.pagerAnchorBuilder(i,el);
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone[0]);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	$a.bind(opts.pagerEvent, function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		if ($.isFunction(opts.pagerClick))
			opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
		return false;
	});
	
	if (opts.pagerEvent != 'click')
		$a.click(function(){return false;}); // supress click
	
	if (opts.pauseOnPagerHover)
		$a.hover(function() { opts.$cont[0].cyclePause++; }, function() { opts.$cont[0].cyclePause--; } );
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	function hex(s) {
		s = parseInt(s).toString(16);
		return s.length < 2 ? '0'+s : s;
	};
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	};
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
};

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {$n.animate(opts.animIn, speedIn, easeIn, cb)};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		if (opts.cssAfter) $l.css(opts.cssAfter);
		if (!opts.sync) fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
	fx:			  'fade', // name of transition effect (or comma separated names, ex: fade,scrollUp,shuffle)
	timeout:	   4000,  // milliseconds between slide transitions (0 to disable auto advance)
	timeoutFn:	 null,  // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
	continuous:	   0,	  // true to start next transition immediately after current one completes
	speed:		   1000,  // speed of the transition (any valid fx speed value)
	speedIn:	   null,  // speed of the 'in' transition
	speedOut:	   null,  // speed of the 'out' transition
	next:		   null,  // selector for element to use as click trigger for next slide
	prev:		   null,  // selector for element to use as click trigger for previous slide
	prevNextClick: null,  // callback fn for prev/next clicks:	function(isNext, zeroBasedSlideIndex, slideElement)
	prevNextEvent:'click',// event which drives the manual transition to the previous or next slide
	pager:		   null,  // selector for element to use as pager container
	pagerClick:	   null,  // callback fn for pager clicks:	function(zeroBasedSlideIndex, slideElement)
	pagerEvent:	  'click', // name of event which drives the pager navigation
	pagerAnchorBuilder: null, // callback fn for building anchor links:  function(index, DOMelement)
	before:		   null,  // transition callback (scope set to element to be shown):	 function(currSlideElement, nextSlideElement, options, forwardFlag)
	after:		   null,  // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
	end:		   null,  // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
	easing:		   null,  // easing method for both in and out transitions
	easeIn:		   null,  // easing for "in" transition
	easeOut:	   null,  // easing for "out" transition
	shuffle:	   null,  // coords for shuffle animation, ex: { top:15, left: 200 }
	animIn:		   null,  // properties that define how the slide animates in
	animOut:	   null,  // properties that define how the slide animates out
	cssBefore:	   null,  // properties that define the initial state of the slide before transitioning in
	cssAfter:	   null,  // properties that defined the state of the slide after transitioning out
	fxFn:		   null,  // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
	height:		  'auto', // container height
	startingSlide: 0,	  // zero-based index of the first slide to be displayed
	sync:		   1,	  // true if in/out transitions should occur simultaneously
	random:		   0,	  // true for random, false for sequence (not applicable to shuffle fx)
	fit:		   0,	  // force slides to fit container
	containerResize: 1,	  // resize container to fit largest slide
	pause:		   0,	  // true to enable "pause on hover"
	pauseOnPagerHover: 0, // true to pause when hovering over pager link
	autostop:	   0,	  // true to end slideshow after X transitions (where X == slide count)
	autostopCount: 0,	  // number of transitions (optionally used with autostop to define X)
	delay:		   0,	  // additional delay (in ms) for first transition (hint: can be negative)
	slideExpr:	   null,  // expression for selecting slides (if something other than all children is required)
	cleartype:	   !$.support.opacity,  // true if clearType corrections should be applied (for IE)
	cleartypeNoBg: false, // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
	nowrap:		   0,	  // true to prevent slideshow from wrapping
	fastOnEvent:   0,	  // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
	randomizeEffects: 1,  // valid when multiple effects are used; true to make the effect sequence random
	rev:		   0,	 // causes animations to transition in reverse
	manualTrump:   true,  // causes manual transition to stop an active transition instead of being ignored
	requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
	requeueTimeout: 250   // ms delay for requeue
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2008 M. Alsup
 * Version:	 2.72
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {

//
// These functions define one-time slide initialization for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
}

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore ={ top: h, left: 0 };
	opts.cssFirst = { top: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: -h };
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { top: -h, left: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: h };
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: 0-w };
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: -w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: w };
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { top: 0 };
	opts.animIn   = { left: 0 };
	opts.animOut  = { top: 0 };
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { left: 0 };
	opts.animIn   = { top: 0 };
	opts.animOut  = { left: 0 };
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { left: 0, top: 0, width: 0 };
	opts.animIn	 = { width: 'show' };
	opts.animOut = { width: 0 };
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animIn	 = { height: 'show' };
	opts.animOut = { height: 0 };
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++)
				fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, height: 0 };
	opts.animIn	   = { top: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { top: 0, width: 0  };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	opts.cssBefore = { top: 0, left: 0, width: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn	   = { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
		opts.animOut   = { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 };
	});
	opts.cssFirst = { top:0, left: 0 };
	opts.cssBefore = { width: 0, height: 0 };
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn	= { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
	});
	opts.cssBefore = { width: 0, height: 0 };
	opts.animOut  = { opacity: 0 };
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore = { left: w, top: 0 };
	opts.animIn = { left: 0 };
	opts.animOut  = { left: w };
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: 0 };
	opts.animIn = { top: 0 };
	opts.animOut  = { top: h };
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: w };
	opts.animIn = { top: 0, left: 0 };
	opts.animOut  = { top: h, left: w };
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: 0 };
	});
	opts.cssBefore = { width: 0, top: 0 };
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn = { top: 0, height: this.cycleH };
		opts.animOut = { top: 0 };
	});
	opts.cssBefore = { height: 0, left: 0 };
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: curr.cycleW/2, width: 0 };
	});
	opts.cssBefore = { top: 0, width: 0 };
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn = { top: 0, height: next.cycleH };
		opts.animOut = { top: curr.cycleH/2, height: 0 };
	});
	opts.cssBefore = { left: 0, height: 0 };
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn = { left: 0, top: 0};
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn = { left: 0, top: 0 };
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			opts.animOut = { left: w*2, top: -h/2, opacity: 0 };
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore = { left: 0, top: 0 };
	opts.animIn = { left: 0 };
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2);
			var left = parseInt(w/2);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0]), r = parseInt(d[1]), b = parseInt(d[2]), l = parseInt(d[3]);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13)) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count)) : 0;
			var ll = l ? l - parseInt(step * (l/count)) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1)) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1)) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);

/*
 * jQuery validation plug-in 1.6
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 J?rn Zaefferer
 *
 * $Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(7($){$.H($.2O,{1d:7(d){l(!6.F){d&&d.24&&2Y.1H&&1H.52("3v 3o, 4N\'t 1d, 67 3v");8}p c=$.17(6[0],\'v\');l(c){8 c}c=2e $.v(d,6[0]);$.17(6[0],\'v\',c);l(c.q.3u){6.3r("1B, 3j").1n(".4G").3b(7(){c.3a=w});l(c.q.35){6.3r("1B, 3j").1n(":23").3b(7(){c.1V=6})}6.23(7(b){l(c.q.24)b.5N();7 2m(){l(c.q.35){l(c.1V){p a=$("<1B 1A=\'5v\'/>").1p("u",c.1V.u).2M(c.1V.Z).51(c.U)}c.q.35.11(c,c.U);l(c.1V){a.3A()}8 I}8 w}l(c.3a){c.3a=I;8 2m()}l(c.M()){l(c.1a){c.1l=w;8 I}8 2m()}16{c.2h();8 I}})}8 c},J:7(){l($(6[0]).2Z(\'M\')){8 6.1d().M()}16{p b=w;p a=$(6[0].M).1d();6.P(7(){b&=a.L(6)});8 b}},4F:7(c){p d={},$L=6;$.P(c.1O(/\\s/),7(a,b){d[b]=$L.1p(b);$L.6c(b)});8 d},1f:7(h,k){p f=6[0];l(h){p i=$.17(f.M,\'v\').q;p d=i.1f;p c=$.v.2D(f);22(h){1b"1e":$.H(c,$.v.1N(k));d[f.u]=c;l(k.G)i.G[f.u]=$.H(i.G[f.u],k.G);2K;1b"3A":l(!k){S d[f.u];8 c}p e={};$.P(k.1O(/\\s/),7(a,b){e[b]=c[b];S c[b]});8 e}}p g=$.v.42($.H({},$.v.3Y(f),$.v.3W(f),$.v.3U(f),$.v.2D(f)),f);l(g.14){p j=g.14;S g.14;g=$.H({14:j},g)}8 g}});$.H($.5s[":"],{5p:7(a){8!$.1q(""+a.Z)},5i:7(a){8!!$.1q(""+a.Z)},5f:7(a){8!a.4l}});$.v=7(b,a){6.q=$.H({},$.v.33,b);6.U=a;6.3I()};$.v.W=7(c,b){l(T.F==1)8 7(){p a=$.3D(T);a.4V(c);8 $.v.W.1Q(6,a)};l(T.F>2&&b.29!=3x){b=$.3D(T).4R(1)}l(b.29!=3x){b=[b]}$.P(b,7(i,n){c=c.1P(2e 3s("\\\\{"+i+"\\\\}","g"),n)});8 c};$.H($.v,{33:{G:{},2d:{},1f:{},19:"3p",26:"J",2C:"4Q",2h:w,3l:$([]),2A:$([]),3u:w,3i:[],3Q:I,4O:7(a){6.3e=a;l(6.q.4M&&!6.4J){6.q.1L&&6.q.1L.11(6,a,6.q.19,6.q.26);6.1K(a).2y()}},4E:7(a){l(!6.1D(a)&&(a.u V 6.1c||!6.K(a))){6.L(a)}},6b:7(a){l(a.u V 6.1c||a==6.4y){6.L(a)}},69:7(a){l(a.u V 6.1c)6.L(a);16 l(a.4v.u V 6.1c)6.L(a.4v)},38:7(a,c,b){$(a).1Y(c).2w(b)},1L:7(a,c,b){$(a).2w(c).1Y(b)}},65:7(a){$.H($.v.33,a)},G:{14:"61 4q 2Z 14.",1r:"N 2L 6 4q.",1I:"N O a J 1I 60.",1v:"N O a J 5X.",1u:"N O a J 1u.",2q:"N O a J 1u (5R).",1s:"N O a J 1s.",1U:"N O 5P 1U.",2c:"N O a J 5O 5M 1s.",2n:"N O 47 5I Z 5H.",44:"N O a Z 5C a J 5B.",18:$.v.W("N O 3X 5y 2X {0} 2W."),1z:$.v.W("N O 5x 5w {0} 2W."),2j:$.v.W("N O a Z 3V {0} 45 {1} 2W 5q."),2i:$.v.W("N O a Z 3V {0} 45 {1}."),1x:$.v.W("N O a Z 5k 2X 3L 3K 48 {0}."),1F:$.v.W("N O a Z 5d 2X 3L 3K 48 {0}.")},3J:I,5b:{3I:7(){6.2r=$(6.q.2A);6.4i=6.2r.F&&6.2r||$(6.U);6.2s=$(6.q.3l).1e(6.q.2A);6.1c={};6.55={};6.1a=0;6.1i={};6.1g={};6.21();p f=(6.2d={});$.P(6.q.2d,7(d,c){$.P(c.1O(/\\s/),7(a,b){f[b]=d})});p e=6.q.1f;$.P(e,7(b,a){e[b]=$.v.1N(a)});7 1C(a){p b=$.17(6[0].M,"v");b.q["4A"+a.1A]&&b.q["4A"+a.1A].11(b,6[0])}$(6.U).1C("3F 3E 4W",":3C, :4U, :4T, 2b, 4S",1C).1C("3b",":3B, :3z, 2b, 3y",1C);l(6.q.3w)$(6.U).2J("1g-M.1d",6.q.3w)},M:7(){6.3t();$.H(6.1c,6.1w);6.1g=$.H({},6.1w);l(!6.J())$(6.U).2H("1g-M",[6]);6.1m();8 6.J()},3t:7(){6.2G();Q(p i=0,13=(6.27=6.13());13[i];i++){6.28(13[i])}8 6.J()},L:7(a){a=6.2F(a);6.4y=a;6.2E(a);6.27=$(a);p b=6.28(a);l(b){S 6.1g[a.u]}16{6.1g[a.u]=w}l(!6.3q()){6.12=6.12.1e(6.2s)}6.1m();8 b},1m:7(b){l(b){$.H(6.1w,b);6.R=[];Q(p c V b){6.R.2a({1j:b[c],L:6.2f(c)[0]})}6.1k=$.3n(6.1k,7(a){8!(a.u V b)})}6.q.1m?6.q.1m.11(6,6.1w,6.R):6.3m()},2B:7(){l($.2O.2B)$(6.U).2B();6.1c={};6.2G();6.2T();6.13().2w(6.q.19)},3q:7(){8 6.2g(6.1g)},2g:7(a){p b=0;Q(p i V a)b++;8 b},2T:7(){6.2P(6.12).2y()},J:7(){8 6.3N()==0},3N:7(){8 6.R.F},2h:7(){l(6.q.2h){3O{$(6.3h()||6.R.F&&6.R[0].L||[]).1n(":4P").3g()}3f(e){}}},3h:7(){p a=6.3e;8 a&&$.3n(6.R,7(n){8 n.L.u==a.u}).F==1&&a},13:7(){p a=6,2U={};8 $([]).1e(6.U.13).1n(":1B").1R(":23, :21, :4L, [4K]").1R(6.q.3i).1n(7(){!6.u&&a.q.24&&2Y.1H&&1H.3p("%o 4I 3X u 4H",6);l(6.u V 2U||!a.2g($(6).1f()))8 I;2U[6.u]=w;8 w})},2F:7(a){8 $(a)[0]},2z:7(){8 $(6.q.2C+"."+6.q.19,6.4i)},21:7(){6.1k=[];6.R=[];6.1w={};6.1o=$([]);6.12=$([]);6.27=$([])},2G:7(){6.21();6.12=6.2z().1e(6.2s)},2E:7(a){6.21();6.12=6.1K(a)},28:7(d){d=6.2F(d);l(6.1D(d)){d=6.2f(d.u)[0]}p a=$(d).1f();p c=I;Q(Y V a){p b={Y:Y,2l:a[Y]};3O{p f=$.v.1T[Y].11(6,d.Z.1P(/\\r/g,""),d,b.2l);l(f=="1S-1Z"){c=w;4D}c=I;l(f=="1i"){6.12=6.12.1R(6.1K(d));8}l(!f){6.3c(d,b);8 I}}3f(e){6.q.24&&2Y.1H&&1H.4C("6g 6f 6e 6d L "+d.4z+", 28 47 \'"+b.Y+"\' Y",e);6a e;}}l(c)8;l(6.2g(a))6.1k.2a(d);8 w},4x:7(a,b){l(!$.1y)8;p c=6.q.39?$(a).1y()[6.q.39]:$(a).1y();8 c&&c.G&&c.G[b]},4w:7(a,b){p m=6.q.G[a];8 m&&(m.29==4u?m:m[b])},4t:7(){Q(p i=0;i<T.F;i++){l(T[i]!==20)8 T[i]}8 20},2x:7(a,b){8 6.4t(6.4w(a.u,b),6.4x(a,b),!6.q.3Q&&a.68||20,$.v.G[b],"<4s>66: 64 1j 63 Q "+a.u+"</4s>")},3c:7(b,a){p c=6.2x(b,a.Y),36=/\\$?\\{(\\d+)\\}/g;l(1h c=="7"){c=c.11(6,a.2l,b)}16 l(36.15(c)){c=2v.W(c.1P(36,\'{$1}\'),a.2l)}6.R.2a({1j:c,L:b});6.1w[b.u]=c;6.1c[b.u]=c},2P:7(a){l(6.q.2u)a=a.1e(a.4p(6.q.2u));8 a},3m:7(){Q(p i=0;6.R[i];i++){p a=6.R[i];6.q.38&&6.q.38.11(6,a.L,6.q.19,6.q.26);6.34(a.L,a.1j)}l(6.R.F){6.1o=6.1o.1e(6.2s)}l(6.q.1G){Q(p i=0;6.1k[i];i++){6.34(6.1k[i])}}l(6.q.1L){Q(p i=0,13=6.4o();13[i];i++){6.q.1L.11(6,13[i],6.q.19,6.q.26)}}6.12=6.12.1R(6.1o);6.2T();6.2P(6.1o).4n()},4o:7(){8 6.27.1R(6.4m())},4m:7(){8 $(6.R).3d(7(){8 6.L})},34:7(a,c){p b=6.1K(a);l(b.F){b.2w().1Y(6.q.19);b.1p("4k")&&b.4j(c)}16{b=$("<"+6.q.2C+"/>").1p({"Q":6.32(a),4k:w}).1Y(6.q.19).4j(c||"");l(6.q.2u){b=b.2y().4n().5Z("<"+6.q.2u+"/>").4p()}l(!6.2r.5Y(b).F)6.q.4h?6.q.4h(b,$(a)):b.5W(a)}l(!c&&6.q.1G){b.3C("");1h 6.q.1G=="1t"?b.1Y(6.q.1G):6.q.1G(b)}6.1o=6.1o.1e(b)},1K:7(a){p b=6.32(a);8 6.2z().1n(7(){8 $(6).1p(\'Q\')==b})},32:7(a){8 6.2d[a.u]||(6.1D(a)?a.u:a.4z||a.u)},1D:7(a){8/3B|3z/i.15(a.1A)},2f:7(d){p c=6.U;8 $(5V.5U(d)).3d(7(a,b){8 b.M==c&&b.u==d&&b||4g})},1M:7(a,b){22(b.4f.3k()){1b\'2b\':8 $("3y:3o",b).F;1b\'1B\':l(6.1D(b))8 6.2f(b.u).1n(\':4l\').F}8 a.F},4e:7(b,a){8 6.2I[1h b]?6.2I[1h b](b,a):w},2I:{"5Q":7(b,a){8 b},"1t":7(b,a){8!!$(b,a.M).F},"7":7(b,a){8 b(a)}},K:7(a){8!$.v.1T.14.11(6,$.1q(a.Z),a)&&"1S-1Z"},4d:7(a){l(!6.1i[a.u]){6.1a++;6.1i[a.u]=w}},4c:7(a,b){6.1a--;l(6.1a<0)6.1a=0;S 6.1i[a.u];l(b&&6.1a==0&&6.1l&&6.M()){$(6.U).23();6.1l=I}16 l(!b&&6.1a==0&&6.1l){$(6.U).2H("1g-M",[6]);6.1l=I}},2o:7(a){8 $.17(a,"2o")||$.17(a,"2o",{31:4g,J:w,1j:6.2x(a,"1r")})}},1J:{14:{14:w},1I:{1I:w},1v:{1v:w},1u:{1u:w},2q:{2q:w},4b:{4b:w},1s:{1s:w},4a:{4a:w},1U:{1U:w},2c:{2c:w}},49:7(a,b){a.29==4u?6.1J[a]=b:$.H(6.1J,a)},3W:7(b){p a={};p c=$(b).1p(\'5L\');c&&$.P(c.1O(\' \'),7(){l(6 V $.v.1J){$.H(a,$.v.1J[6])}});8 a},3U:7(c){p a={};p d=$(c);Q(Y V $.v.1T){p b=d.1p(Y);l(b){a[Y]=b}}l(a.18&&/-1|5K|5J/.15(a.18)){S a.18}8 a},3Y:7(a){l(!$.1y)8{};p b=$.17(a.M,\'v\').q.39;8 b?$(a).1y()[b]:$(a).1y()},2D:7(b){p a={};p c=$.17(b.M,\'v\');l(c.q.1f){a=$.v.1N(c.q.1f[b.u])||{}}8 a},42:7(d,e){$.P(d,7(c,b){l(b===I){S d[c];8}l(b.30||b.2t){p a=w;22(1h b.2t){1b"1t":a=!!$(b.2t,e.M).F;2K;1b"7":a=b.2t.11(e,e);2K}l(a){d[c]=b.30!==20?b.30:w}16{S d[c]}}});$.P(d,7(a,b){d[a]=$.46(b)?b(e):b});$.P([\'1z\',\'18\',\'1F\',\'1x\'],7(){l(d[6]){d[6]=2Q(d[6])}});$.P([\'2j\',\'2i\'],7(){l(d[6]){d[6]=[2Q(d[6][0]),2Q(d[6][1])]}});l($.v.3J){l(d.1F&&d.1x){d.2i=[d.1F,d.1x];S d.1F;S d.1x}l(d.1z&&d.18){d.2j=[d.1z,d.18];S d.1z;S d.18}}l(d.G){S d.G}8 d},1N:7(a){l(1h a=="1t"){p b={};$.P(a.1O(/\\s/),7(){b[6]=w});a=b}8 a},5G:7(c,a,b){$.v.1T[c]=a;$.v.G[c]=b!=20?b:$.v.G[c];l(a.F<3){$.v.49(c,$.v.1N(c))}},1T:{14:7(c,d,a){l(!6.4e(a,d))8"1S-1Z";22(d.4f.3k()){1b\'2b\':p b=$(d).2M();8 b&&b.F>0;1b\'1B\':l(6.1D(d))8 6.1M(c,d)>0;5F:8 $.1q(c).F>0}},1r:7(f,h,j){l(6.K(h))8"1S-1Z";p g=6.2o(h);l(!6.q.G[h.u])6.q.G[h.u]={};g.43=6.q.G[h.u].1r;6.q.G[h.u].1r=g.1j;j=1h j=="1t"&&{1v:j}||j;l(g.31!==f){g.31=f;p k=6;6.4d(h);p i={};i[h.u]=f;$.2R($.H(w,{1v:j,41:"2S",40:"1d"+h.u,5A:"5z",17:i,1G:7(d){k.q.G[h.u].1r=g.43;p b=d===w;l(b){p e=k.1l;k.2E(h);k.1l=e;k.1k.2a(h);k.1m()}16{p a={};p c=(g.1j=d||k.2x(h,"1r"));a[h.u]=$.46(c)?c(f):c;k.1m(a)}g.J=b;k.4c(h,b)}},j));8"1i"}16 l(6.1i[h.u]){8"1i"}8 g.J},1z:7(b,c,a){8 6.K(c)||6.1M($.1q(b),c)>=a},18:7(b,c,a){8 6.K(c)||6.1M($.1q(b),c)<=a},2j:7(b,d,a){p c=6.1M($.1q(b),d);8 6.K(d)||(c>=a[0]&&c<=a[1])},1F:7(b,c,a){8 6.K(c)||b>=a},1x:7(b,c,a){8 6.K(c)||b<=a},2i:7(b,c,a){8 6.K(c)||(b>=a[0]&&b<=a[1])},1I:7(a,b){8 6.K(b)||/^((([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^X`{\\|}~]|[\\y-\\x\\E-\\C\\A-\\B])+(\\.([a-z]|\\d|[!#\\$%&\'\\*\\+\\-\\/=\\?\\^X`{\\|}~]|[\\y-\\x\\E-\\C\\A-\\B])+)*)|((\\3T)((((\\2k|\\1X)*(\\2V\\3S))?(\\2k|\\1X)+)?(([\\3R-\\5u\\3P\\3M\\5t-\\5r\\3Z]|\\5D|[\\5E-\\5o]|[\\5n-\\5m]|[\\y-\\x\\E-\\C\\A-\\B])|(\\\\([\\3R-\\1X\\3P\\3M\\2V-\\3Z]|[\\y-\\x\\E-\\C\\A-\\B]))))*(((\\2k|\\1X)*(\\2V\\3S))?(\\2k|\\1X)+)?(\\3T)))@((([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])|(([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])*([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])))\\.)+(([a-z]|[\\y-\\x\\E-\\C\\A-\\B])|(([a-z]|[\\y-\\x\\E-\\C\\A-\\B])([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])*([a-z]|[\\y-\\x\\E-\\C\\A-\\B])))\\.?$/i.15(a)},1v:7(a,b){8 6.K(b)||/^(5l?|5j):\\/\\/(((([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])|(%[\\1W-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])|(([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])*([a-z]|\\d|[\\y-\\x\\E-\\C\\A-\\B])))\\.)+(([a-z]|[\\y-\\x\\E-\\C\\A-\\B])|(([a-z]|[\\y-\\x\\E-\\C\\A-\\B])([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])*([a-z]|[\\y-\\x\\E-\\C\\A-\\B])))\\.?)(:\\d*)?)(\\/((([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])|(%[\\1W-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])|(%[\\1W-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])|(%[\\1W-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|[\\5h-\\5g]|\\/|\\?)*)?(\\#((([a-z]|\\d|-|\\.|X|~|[\\y-\\x\\E-\\C\\A-\\B])|(%[\\1W-f]{2})|[!\\$&\'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?$/i.15(a)},1u:7(a,b){8 6.K(b)||!/5e|5S/.15(2e 5T(a))},2q:7(a,b){8 6.K(b)||/^\\d{4}[\\/-]\\d{1,2}[\\/-]\\d{1,2}$/.15(a)},1s:7(a,b){8 6.K(b)||/^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)(?:\\.\\d+)?$/.15(a)},1U:7(a,b){8 6.K(b)||/^\\d+$/.15(a)},2c:7(b,e){l(6.K(e))8"1S-1Z";l(/[^0-9-]+/.15(b))8 I;p a=0,d=0,2p=I;b=b.1P(/\\D/g,"");Q(p n=b.F-1;n>=0;n--){p c=b.5c(n);p d=5a(c,10);l(2p){l((d*=2)>9)d-=9}a+=d;2p=!2p}8(a%10)==0},44:7(b,c,a){a=1h a=="1t"?a.1P(/,/g,\'|\'):"59|58?g|57";8 6.K(c)||b.62(2e 3s(".("+a+")$","i"))},2n:7(c,d,a){p b=$(a).56(".1d-2n").2J("4B.1d-2n",7(){$(d).J()});8 c==b.2M()}}});$.W=$.v.W})(2v);(7($){p c=$.2R;p d={};$.2R=7(a){a=$.H(a,$.H({},$.54,a));p b=a.40;l(a.41=="2S"){l(d[b]){d[b].2S()}8(d[b]=c.1Q(6,T))}8 c.1Q(6,T)}})(2v);(7($){$.P({3g:\'3F\',4B:\'3E\'},7(b,a){$.1E.37[a]={53:7(){l($.3H.4r)8 I;6.50(b,$.1E.37[a].2N,w)},4Z:7(){l($.3H.4r)8 I;6.4Y(b,$.1E.37[a].2N,w)},2N:7(e){T[0]=$.1E.2L(e);T[0].1A=a;8 $.1E.2m.1Q(6,T)}}});$.H($.2O,{1C:7(d,e,c){8 6.2J(d,7(a){p b=$(a.3G);l(b.2Z(e)){8 c.1Q(b,T)}})},4X:7(a,b){8 6.2H(a,[$.1E.2L({1A:a,3G:b})])}})})(2v);',62,389,'||||||this|function|return|||||||||||||if||||var|settings||||name|validator|true|uD7FF|u00A0||uFDF0|uFFEF|uFDCF||uF900|length|messages|extend|false|valid|optional|element|form|Please|enter|each|for|errorList|delete|arguments|currentForm|in|format|_|method|value||call|toHide|elements|required|test|else|data|maxlength|errorClass|pendingRequest|case|submitted|validate|add|rules|invalid|typeof|pending|message|successList|formSubmitted|showErrors|filter|toShow|attr|trim|remote|number|string|date|url|errorMap|max|metadata|minlength|type|input|delegate|checkable|event|min|success|console|email|classRuleSettings|errorsFor|unhighlight|getLength|normalizeRule|split|replace|apply|not|dependency|methods|digits|submitButton|da|x09|addClass|mismatch|undefined|reset|switch|submit|debug||validClass|currentElements|check|constructor|push|select|creditcard|groups|new|findByName|objectLength|focusInvalid|range|rangelength|x20|parameters|handle|equalTo|previousValue|bEven|dateISO|labelContainer|containers|depends|wrapper|jQuery|removeClass|defaultMessage|hide|errors|errorLabelContainer|resetForm|errorElement|staticRules|prepareElement|clean|prepareForm|triggerHandler|dependTypes|bind|break|fix|val|handler|fn|addWrapper|Number|ajax|abort|hideErrors|rulesCache|x0d|characters|than|window|is|param|old|idOrName|defaults|showLabel|submitHandler|theregex|special|highlight|meta|cancelSubmit|click|formatAndAdd|map|lastActive|catch|focus|findLastActive|ignore|button|toLowerCase|errorContainer|defaultShowErrors|grep|selected|error|numberOfInvalids|find|RegExp|checkForm|onsubmit|nothing|invalidHandler|Array|option|checkbox|remove|radio|text|makeArray|focusout|focusin|target|browser|init|autoCreateRanges|equal|or|x0c|size|try|x0b|ignoreTitle|x01|x0a|x22|attributeRules|between|classRules|no|metadataRules|x7f|port|mode|normalizeRules|originalMessage|accept|and|isFunction|the|to|addClassRules|numberDE|dateDE|stopRequest|startRequest|depend|nodeName|null|errorPlacement|errorContext|html|generated|checked|invalidElements|show|validElements|parent|field|msie|strong|findDefined|String|parentNode|customMessage|customMetaMessage|lastElement|id|on|blur|log|continue|onfocusout|removeAttrs|cancel|assigned|has|blockFocusCleanup|disabled|image|focusCleanup|can|onfocusin|visible|label|slice|textarea|file|password|unshift|keyup|triggerEvent|removeEventListener|teardown|addEventListener|appendTo|warn|setup|ajaxSettings|valueCache|unbind|gif|jpe|png|parseInt|prototype|charAt|greater|Invalid|unchecked|uF8FF|uE000|filled|ftp|less|https|x7e|x5d|x5b|blank|long|x1f|expr|x0e|x08|hidden|least|at|more|json|dataType|extension|with|x21|x23|default|addMethod|again|same|524288|2147483647|class|card|preventDefault|credit|only|boolean|ISO|NaN|Date|getElementsByName|document|insertAfter|URL|append|wrap|address|This|match|defined|No|setDefaults|Warning|returning|title|onclick|throw|onkeyup|removeAttr|checking|when|occured|exception'.split('|'),0,{}))


// JavaScript Document

/*
 * Superfish v1.4.8 - jQuery menu widget
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 * CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

;(function($){
	$.fn.superfish = function(op){

		var sf = $.fn.superfish,
			c = sf.c,
			$arrow = $(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),
			over = function(){
				var $$ = $(this), menu = getMenu($$);
				clearTimeout(menu.sfTimer);
				$$.showSuperfishUl().siblings().hideSuperfishUl();
			},
			out = function(){
				var $$ = $(this), menu = getMenu($$), o = sf.op;
				clearTimeout(menu.sfTimer);
				menu.sfTimer=setTimeout(function(){
					o.retainPath=($.inArray($$[0],o.$path)>-1);
					$$.hideSuperfishUl();
					if (o.$path.length && $$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path);}
				},o.delay);	
			},
			getMenu = function($menu){
				var menu = $menu.parents(['ul.',c.menuClass,':first'].join(''))[0];
				sf.op = sf.o[menu.serial];
				return menu;
			},
			addArrow = function($a){ $a.addClass(c.anchorClass).append($arrow.clone()); };
			
		return this.each(function() {
			var s = this.serial = sf.o.length;
			var o = $.extend({},sf.defaults,op);
			o.$path = $('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){
				$(this).addClass([o.hoverClass,c.bcClass].join(' '))
					.filter('li:has(ul)').removeClass(o.pathClass);
			});
			sf.o[s] = sf.op = o;
			
			$('li:has(ul)',this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over,out).each(function() {
				if (o.autoArrows) addArrow( $('>a:first-child',this) );
			})
			.not('.'+c.bcClass)
				.hideSuperfishUl();
			
			var $a = $('a',this);
			$a.each(function(i){
				var $li = $a.eq(i).parents('li');
				$a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});
			});
			o.onInit.call(this);
			
		}).each(function() {
			var menuClasses = [c.menuClass];
			if (sf.op.dropShadows  && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
			$(this).addClass(menuClasses.join(' '));
		});
	};

	var sf = $.fn.superfish;
	sf.o = [];
	sf.op = {};
	sf.IE7fix = function(){
		var o = sf.op;
		if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity!=undefined)
			this.toggleClass(sf.c.shadowClass+'-off');
		};
	sf.c = {
		bcClass     : 'sf-breadcrumb',
		menuClass   : 'sf-js-enabled',
		anchorClass : 'sf-with-ul',
		arrowClass  : 'sf-sub-indicator',
		shadowClass : 'sf-shadow'
	};
	sf.defaults = {
		hoverClass	: 'sfHover',
		pathClass	: 'overideThisToUse',
		pathLevels	: 1,
		delay		: 800,
		animation	: {opacity:'show'},
		speed		: 'normal',
		autoArrows	: true,
		dropShadows : true,
		disableHI	: false,		// true disables hoverIntent detection
		onInit		: function(){}, // callback functions
		onBeforeShow: function(){},
		onShow		: function(){},
		onHide		: function(){}
	};
	$.fn.extend({
		hideSuperfishUl : function(){
			var o = sf.op,
				not = (o.retainPath===true) ? o.$path : '';
			o.retainPath = false;
			var $ul = $(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass)
					.find('>ul').hide().css('visibility','hidden');
			o.onHide.call($ul);
			return this;
		},
		showSuperfishUl : function(){
			var o = sf.op,
				sh = sf.c.shadowClass+'-off',
				$ul = this.addClass(o.hoverClass)
					.find('>ul:hidden').css('visibility','visible');
			sf.IE7fix.call($ul);
			o.onBeforeShow.call($ul);
			$ul.animate(o.animation,o.speed,function(){ sf.IE7fix.call($ul); o.onShow.call($ul); });
			return this;
		}
	});

})(jQuery);

//CURVY CORNERS
function browserdetect(){var A=navigator.userAgent.toLowerCase();this.isIE=A.indexOf("msie")>-1;this.ieVer=this.isIE?/msie\s(\d\.\d)/.exec(A)[1]:0;this.isMoz=A.indexOf("firefox")!=-1;this.isSafari=A.indexOf("safari")!=-1;this.quirksMode=this.isIE&&(!document.compatMode||document.compatMode.indexOf("BackCompat")>-1);this.isOp="opera" in window;this.isWebKit=A.indexOf("webkit")!=-1;if(this.isIE){this.get_style=function(D,F){if(!(F in D.currentStyle)){return""}var C=/^([\d.]+)(\w*)/.exec(D.currentStyle[F]);if(!C){return D.currentStyle[F]}if(C[1]==0){return"0"}if(C[2]&&C[2]!=="px"){var B=D.style.left;var E=D.runtimeStyle.left;D.runtimeStyle.left=D.currentStyle.left;D.style.left=C[1]+C[2];C[0]=D.style.pixelLeft;D.style.left=B;D.runtimeStyle.left=E}return C[0]}}else{this.get_style=function(B,C){C=C.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();return document.defaultView.getComputedStyle(B,"").getPropertyValue(C)}}}var curvyBrowser=new browserdetect;if(curvyBrowser.isIE){try{document.execCommand("BackgroundImageCache",false,true)}catch(e){}}function curvyCnrSpec(A){this.selectorText=A;this.tlR=this.trR=this.blR=this.brR=0;this.tlu=this.tru=this.blu=this.bru="";this.antiAlias=true}curvyCnrSpec.prototype.setcorner=function(B,C,A,D){if(!B){this.tlR=this.trR=this.blR=this.brR=parseInt(A);this.tlu=this.tru=this.blu=this.bru=D}else{propname=B.charAt(0)+C.charAt(0);this[propname+"R"]=parseInt(A);this[propname+"u"]=D}};curvyCnrSpec.prototype.get=function(D){if(/^(t|b)(l|r)(R|u)$/.test(D)){return this[D]}if(/^(t|b)(l|r)Ru$/.test(D)){var C=D.charAt(0)+D.charAt(1);return this[C+"R"]+this[C+"u"]}if(/^(t|b)Ru?$/.test(D)){var B=D.charAt(0);B+=this[B+"lR"]>this[B+"rR"]?"l":"r";var A=this[B+"R"];if(D.length===3&&D.charAt(2)==="u"){A+=this[B="u"]}return A}throw new Error("Don't recognize property "+D)};curvyCnrSpec.prototype.radiusdiff=function(A){if(A!=="t"&&A!=="b"){throw new Error("Param must be 't' or 'b'")}return Math.abs(this[A+"lR"]-this[A+"rR"])};curvyCnrSpec.prototype.setfrom=function(A){this.tlu=this.tru=this.blu=this.bru="px";if("tl" in A){this.tlR=A.tl.radius}if("tr" in A){this.trR=A.tr.radius}if("bl" in A){this.blR=A.bl.radius}if("br" in A){this.brR=A.br.radius}if("antiAlias" in A){this.antiAlias=A.antiAlias}};curvyCnrSpec.prototype.cloneOn=function(G){var E=["tl","tr","bl","br"];var H=0;var C,A;for(C in E){if(!isNaN(C)){A=this[E[C]+"u"];if(A!==""&&A!=="px"){H=new curvyCnrSpec;break}}}if(!H){H=this}else{var B,D,F=curvyBrowser.get_style(G,"left");for(C in E){if(!isNaN(C)){B=E[C];A=this[B+"u"];D=this[B+"R"];if(A!=="px"){var F=G.style.left;G.style.left=D+A;D=G.style.pixelLeft;G.style.left=F}H[B+"R"]=D;H[B+"u"]="px"}}G.style.left=F}return H};curvyCnrSpec.prototype.radiusSum=function(A){if(A!=="t"&&A!=="b"){throw new Error("Param must be 't' or 'b'")}return this[A+"lR"]+this[A+"rR"]};curvyCnrSpec.prototype.radiusCount=function(A){var B=0;if(this[A+"lR"]){++B}if(this[A+"rR"]){++B}return B};curvyCnrSpec.prototype.cornerNames=function(){var A=[];if(this.tlR){A.push("tl")}if(this.trR){A.push("tr")}if(this.blR){A.push("bl")}if(this.brR){A.push("br")}return A};function operasheet(C){var A=document.styleSheets.item(C).ownerNode.text;A=A.replace(/\/\*(\n|\r|.)*?\*\//g,"");var D=new RegExp("^s*([\\w.#][-\\w.#, ]+)[\\n\\s]*\\{([^}]+border-((top|bottom)-(left|right)-)?radius[^}]*)\\}","mg");var G;this.rules=[];while((G=D.exec(A))!==null){var F=new RegExp("(..)border-((top|bottom)-(left|right)-)?radius:\\s*([\\d.]+)(in|em|px|ex|pt)","g");var E,B=new curvyCnrSpec(G[1]);while((E=F.exec(G[2]))!==null){if(E[1]!=="z-"){B.setcorner(E[3],E[4],E[5],E[6])}}this.rules.push(B)}}operasheet.contains_border_radius=function(A){return/border-((top|bottom)-(left|right)-)?radius/.test(document.styleSheets.item(A).ownerNode.text)};function curvyCorners(){var G,D,E,B,J;if(typeof arguments[0]!=="object"){throw curvyCorners.newError("First parameter of curvyCorners() must be an object.")}if(arguments[0] instanceof curvyCnrSpec){B=arguments[0];if(!B.selectorText&&typeof arguments[1]==="string"){B.selectorText=arguments[1]}}else{if(typeof arguments[1]!=="object"&&typeof arguments[1]!=="string"){throw curvyCorners.newError("Second parameter of curvyCorners() must be an object or a class name.")}D=arguments[1];if(typeof D!=="string"){D=""}if(D!==""&&D.charAt(0)!=="."&&"autoPad" in arguments[0]){D="."+D}B=new curvyCnrSpec(D);B.setfrom(arguments[0])}if(B.selectorText){J=0;var I=B.selectorText.replace(/\s+$/,"").split(/,\s*/);E=new Array;function A(M){var L=M.split("#");return(L.length===2?"#":"")+L.pop()}for(G=0;G<I.length;++G){var K=A(I[G]);var H=K.split(" ");switch(K.charAt(0)){case"#":D=H.length===1?K:H[0];D=document.getElementById(D.substr(1));if(D===null){curvyCorners.alert("No object with ID "+K+" exists yet.\nCall curvyCorners(settings, obj) when it is created.")}else{if(H.length===1){E.push(D)}else{E=E.concat(curvyCorners.getElementsByClass(H[1],D))}}break;default:if(H.length===1){E=E.concat(curvyCorners.getElementsByClass(K))}else{var C=curvyCorners.getElementsByClass(H[0]);for(D=0;D<C.length;++D){E=E.concat(curvyCorners.getElementsByClass(H[1],C))}}}}}else{J=1;E=arguments}for(G=J,D=E.length;G<D;++G){if(E[G]&&(!("IEborderRadius" in E[G].style)||E[G].style.IEborderRadius!="set")){if(E[G].className&&E[G].className.indexOf("curvyRedraw")!==-1){if(typeof curvyCorners.redrawList==="undefined"){curvyCorners.redrawList=new Array}curvyCorners.redrawList.push({node:E[G],spec:B,copy:E[G].cloneNode(false)})}E[G].style.IEborderRadius="set";var F=new curvyObject(B,E[G]);F.applyCorners()}}}curvyCorners.prototype.applyCornersToAll=function(){curvyCorners.alert("This function is now redundant. Just call curvyCorners(). See documentation.")};curvyCorners.redraw=function(){if(!curvyBrowser.isOp&&!curvyBrowser.isIE){return}if(!curvyCorners.redrawList){throw curvyCorners.newError("curvyCorners.redraw() has nothing to redraw.")}var E=curvyCorners.bock_redraw;curvyCorners.block_redraw=true;for(var A in curvyCorners.redrawList){if(isNaN(A)){continue}var D=curvyCorners.redrawList[A];if(!D.node.clientWidth){continue}var B=D.copy.cloneNode(false);for(var C=D.node.firstChild;C!=null;C=C.nextSibling){if(C.className==="autoPadDiv"){break}}if(!C){curvyCorners.alert("Couldn't find autoPad DIV");break}D.node.parentNode.replaceChild(B,D.node);while(C.firstChild){B.appendChild(C.removeChild(C.firstChild))}D=new curvyObject(D.spec,D.node=B);D.applyCorners()}curvyCorners.block_redraw=E};curvyCorners.adjust=function(obj,prop,newval){if(curvyBrowser.isOp||curvyBrowser.isIE){if(!curvyCorners.redrawList){throw curvyCorners.newError("curvyCorners.adjust() has nothing to adjust.")}var i,j=curvyCorners.redrawList.length;for(i=0;i<j;++i){if(curvyCorners.redrawList[i].node===obj){break}}if(i===j){throw curvyCorners.newError("Object not redrawable")}obj=curvyCorners.redrawList[i].copy}if(prop.indexOf(".")===-1){obj[prop]=newval}else{eval("obj."+prop+"='"+newval+"'")}};curvyCorners.handleWinResize=function(){if(!curvyCorners.block_redraw){curvyCorners.redraw()}};curvyCorners.setWinResize=function(A){curvyCorners.block_redraw=!A};curvyCorners.newError=function(A){return new Error("curvyCorners Error:\n"+A)};curvyCorners.alert=function(A){if(typeof curvyCornersVerbose==="undefined"||curvyCornersVerbose){alert(A)}};function curvyObject(){var U;this.box=arguments[1];this.settings=arguments[0];this.topContainer=this.bottomContainer=this.shell=U=null;var K=this.box.clientWidth;if(!K&&curvyBrowser.isIE){this.box.style.zoom=1;K=this.box.clientWidth}if(!K){if(!this.box.parentNode){throw this.newError("box has no parent!")}for(U=this.box;;U=U.parentNode){if(!U||U.tagName==="BODY"){this.applyCorners=function(){};curvyCorners.alert(this.errmsg("zero-width box with no accountable parent","warning"));return}if(U.style.display==="none"){break}}U.style.display="block";K=this.box.clientWidth}if(arguments[0] instanceof curvyCnrSpec){this.spec=arguments[0].cloneOn(this.box)}else{this.spec=new curvyCnrSpec("");this.spec.setfrom(this.settings)}var b=curvyBrowser.get_style(this.box,"borderTopWidth");var J=curvyBrowser.get_style(this.box,"borderBottomWidth");var D=curvyBrowser.get_style(this.box,"borderLeftWidth");var B=curvyBrowser.get_style(this.box,"borderRightWidth");var I=curvyBrowser.get_style(this.box,"borderTopColor");var G=curvyBrowser.get_style(this.box,"borderBottomColor");var A=curvyBrowser.get_style(this.box,"borderLeftColor");var E=curvyBrowser.get_style(this.box,"backgroundColor");var C=curvyBrowser.get_style(this.box,"backgroundImage");var Y=curvyBrowser.get_style(this.box,"backgroundRepeat");if(this.box.currentStyle&&this.box.currentStyle.backgroundPositionX){var R=curvyBrowser.get_style(this.box,"backgroundPositionX");var P=curvyBrowser.get_style(this.box,"backgroundPositionY")}else{var R=curvyBrowser.get_style(this.box,"backgroundPosition");R=R.split(" ");var P=R[1];R=R[0]}var O=curvyBrowser.get_style(this.box,"position");var Z=curvyBrowser.get_style(this.box,"paddingTop");var c=curvyBrowser.get_style(this.box,"paddingBottom");var Q=curvyBrowser.get_style(this.box,"paddingLeft");var a=curvyBrowser.get_style(this.box,"paddingRight");var S=curvyBrowser.get_style(this.box,"border");filter=curvyBrowser.ieVer>7?curvyBrowser.get_style(this.box,"filter"):null;var H=this.spec.get("tR");var M=this.spec.get("bR");var W=function(f){if(typeof f==="number"){return f}if(typeof f!=="string"){throw new Error("unexpected styleToNPx type "+typeof f)}var d=/^[-\d.]([a-z]+)$/.exec(f);if(d&&d[1]!="px"){throw new Error("Unexpected unit "+d[1])}if(isNaN(f=parseInt(f))){f=0}return f};var T=function(d){return d<=0?"0":d+"px"};try{this.borderWidth=W(b);this.borderWidthB=W(J);this.borderWidthL=W(D);this.borderWidthR=W(B);this.boxColour=curvyObject.format_colour(E);this.topPadding=W(Z);this.bottomPadding=W(c);this.leftPadding=W(Q);this.rightPadding=W(a);this.boxWidth=K;this.boxHeight=this.box.clientHeight;this.borderColour=curvyObject.format_colour(I);this.borderColourB=curvyObject.format_colour(G);this.borderColourL=curvyObject.format_colour(A);this.borderString=this.borderWidth+"px solid "+this.borderColour;this.borderStringB=this.borderWidthB+"px solid "+this.borderColourB;this.backgroundImage=((C!="none")?C:"");this.backgroundRepeat=Y}catch(X){throw this.newError("getMessage" in X?X.getMessage():X.message)}var F=this.boxHeight;var V=K;if(curvyBrowser.isOp){R=W(R);P=W(P);if(R){var N=V+this.borderWidthL+this.borderWidthR;if(R>N){R=N}R=(N/R*100)+"%"}if(P){var N=F+this.borderWidth+this.borderWidthB;if(P>N){P=N}P=(N/P*100)+"%"}}if(curvyBrowser.quirksMode){}else{this.boxWidth-=this.leftPadding+this.rightPadding;this.boxHeight-=this.topPadding+this.bottomPadding}this.contentContainer=document.createElement("div");if(filter){this.contentContainer.style.filter=filter}while(this.box.firstChild){this.contentContainer.appendChild(this.box.removeChild(this.box.firstChild))}if(O!="absolute"){this.box.style.position="relative"}this.box.style.padding="0";this.box.style.border=this.box.style.backgroundImage="none";this.box.style.backgroundColor="transparent";this.box.style.width=(V+this.borderWidthL+this.borderWidthR)+"px";this.box.style.height=(F+this.borderWidth+this.borderWidthB)+"px";var L=document.createElement("div");L.style.position="absolute";if(filter){L.style.filter=filter}if(curvyBrowser.quirksMode){L.style.width=(V+this.borderWidthL+this.borderWidthR)+"px"}else{L.style.width=V+"px"}L.style.height=T(F+this.borderWidth+this.borderWidthB-H-M);L.style.padding="0";L.style.top=H+"px";L.style.left="0";if(this.borderWidthL){L.style.borderLeft=this.borderWidthL+"px solid "+this.borderColourL}if(this.borderWidth&&!H){L.style.borderTop=this.borderWidth+"px solid "+this.borderColour}if(this.borderWidthR){L.style.borderRight=this.borderWidthR+"px solid "+this.borderColourL}if(this.borderWidthB&&!M){L.style.borderBottom=this.borderWidthB+"px solid "+this.borderColourB}L.style.backgroundColor=E;L.style.backgroundImage=this.backgroundImage;L.style.backgroundRepeat=this.backgroundRepeat;this.shell=this.box.appendChild(L);K=curvyBrowser.get_style(this.shell,"width");if(K===""||K==="auto"||K.indexOf("%")!==-1){throw this.newError("Shell width is "+K)}this.boxWidth=(K!=""&&K!="auto"&&K.indexOf("%")==-1)?parseInt(K):this.shell.clientWidth;this.applyCorners=function(){if(this.backgroundObject){var w=function(AO,i,t){if(AO===0){return 0}var k;if(AO==="right"||AO==="bottom"){return t-i}if(AO==="center"){return(t-i)/2}if(AO.indexOf("%")>0){return(t-i)*100/parseInt(AO)}return W(AO)};this.backgroundPosX=w(R,this.backgroundObject.width,V);this.backgroundPosY=w(P,this.backgroundObject.height,F)}else{if(this.backgroundImage){this.backgroundPosX=W(R);this.backgroundPosY=W(P)}}if(H){v=document.createElement("div");v.style.width=this.boxWidth+"px";v.style.fontSize="1px";v.style.overflow="hidden";v.style.position="absolute";v.style.paddingLeft=this.borderWidth+"px";v.style.paddingRight=this.borderWidth+"px";v.style.height=H+"px";v.style.top=-H+"px";v.style.left=-this.borderWidthL+"px";this.topContainer=this.shell.appendChild(v)}if(M){var v=document.createElement("div");v.style.width=this.boxWidth+"px";v.style.fontSize="1px";v.style.overflow="hidden";v.style.position="absolute";v.style.paddingLeft=this.borderWidthB+"px";v.style.paddingRight=this.borderWidthB+"px";v.style.height=M+"px";v.style.bottom=-M+"px";v.style.left=-this.borderWidthL+"px";this.bottomContainer=this.shell.appendChild(v)}var AG=this.spec.cornerNames();for(var AK in AG){if(!isNaN(AK)){var AC=AG[AK];var AD=this.spec[AC+"R"];var AE,AH,j,AF;if(AC=="tr"||AC=="tl"){AE=this.borderWidth;AH=this.borderColour;AF=this.borderWidth}else{AE=this.borderWidthB;AH=this.borderColourB;AF=this.borderWidthB}j=AD-AF;var u=document.createElement("div");u.style.height=this.spec.get(AC+"Ru");u.style.width=this.spec.get(AC+"Ru");u.style.position="absolute";u.style.fontSize="1px";u.style.overflow="hidden";var r,q,p;var n=filter?parseInt(/alpha\(opacity.(\d+)\)/.exec(filter)[1]):100;for(r=0;r<AD;++r){var m=(r+1>=j)?-1:Math.floor(Math.sqrt(Math.pow(j,2)-Math.pow(r+1,2)))-1;if(j!=AD){var h=(r>=j)?-1:Math.ceil(Math.sqrt(Math.pow(j,2)-Math.pow(r,2)));var f=(r+1>=AD)?-1:Math.floor(Math.sqrt(Math.pow(AD,2)-Math.pow((r+1),2)))-1}var d=(r>=AD)?-1:Math.ceil(Math.sqrt(Math.pow(AD,2)-Math.pow(r,2)));if(m>-1){this.drawPixel(r,0,this.boxColour,n,(m+1),u,true,AD)}if(j!=AD){if(this.spec.antiAlias){for(q=m+1;q<h;++q){if(this.backgroundImage!=""){var g=curvyObject.pixelFraction(r,q,j)*100;this.drawPixel(r,q,AH,n,1,u,g>=30,AD)}else{if(this.boxColour!=="transparent"){var AB=curvyObject.BlendColour(this.boxColour,AH,curvyObject.pixelFraction(r,q,j));this.drawPixel(r,q,AB,n,1,u,false,AD)}else{this.drawPixel(r,q,AH,n>>1,1,u,false,AD)}}}if(f>=h){if(h==-1){h=0}this.drawPixel(r,h,AH,n,(f-h+1),u,false,0)}p=AH;q=f}else{if(f>m){this.drawPixel(r,(m+1),AH,n,(f-m),u,false,0)}}}else{p=this.boxColour;q=m}if(this.spec.antiAlias){while(++q<d){this.drawPixel(r,q,p,(curvyObject.pixelFraction(r,q,AD)*n),1,u,AF<=0,AD)}}}for(var y=0,AJ=u.childNodes.length;y<AJ;++y){var s=u.childNodes[y];var AI=parseInt(s.style.top);var AM=parseInt(s.style.left);var AN=parseInt(s.style.height);if(AC=="tl"||AC=="bl"){s.style.left=(AD-AM-1)+"px"}if(AC=="tr"||AC=="tl"){s.style.top=(AD-AN-AI)+"px"}s.style.backgroundRepeat=this.backgroundRepeat;if(this.backgroundImage){switch(AC){case"tr":s.style.backgroundPosition=(this.backgroundPosX-this.borderWidthL+AD-V-AM)+"px "+(this.backgroundPosY+AN+AI+this.borderWidth-AD)+"px";break;case"tl":s.style.backgroundPosition=(this.backgroundPosX-AD+AM+this.borderWidthL)+"px "+(this.backgroundPosY-AD+AN+AI+this.borderWidth)+"px";break;case"bl":s.style.backgroundPosition=(this.backgroundPosX-AD+AM+1+this.borderWidthL)+"px "+(this.backgroundPosY-F-this.borderWidth+(curvyBrowser.quirksMode?AI:-AI)+AD)+"px";break;case"br":if(curvyBrowser.quirksMode){s.style.backgroundPosition=(this.backgroundPosX+this.borderWidthL-V+AD-AM)+"px "+(this.backgroundPosY-F-this.borderWidth+AI+AD)+"px"}else{s.style.backgroundPosition=(this.backgroundPosX-this.borderWidthL-V+AD-AM)+"px "+(this.backgroundPosY-F-this.borderWidth+AD-AI)+"px"}}}}switch(AC){case"tl":u.style.top=u.style.left="0";this.topContainer.appendChild(u);break;case"tr":u.style.top=u.style.right="0";this.topContainer.appendChild(u);break;case"bl":u.style.bottom=u.style.left="0";this.bottomContainer.appendChild(u);break;case"br":u.style.bottom=u.style.right="0";this.bottomContainer.appendChild(u)}}}var x={t:this.spec.radiusdiff("t"),b:this.spec.radiusdiff("b")};for(z in x){if(typeof z==="function"){continue}if(!this.spec.get(z+"R")){continue}if(x[z]){if(this.backgroundImage&&this.spec.radiusSum(z)!==x[z]){curvyCorners.alert(this.errmsg("Not supported: unequal non-zero top/bottom radii with background image"))}var AL=(this.spec[z+"lR"]<this.spec[z+"rR"])?z+"l":z+"r";var l=document.createElement("div");l.style.height=x[z]+"px";l.style.width=this.spec.get(AL+"Ru");l.style.position="absolute";l.style.fontSize="1px";l.style.overflow="hidden";l.style.backgroundColor=this.boxColour;switch(AL){case"tl":l.style.bottom=l.style.left="0";l.style.borderLeft=this.borderString;this.topContainer.appendChild(l);break;case"tr":l.style.bottom=l.style.right="0";l.style.borderRight=this.borderString;this.topContainer.appendChild(l);break;case"bl":l.style.top=l.style.left="0";l.style.borderLeft=this.borderStringB;this.bottomContainer.appendChild(l);break;case"br":l.style.top=l.style.right="0";l.style.borderRight=this.borderStringB;this.bottomContainer.appendChild(l)}}var o=document.createElement("div");if(filter){o.style.filter=filter}o.style.position="relative";o.style.fontSize="1px";o.style.overflow="hidden";o.style.width=this.fillerWidth(z);o.style.backgroundColor=this.boxColour;o.style.backgroundImage=this.backgroundImage;o.style.backgroundRepeat=this.backgroundRepeat;switch(z){case"t":if(this.topContainer){if(curvyBrowser.quirksMode){o.style.height=100+H+"px"}else{o.style.height=100+H-this.borderWidth+"px"}o.style.marginLeft=this.spec.tlR?(this.spec.tlR-this.borderWidthL)+"px":"0";o.style.borderTop=this.borderString;if(this.backgroundImage){var AA=this.spec.tlR?(this.backgroundPosX-(H-this.borderWidthL))+"px ":"0 ";o.style.backgroundPosition=AA+this.backgroundPosY+"px";this.shell.style.backgroundPosition=this.backgroundPosX+"px "+(this.backgroundPosY-H+this.borderWidthL)+"px"}this.topContainer.appendChild(o)}break;case"b":if(this.bottomContainer){if(curvyBrowser.quirksMode){o.style.height=M+"px"}else{o.style.height=M-this.borderWidthB+"px"}o.style.marginLeft=this.spec.blR?(this.spec.blR-this.borderWidthL)+"px":"0";o.style.borderBottom=this.borderStringB;if(this.backgroundImage){var AA=this.spec.blR?(this.backgroundPosX+this.borderWidthL-M)+"px ":this.backgroundPosX+"px ";o.style.backgroundPosition=AA+(this.backgroundPosY-F-this.borderWidth+M)+"px"}this.bottomContainer.appendChild(o)}}}this.contentContainer.style.position="absolute";this.contentContainer.className="autoPadDiv";this.contentContainer.style.left=this.borderWidthL+"px";this.contentContainer.style.paddingTop=this.topPadding+"px";this.contentContainer.style.top=this.borderWidth+"px";this.contentContainer.style.paddingLeft=this.leftPadding+"px";this.contentContainer.style.paddingRight=this.rightPadding+"px";z=V;if(!curvyBrowser.quirksMode){z-=this.leftPadding+this.rightPadding}this.contentContainer.style.width=z+"px";this.contentContainer.style.textAlign=curvyBrowser.get_style(this.box,"textAlign");this.box.style.textAlign="left";this.box.appendChild(this.contentContainer);if(U){U.style.display="none"}};if(this.backgroundImage){R=this.backgroundCheck(R);P=this.backgroundCheck(P);if(this.backgroundObject){this.backgroundObject.holdingElement=this;this.dispatch=this.applyCorners;this.applyCorners=function(){if(this.backgroundObject.complete){this.dispatch()}else{this.backgroundObject.onload=new Function("curvyObject.dispatch(this.holdingElement);")}}}}}curvyObject.prototype.backgroundCheck=function(B){if(B==="top"||B==="left"||parseInt(B)===0){return 0}if(!(/^[-\d.]+px$/.test(B))&&!this.backgroundObject){this.backgroundObject=new Image;var A=function(D){var C=/url\("?([^'"]+)"?\)/.exec(D);return(C?C[1]:D)};this.backgroundObject.src=A(this.backgroundImage)}return B};curvyObject.dispatch=function(A){if("dispatch" in A){A.dispatch()}else{throw A.newError("No dispatch function")}};curvyObject.prototype.drawPixel=function(J,G,A,F,H,I,C,E){var B=document.createElement("div");B.style.height=H+"px";B.style.width="1px";B.style.position="absolute";B.style.fontSize="1px";B.style.overflow="hidden";var D=this.spec.get("tR");B.style.backgroundColor=A;if(C&&this.backgroundImage!=""){B.style.backgroundImage=this.backgroundImage;B.style.backgroundPosition="-"+(this.boxWidth-(E-J)+this.borderWidth)+"px -"+((this.boxHeight+D+G)-this.borderWidth)+"px"}if(F!=100){curvyObject.setOpacity(B,F)}B.style.top=G+"px";B.style.left=J+"px";I.appendChild(B)};curvyObject.prototype.fillerWidth=function(A){var B=curvyBrowser.quirksMode?0:this.spec.radiusCount(A)*this.borderWidthL;return(this.boxWidth-this.spec.radiusSum(A)+B)+"px"};curvyObject.prototype.errmsg=function(C,D){var B="\ntag: "+this.box.tagName;if(this.box.id){B+="\nid: "+this.box.id}if(this.box.className){B+="\nclass: "+this.box.className}var A;if((A=this.box.parentNode)===null){B+="\n(box has no parent)"}else{B+="\nParent tag: "+A.tagName;if(A.id){B+="\nParent ID: "+A.id}if(A.className){B+="\nParent class: "+A.className}}if(D===undefined){D="warning"}return"curvyObject "+D+":\n"+C+B};curvyObject.prototype.newError=function(A){return new Error(this.errmsg(A,"exception"))};curvyObject.IntToHex=function(B){var A=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];return A[B>>>4]+""+A[B&15]};curvyObject.BlendColour=function(L,J,G){if(L==="transparent"||J==="transparent"){throw this.newError("Cannot blend with transparent")}if(L.charAt(0)!=="#"){L=curvyObject.format_colour(L)}if(J.charAt(0)!=="#"){J=curvyObject.format_colour(J)}var D=parseInt(L.substr(1,2),16);var K=parseInt(L.substr(3,2),16);var F=parseInt(L.substr(5,2),16);var C=parseInt(J.substr(1,2),16);var I=parseInt(J.substr(3,2),16);var E=parseInt(J.substr(5,2),16);if(G>1||G<0){G=1}var H=Math.round((D*G)+(C*(1-G)));if(H>255){H=255}if(H<0){H=0}var B=Math.round((K*G)+(I*(1-G)));if(B>255){B=255}if(B<0){B=0}var A=Math.round((F*G)+(E*(1-G)));if(A>255){A=255}if(A<0){A=0}return"#"+curvyObject.IntToHex(H)+curvyObject.IntToHex(B)+curvyObject.IntToHex(A)};curvyObject.pixelFraction=function(H,G,A){var J;var E=A*A;var B=new Array(2);var F=new Array(2);var I=0;var C="";var D=Math.sqrt(E-Math.pow(H,2));if(D>=G&&D<(G+1)){C="Left";B[I]=0;F[I]=D-G;++I}D=Math.sqrt(E-Math.pow(G+1,2));if(D>=H&&D<(H+1)){C+="Top";B[I]=D-H;F[I]=1;++I}D=Math.sqrt(E-Math.pow(H+1,2));if(D>=G&&D<(G+1)){C+="Right";B[I]=1;F[I]=D-G;++I}D=Math.sqrt(E-Math.pow(G,2));if(D>=H&&D<(H+1)){C+="Bottom";B[I]=D-H;F[I]=0}switch(C){case"LeftRight":J=Math.min(F[0],F[1])+((Math.max(F[0],F[1])-Math.min(F[0],F[1]))/2);break;case"TopRight":J=1-(((1-B[0])*(1-F[1]))/2);break;case"TopBottom":J=Math.min(B[0],B[1])+((Math.max(B[0],B[1])-Math.min(B[0],B[1]))/2);break;case"LeftBottom":J=F[0]*B[1]/2;break;default:J=1}return J};curvyObject.rgb2Array=function(A){var B=A.substring(4,A.indexOf(")"));return B.split(", ")};curvyObject.rgb2Hex=function(B){try{var C=curvyObject.rgb2Array(B);var G=parseInt(C[0]);var E=parseInt(C[1]);var A=parseInt(C[2]);var D="#"+curvyObject.IntToHex(G)+curvyObject.IntToHex(E)+curvyObject.IntToHex(A)}catch(F){var H="getMessage" in F?F.getMessage():F.message;throw new Error("Error ("+H+") converting RGB value to Hex in rgb2Hex")}return D};curvyObject.setOpacity=function(F,C){C=(C==100)?99.999:C;if(curvyBrowser.isSafari&&F.tagName!="IFRAME"){var B=curvyObject.rgb2Array(F.style.backgroundColor);var E=parseInt(B[0]);var D=parseInt(B[1]);var A=parseInt(B[2]);F.style.backgroundColor="rgba("+E+", "+D+", "+A+", "+C/100+")"}else{if(typeof F.style.opacity!=="undefined"){F.style.opacity=C/100}else{if(typeof F.style.MozOpacity!=="undefined"){F.style.MozOpacity=C/100}else{if(typeof F.style.filter!="undefined"){F.style.filter="alpha(opacity="+C+")"}else{if(typeof F.style.KHTMLOpacity!="undefined"){F.style.KHTMLOpacity=C/100}}}}}};function addEvent(D,C,B,A){if(D.addEventListener){D.addEventListener(C,B,A);return true}if(D.attachEvent){return D.attachEvent("on"+C,B)}D["on"+C]=B;return false}curvyObject.getComputedColour=function(E){var F=document.createElement("DIV");F.style.backgroundColor=E;document.body.appendChild(F);if(window.getComputedStyle){var D=document.defaultView.getComputedStyle(F,null).getPropertyValue("background-color");F.parentNode.removeChild(F);if(D.substr(0,3)==="rgb"){D=curvyObject.rgb2Hex(D)}return D}else{var A=document.body.createTextRange();A.moveToElementText(F);A.execCommand("ForeColor",false,E);var B=A.queryCommandValue("ForeColor");var C="rgb("+(B&255)+", "+((B&65280)>>8)+", "+((B&16711680)>>16)+")";F.parentNode.removeChild(F);A=null;return curvyObject.rgb2Hex(C)}};curvyObject.format_colour=function(A){if(A!=""&&A!="transparent"){if(A.substr(0,3)==="rgb"){A=curvyObject.rgb2Hex(A)}else{if(A.charAt(0)!=="#"){A=curvyObject.getComputedColour(A)}else{if(A.length===4){A="#"+A.charAt(1)+A.charAt(1)+A.charAt(2)+A.charAt(2)+A.charAt(3)+A.charAt(3)}}}}return A};curvyCorners.getElementsByClass=function(H,F){var E=new Array;if(F===undefined){F=document}H=H.split(".");var A="*";if(H.length===1){A=H[0];H=false}else{if(H[0]){A=H[0]}H=H[1]}var D,C,B;if(A.charAt(0)==="#"){C=document.getElementById(A.substr(1));if(C){E.push(C)}}else{C=F.getElementsByTagName(A);B=C.length;if(H){var G=new RegExp("(^|\\s)"+H+"(\\s|$)");for(D=0;D<B;++D){if(G.test(C[D].className)){E.push(C[D])}}}else{for(D=0;D<B;++D){E.push(C[D])}}}return E};if(curvyBrowser.isMoz||curvyBrowser.isWebKit){var curvyCornersNoAutoScan=true}else{curvyCorners.scanStyles=function(){function B(F){var G=/^[\d.]+(\w+)$/.exec(F);return G[1]}var E,D,C;if(curvyBrowser.isIE){function A(L){var J=L.style;if(curvyBrowser.ieVer>6){var H=J["-webkit-border-radius"]||0;var K=J["-webkit-border-top-right-radius"]||0;var F=J["-webkit-border-top-left-radius"]||0;var G=J["-webkit-border-bottom-right-radius"]||0;var M=J["-webkit-border-bottom-left-radius"]||0}else{var H=J["webkit-border-radius"]||0;var K=J["webkit-border-top-right-radius"]||0;var F=J["webkit-border-top-left-radius"]||0;var G=J["webkit-border-bottom-right-radius"]||0;var M=J["webkit-border-bottom-left-radius"]||0}if(H||F||K||G||M){var I=new curvyCnrSpec(L.selectorText);if(H){I.setcorner(null,null,parseInt(H),B(H))}else{if(K){I.setcorner("t","r",parseInt(K),B(K))}if(F){I.setcorner("t","l",parseInt(F),B(F))}if(M){I.setcorner("b","l",parseInt(M),B(M))}if(G){I.setcorner("b","r",parseInt(G),B(G))}}curvyCorners(I)}}for(E=0;E<document.styleSheets.length;++E){if(document.styleSheets[E].imports){for(D=0;D<document.styleSheets[E].imports.length;++D){for(C=0;C<document.styleSheets[E].imports[D].rules.length;++C){A(document.styleSheets[E].imports[D].rules[C])}}}for(D=0;D<document.styleSheets[E].rules.length;++D){A(document.styleSheets[E].rules[D])}}}else{if(curvyBrowser.isOp){for(E=0;E<document.styleSheets.length;++E){if(operasheet.contains_border_radius(E)){C=new operasheet(E);for(D in C.rules){if(!isNaN(D)){curvyCorners(C.rules[D])}}}}}else{curvyCorners.alert("Scanstyles does nothing in Webkit/Firefox")}}};curvyCorners.init=function(){if(arguments.callee.done){return}arguments.callee.done=true;if(curvyBrowser.isWebKit&&curvyCorners.init.timer){clearInterval(curvyCorners.init.timer);curvyCorners.init.timer=null}curvyCorners.scanStyles()}}if(typeof curvyCornersNoAutoScan==="undefined"||curvyCornersNoAutoScan===false){if(curvyBrowser.isOp){document.addEventListener("DOMContentLoaded",curvyCorners.init,false)}else{addEvent(window,"load",curvyCorners.init,false)}};

/*!
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version ${Version}
 */

var Cufon = (function() {

	var api = function() {
		return api.replace.apply(null, arguments);
	};

	var DOM = api.DOM = {

		ready: (function() {

			var complete = false, readyStatus = { loaded: 1, complete: 1 };

			var queue = [], perform = function() {
				if (complete) return;
				complete = true;
				for (var fn; fn = queue.shift(); fn());
			};

			// Gecko, Opera, WebKit r26101+

			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', perform, false);
				window.addEventListener('pageshow', perform, false); // For cached Gecko pages
			}

			// Old WebKit, Internet Explorer

			if (!window.opera && document.readyState) (function() {
				readyStatus[document.readyState] ? perform() : setTimeout(arguments.callee, 10);
			})();

			// Internet Explorer

			if (document.readyState && document.createStyleSheet) (function() {
				try {
					document.body.doScroll('left');
					perform();
				}
				catch (e) {
					setTimeout(arguments.callee, 1);
				}
			})();

			addEvent(window, 'load', perform); // Fallback

			return function(listener) {
				if (!arguments.length) perform();
				else complete ? listener() : queue.push(listener);
			};

		})(),

		root: function() {
			return document.documentElement || document.body;
		}

	};

	var CSS = api.CSS = {

		Size: function(value, base) {

			this.value = parseFloat(value);
			this.unit = String(value).match(/[a-z%]*$/)[0] || 'px';

			this.convert = function(value) {
				return value / base * this.value;
			};

			this.convertFrom = function(value) {
				return value / this.value * base;
			};

			this.toString = function() {
				return this.value + this.unit;
			};

		},

		addClass: function(el, className) {
			var current = el.className;
			el.className = current + (current && ' ') + className;
			return el;
		},

		color: cached(function(value) {
			var parsed = {};
			parsed.color = value.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function($0, $1, $2) {
				parsed.opacity = parseFloat($2);
				return 'rgb(' + $1 + ')';
			});
			return parsed;
		}),

		// has no direct CSS equivalent.
		// @see http://msdn.microsoft.com/en-us/library/system.windows.fontstretches.aspx
		fontStretch: cached(function(value) {
			if (typeof value == 'number') return value;
			if (/%$/.test(value)) return parseFloat(value) / 100;
			return {
				'ultra-condensed': 0.5,
				'extra-condensed': 0.625,
				condensed: 0.75,
				'semi-condensed': 0.875,
				'semi-expanded': 1.125,
				expanded: 1.25,
				'extra-expanded': 1.5,
				'ultra-expanded': 2
			}[value] || 1;
		}),

		getStyle: function(el) {
			var view = document.defaultView;
			if (view && view.getComputedStyle) return new Style(view.getComputedStyle(el, null));
			if (el.currentStyle) return new Style(el.currentStyle);
			return new Style(el.style);
		},

		gradient: cached(function(value) {
			var gradient = {
				id: value,
				type: value.match(/^-([a-z]+)-gradient\(/)[1],
				stops: []
			}, colors = value.substr(value.indexOf('(')).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);
			for (var i = 0, l = colors.length, stop; i < l; ++i) {
				stop = colors[i].split('=', 2).reverse();
				gradient.stops.push([ stop[1] || i / (l - 1), stop[0] ]);
			}
			return gradient;
		}),

		quotedList: cached(function(value) {
			// doesn't work properly with empty quoted strings (""), but
			// it's not worth the extra code.
			var list = [], re = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, match;
			while (match = re.exec(value)) list.push(match[3] || match[1]);
			return list;
		}),

		recognizesMedia: cached(function(media) {
			var el = document.createElement('style'), sheet, container, supported;
			el.type = 'text/css';
			el.media = media;
			try { // this is cached anyway
				el.appendChild(document.createTextNode('/**/'));
			} catch (e) {}
			container = elementsByTagName('head')[0];
			container.insertBefore(el, container.firstChild);
			sheet = (el.sheet || el.styleSheet);
			supported = sheet && !sheet.disabled;
			container.removeChild(el);
			return supported;
		}),

		removeClass: function(el, className) {
			var re = RegExp('(?:^|\\s+)' + className +  '(?=\\s|$)', 'g');
			el.className = el.className.replace(re, '');
			return el;
		},

		supports: function(property, value) {
			var checker = document.createElement('span').style;
			if (checker[property] === undefined) return false;
			checker[property] = value;
			return checker[property] === value;
		},

		textAlign: function(word, style, position, wordCount) {
			if (style.get('textAlign') == 'right') {
				if (position > 0) word = ' ' + word;
			}
			else if (position < wordCount - 1) word += ' ';
			return word;
		},

		textShadow: cached(function(value) {
			if (value == 'none') return null;
			var shadows = [], currentShadow = {}, result, offCount = 0;
			var re = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
			while (result = re.exec(value)) {
				if (result[0] == ',') {
					shadows.push(currentShadow);
					currentShadow = {};
					offCount = 0;
				}
				else if (result[1]) {
					currentShadow.color = result[1];
				}
				else {
					currentShadow[[ 'offX', 'offY', 'blur' ][offCount++]] = result[2];
				}
			}
			shadows.push(currentShadow);
			return shadows;
		}),

		textTransform: (function() {
			var map = {
				uppercase: function(s) {
					return s.toUpperCase();
				},
				lowercase: function(s) {
					return s.toLowerCase();
				},
				capitalize: function(s) {
					return s.replace(/\b./g, function($0) {
						return $0.toUpperCase();
					});
				}
			};
			return function(text, style) {
				var transform = map[style.get('textTransform')];
				return transform ? transform(text) : text;
			};
		})(),

		whiteSpace: (function() {
			var ignore = {
				inline: 1,
				'inline-block': 1,
				'run-in': 1
			};
			var wsStart = /^\s+/, wsEnd = /\s+$/;
			return function(text, style, node, previousElement) {
				if (previousElement) {
					if (previousElement.nodeName.toLowerCase() == 'br') {
						text = text.replace(wsStart, '');
					}
				}
				if (ignore[style.get('display')]) return text;
				if (!node.previousSibling) text = text.replace(wsStart, '');
				if (!node.nextSibling) text = text.replace(wsEnd, '');
				return text;
			};
		})()

	};

	CSS.ready = (function() {

		// don't do anything in Safari 2 (it doesn't recognize any media type)
		var complete = !CSS.recognizesMedia('all'), hasLayout = false;

		var queue = [], perform = function() {
			complete = true;
			for (var fn; fn = queue.shift(); fn());
		};

		var links = elementsByTagName('link'), styles = elementsByTagName('style');

		function isContainerReady(el) {
			return el.disabled || isSheetReady(el.sheet, el.media || 'screen');
		}

		function isSheetReady(sheet, media) {
			// in Opera sheet.disabled is true when it's still loading,
			// even though link.disabled is false. they stay in sync if
			// set manually.
			if (!CSS.recognizesMedia(media || 'all')) return true;
			if (!sheet || sheet.disabled) return false;
			try {
				var rules = sheet.cssRules, rule;
				if (rules) {
					// needed for Safari 3 and Chrome 1.0.
					// in standards-conforming browsers cssRules contains @-rules.
					// Chrome 1.0 weirdness: rules[<number larger than .length - 1>]
					// returns the last rule, so a for loop is the only option.
					search: for (var i = 0, l = rules.length; rule = rules[i], i < l; ++i) {
						switch (rule.type) {
							case 2: // @charset
								break;
							case 3: // @import
								if (!isSheetReady(rule.styleSheet, rule.media.mediaText)) return false;
								break;
							default:
								// only @charset can precede @import
								break search;
						}
					}
				}
			}
			catch (e) {} // probably a style sheet from another domain
			return true;
		}

		function allStylesLoaded() {
			// Internet Explorer's style sheet model, there's no need to do anything
			if (document.createStyleSheet) return true;
			// standards-compliant browsers
			var el, i;
			for (i = 0; el = links[i]; ++i) {
				if (el.rel.toLowerCase() == 'stylesheet' && !isContainerReady(el)) return false;
			}
			for (i = 0; el = styles[i]; ++i) {
				if (!isContainerReady(el)) return false;
			}
			return true;
		}

		DOM.ready(function() {
			// getComputedStyle returns null in Gecko if used in an iframe with display: none
			if (!hasLayout) hasLayout = CSS.getStyle(document.body).isUsable();
			if (complete || (hasLayout && allStylesLoaded())) perform();
			else setTimeout(arguments.callee, 10);
		});

		return function(listener) {
			if (complete) listener();
			else queue.push(listener);
		};

	})();

	function Font(data) {

		var face = this.face = data.face, wordSeparators = {
			'\u0020': 1,
			'\u00a0': 1,
			'\u3000': 1
		};

		this.glyphs = data.glyphs;
		this.w = data.w;
		this.baseSize = parseInt(face['units-per-em'], 10);

		this.family = face['font-family'].toLowerCase();
		this.weight = face['font-weight'];
		this.style = face['font-style'] || 'normal';

		this.viewBox = (function () {
			var parts = face.bbox.split(/\s+/);
			var box = {
				minX: parseInt(parts[0], 10),
				minY: parseInt(parts[1], 10),
				maxX: parseInt(parts[2], 10),
				maxY: parseInt(parts[3], 10)
			};
			box.width = box.maxX - box.minX;
			box.height = box.maxY - box.minY;
			box.toString = function() {
				return [ this.minX, this.minY, this.width, this.height ].join(' ');
			};
			return box;
		})();

		this.ascent = -parseInt(face.ascent, 10);
		this.descent = -parseInt(face.descent, 10);

		this.height = -this.ascent + this.descent;

		this.spacing = function(chars, letterSpacing, wordSpacing) {
			var glyphs = this.glyphs, glyph,
				kerning, k,
				jumps = [],
				width = 0, w,
				i = -1, j = -1, chr;
			while (chr = chars[++i]) {
				glyph = glyphs[chr] || this.missingGlyph;
				if (!glyph) continue;
				if (kerning) {
					width -= k = kerning[chr] || 0;
					jumps[j] -= k;
				}
				w = glyph.w;
				if (isNaN(w)) w = +this.w; // may have been a String in old fonts
				if (w > 0) {
					w += letterSpacing;
					if (wordSeparators[chr]) w += wordSpacing;
				}
				width += jumps[++j] = ~~w; // get rid of decimals
				kerning = glyph.k;
			}
			jumps.total = width;
			return jumps;
		};

	}

	function FontFamily() {

		var styles = {}, mapping = {
			oblique: 'italic',
			italic: 'oblique'
		};

		this.add = function(font) {
			(styles[font.style] || (styles[font.style] = {}))[font.weight] = font;
		};

		this.get = function(style, weight) {
			var weights = styles[style] || styles[mapping[style]]
				|| styles.normal || styles.italic || styles.oblique;
			if (!weights) return null;
			// we don't have to worry about "bolder" and "lighter"
			// because IE's currentStyle returns a numeric value for it,
			// and other browsers use the computed value anyway
			weight = {
				normal: 400,
				bold: 700
			}[weight] || parseInt(weight, 10);
			if (weights[weight]) return weights[weight];
			// http://www.w3.org/TR/CSS21/fonts.html#propdef-font-weight
			// Gecko uses x99/x01 for lighter/bolder
			var up = {
				1: 1,
				99: 0
			}[weight % 100], alts = [], min, max;
			if (up === undefined) up = weight > 400;
			if (weight == 500) weight = 400;
			for (var alt in weights) {
				if (!hasOwnProperty(weights, alt)) continue;
				alt = parseInt(alt, 10);
				if (!min || alt < min) min = alt;
				if (!max || alt > max) max = alt;
				alts.push(alt);
			}
			if (weight < min) weight = min;
			if (weight > max) weight = max;
			alts.sort(function(a, b) {
				return (up
					? (a >= weight && b >= weight) ? a < b : a > b
					: (a <= weight && b <= weight) ? a > b : a < b) ? -1 : 1;
			});
			return weights[alts[0]];
		};

	}

	function HoverHandler() {

		function contains(node, anotherNode) {
			try {
				if (node.contains) return node.contains(anotherNode);
				return node.compareDocumentPosition(anotherNode) & 16;
			}
			catch(e) {} // probably a XUL element such as a scrollbar
			return false;
		}

		function onOverOut(e) {
			var related = e.relatedTarget;
			// there might be no relatedTarget if the element is right next
			// to the window frame
			if (related && contains(this, related)) return;
			trigger(this, e.type == 'mouseover');
		}

		function onEnterLeave(e) {
			trigger(this, e.type == 'mouseenter');
		}

		function trigger(el, hoverState) {
			// A timeout is needed so that the event can actually "happen"
			// before replace is triggered. This ensures that styles are up
			// to date.
			setTimeout(function() {
				var options = sharedStorage.get(el).options;
				api.replace(el, hoverState ? merge(options, options.hover) : options, true);
			}, 10);
		}

		this.attach = function(el) {
			if (el.onmouseenter === undefined) {
				addEvent(el, 'mouseover', onOverOut);
				addEvent(el, 'mouseout', onOverOut);
			}
			else {
				addEvent(el, 'mouseenter', onEnterLeave);
				addEvent(el, 'mouseleave', onEnterLeave);
			}
		};

	}

	function ReplaceHistory() {

		var list = [], map = {};

		function filter(keys) {
			var values = [], key;
			for (var i = 0; key = keys[i]; ++i) values[i] = list[map[key]];
			return values;
		}

		this.add = function(key, args) {
			map[key] = list.push(args) - 1;
		};

		this.repeat = function() {
			var snapshot = arguments.length ? filter(arguments) : list, args;
			for (var i = 0; args = snapshot[i++];) api.replace(args[0], args[1], true);
		};

	}

	function Storage() {

		var map = {}, at = 0;

		function identify(el) {
			return el.cufid || (el.cufid = ++at);
		}

		this.get = function(el) {
			var id = identify(el);
			return map[id] || (map[id] = {});
		};

	}

	function Style(style) {

		var custom = {}, sizes = {};

		this.extend = function(styles) {
			for (var property in styles) {
				if (hasOwnProperty(styles, property)) custom[property] = styles[property];
			}
			return this;
		};

		this.get = function(property) {
			return custom[property] != undefined ? custom[property] : style[property];
		};

		this.getSize = function(property, base) {
			return sizes[property] || (sizes[property] = new CSS.Size(this.get(property), base));
		};

		this.isUsable = function() {
			return !!style;
		};

	}

	function addEvent(el, type, listener) {
		if (el.addEventListener) {
			el.addEventListener(type, listener, false);
		}
		else if (el.attachEvent) {
			el.attachEvent('on' + type, function() {
				return listener.call(el, window.event);
			});
		}
	}

	function attach(el, options) {
		var storage = sharedStorage.get(el);
		if (storage.options) return el;
		if (options.hover && options.hoverables[el.nodeName.toLowerCase()]) {
			hoverHandler.attach(el);
		}
		storage.options = options;
		return el;
	}

	function cached(fun) {
		var cache = {};
		return function(key) {
			if (!hasOwnProperty(cache, key)) cache[key] = fun.apply(null, arguments);
			return cache[key];
		};
	}

	function getFont(el, style) {
		var families = CSS.quotedList(style.get('fontFamily').toLowerCase()), family;
		for (var i = 0; family = families[i]; ++i) {
			if (fonts[family]) return fonts[family].get(style.get('fontStyle'), style.get('fontWeight'));
		}
		return null;
	}

	function elementsByTagName(query) {
		return document.getElementsByTagName(query);
	}

	function hasOwnProperty(obj, property) {
		return obj.hasOwnProperty(property);
	}

	function merge() {
		var merged = {}, arg, key;
		for (var i = 0, l = arguments.length; arg = arguments[i], i < l; ++i) {
			for (key in arg) {
				if (hasOwnProperty(arg, key)) merged[key] = arg[key];
			}
		}
		return merged;
	}

	function process(font, text, style, options, node, el) {
		var fragment = document.createDocumentFragment(), processed;
		if (text === '') return fragment;
		var separate = options.separate;
		var parts = text.split(separators[separate]), needsAligning = (separate == 'words');
		if (needsAligning && HAS_BROKEN_REGEXP) {
			// @todo figure out a better way to do this
			if (/^\s/.test(text)) parts.unshift('');
			if (/\s$/.test(text)) parts.push('');
		}
		for (var i = 0, l = parts.length; i < l; ++i) {
			processed = engines[options.engine](font,
				needsAligning ? CSS.textAlign(parts[i], style, i, l) : parts[i],
				style, options, node, el, i < l - 1);
			if (processed) fragment.appendChild(processed);
		}
		return fragment;
	}

	function replaceElement(el, options) {
		var name = el.nodeName.toLowerCase();
		if (options.ignore[name]) return;
		var replace = !options.textless[name];
		var style = CSS.getStyle(attach(el, options)).extend(options);
		var font = getFont(el, style), node, type, next, anchor, text, lastElement;
		if (!font) return;
		for (node = el.firstChild; node; node = next) {
			type = node.nodeType;
			next = node.nextSibling;
			if (replace && type == 3) {
				// Node.normalize() is broken in IE 6, 7, 8
				if (anchor) {
					anchor.appendData(node.data);
					el.removeChild(node);
				}
				else anchor = node;
				if (next) continue;
			}
			if (anchor) {
				el.replaceChild(process(font,
					CSS.whiteSpace(anchor.data, style, anchor, lastElement),
					style, options, node, el), anchor);
				anchor = null;
			}
			if (type == 1) {
				if (node.firstChild) {
					if (node.nodeName.toLowerCase() == 'cufon') {
						engines[options.engine](font, null, style, options, node, el);
					}
					else arguments.callee(node, options);
				}
				lastElement = node;
			}
		}
	}

	var HAS_BROKEN_REGEXP = ' '.split(/\s+/).length == 0;

	var sharedStorage = new Storage();
	var hoverHandler = new HoverHandler();
	var replaceHistory = new ReplaceHistory();
	var initialized = false;

	var engines = {}, fonts = {}, defaultOptions = {
		autoDetect: false,
		engine: null,
		//fontScale: 1,
		//fontScaling: false,
		forceHitArea: false,
		hover: false,
		hoverables: {
			a: true
		},
		ignore: {
			applet: 1,
			canvas: 1,
			col: 1,
			colgroup: 1,
			head: 1,
			iframe: 1,
			map: 1,
			noscript: 1,
			optgroup: 1,
			option: 1,
			script: 1,
			select: 1,
			style: 1,
			textarea: 1,
			title: 1,
			pre: 1
		},
		printable: true,
		//rotation: 0,
		//selectable: false,
		selector: (
				window.Sizzle
			||	(window.jQuery && function(query) { return jQuery(query); }) // avoid noConflict issues
			||	(window.dojo && dojo.query)
			||	(window.glow && glow.dom && glow.dom.get)
			||	(window.Ext && Ext.query)
			||	(window.YAHOO && YAHOO.util && YAHOO.util.Selector && YAHOO.util.Selector.query)
			||	(window.$$ && function(query) { return $$(query); })
			||	(window.$ && function(query) { return $(query); })
			||	(document.querySelectorAll && function(query) { return document.querySelectorAll(query); })
			||	elementsByTagName
		),
		separate: 'words', // 'none' and 'characters' are also accepted
		textless: {
			dl: 1,
			html: 1,
			ol: 1,
			table: 1,
			tbody: 1,
			thead: 1,
			tfoot: 1,
			tr: 1,
			ul: 1
		},
		textShadow: 'none'
	};

	var separators = {
		// The first pattern may cause unicode characters above
		// code point 255 to be removed in Safari 3.0. Luckily enough
		// Safari 3.0 does not include non-breaking spaces in \s, so
		// we can just use a simple alternative pattern.
		words: /\s/.test('\u00a0') ? /[^\S\u00a0]+/ : /\s+/,
		characters: '',
		none: /^/
	};

	api.now = function() {
		DOM.ready();
		return api;
	};

	api.refresh = function() {
		replaceHistory.repeat.apply(replaceHistory, arguments);
		return api;
	};

	api.registerEngine = function(id, engine) {
		if (!engine) return api;
		engines[id] = engine;
		return api.set('engine', id);
	};

	api.registerFont = function(data) {
		if (!data) return api;
		var font = new Font(data), family = font.family;
		if (!fonts[family]) fonts[family] = new FontFamily();
		fonts[family].add(font);
		return api.set('fontFamily', '"' + family + '"');
	};

	api.replace = function(elements, options, ignoreHistory) {
		options = merge(defaultOptions, options);
		if (!options.engine) return api; // there's no browser support so we'll just stop here
		if (!initialized) {
			CSS.addClass(DOM.root(), 'cufon-active cufon-loading');
			CSS.ready(function() {
				// fires before any replace() calls, but it doesn't really matter
				CSS.addClass(CSS.removeClass(DOM.root(), 'cufon-loading'), 'cufon-ready');
			});
			initialized = true;
		}
		if (options.hover) options.forceHitArea = true;
		if (options.autoDetect) delete options.fontFamily;
		if (typeof options.textShadow == 'string') {
			options.textShadow = CSS.textShadow(options.textShadow);
		}
		if (typeof options.color == 'string' && /^-/.test(options.color)) {
			options.textGradient = CSS.gradient(options.color);
		}
		else delete options.textGradient;
		if (!ignoreHistory) replaceHistory.add(elements, arguments);
		if (elements.nodeType || typeof elements == 'string') elements = [ elements ];
		CSS.ready(function() {
			for (var i = 0, l = elements.length; i < l; ++i) {
				var el = elements[i];
				if (typeof el == 'string') api.replace(options.selector(el), options, true);
				else replaceElement(el, options);
			}
		});
		return api;
	};

	api.set = function(option, value) {
		defaultOptions[option] = value;
		return api;
	};

	return api;

})();

Cufon.registerEngine('canvas', (function() {

	// Safari 2 doesn't support .apply() on native methods

	var check = document.createElement('canvas');
	if (!check || !check.getContext || !check.getContext.apply) return;
	check = null;

	var HAS_INLINE_BLOCK = Cufon.CSS.supports('display', 'inline-block');

	// Firefox 2 w/ non-strict doctype (almost standards mode)
	var HAS_BROKEN_LINEHEIGHT = !HAS_INLINE_BLOCK && (document.compatMode == 'BackCompat' || /frameset|transitional/i.test(document.doctype.publicId));

	var styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.appendChild(document.createTextNode((
		'cufon{text-indent:0;}' +
		'@media screen,projection{' +
			'cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;' +
			(HAS_BROKEN_LINEHEIGHT
				? ''
				: 'font-size:1px;line-height:1px;') +
			'}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;text-indent:-10000in;}' +
			(HAS_INLINE_BLOCK
				? 'cufon canvas{position:relative;}'
				: 'cufon canvas{position:absolute;}') +
		'}' +
		'@media print{' +
			'cufon{padding:0;}' + // Firefox 2
			'cufon canvas{display:none;}' +
		'}'
	).replace(/;/g, '!important;')));
	document.getElementsByTagName('head')[0].appendChild(styleSheet);

	function generateFromVML(path, context) {
		var atX = 0, atY = 0;
		var code = [], re = /([mrvxe])([^a-z]*)/g, match;
		generate: for (var i = 0; match = re.exec(path); ++i) {
			var c = match[2].split(',');
			switch (match[1]) {
				case 'v':
					code[i] = { m: 'bezierCurveTo', a: [ atX + ~~c[0], atY + ~~c[1], atX + ~~c[2], atY + ~~c[3], atX += ~~c[4], atY += ~~c[5] ] };
					break;
				case 'r':
					code[i] = { m: 'lineTo', a: [ atX += ~~c[0], atY += ~~c[1] ] };
					break;
				case 'm':
					code[i] = { m: 'moveTo', a: [ atX = ~~c[0], atY = ~~c[1] ] };
					break;
				case 'x':
					code[i] = { m: 'closePath' };
					break;
				case 'e':
					break generate;
			}
			context[code[i].m].apply(context, code[i].a);
		}
		return code;
	}

	function interpret(code, context) {
		for (var i = 0, l = code.length; i < l; ++i) {
			var line = code[i];
			context[line.m].apply(context, line.a);
		}
	}

	return function(font, text, style, options, node, el) {

		var redraw = (text === null);

		if (redraw) text = node.getAttribute('alt');

		var viewBox = font.viewBox;

		var size = style.getSize('fontSize', font.baseSize);

		var expandTop = 0, expandRight = 0, expandBottom = 0, expandLeft = 0;
		var shadows = options.textShadow, shadowOffsets = [];
		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				var x = size.convertFrom(parseFloat(shadow.offX));
				var y = size.convertFrom(parseFloat(shadow.offY));
				shadowOffsets[i] = [ x, y ];
				if (y < expandTop) expandTop = y;
				if (x > expandRight) expandRight = x;
				if (y > expandBottom) expandBottom = y;
				if (x < expandLeft) expandLeft = x;
			}
		}

		var chars = Cufon.CSS.textTransform(text, style).split('');

		var jumps = font.spacing(chars,
			~~size.convertFrom(parseFloat(style.get('letterSpacing')) || 0),
			~~size.convertFrom(parseFloat(style.get('wordSpacing')) || 0)
		);

		if (!jumps.length) return null; // there's nothing to render

		var width = jumps.total;

		expandRight += viewBox.width - jumps[jumps.length - 1];
		expandLeft += viewBox.minX;

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-canvas';
			wrapper.setAttribute('alt', text);

			canvas = document.createElement('canvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height);
		var roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var stretchedWidth = width * stretchFactor;

		var canvasWidth = Math.ceil(size.convert(stretchedWidth + expandRight - expandLeft));
		var canvasHeight = Math.ceil(size.convert(viewBox.height - expandTop + expandBottom));

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// needed for WebKit and full page zoom
		cStyle.width = canvasWidth + 'px';
		cStyle.height = canvasHeight + 'px';

		// minY has no part in canvas.height
		expandTop += viewBox.minY;

		cStyle.top = Math.round(size.convert(expandTop - font.ascent)) + 'px';
		cStyle.left = Math.round(size.convert(expandLeft)) + 'px';

		var wrapperWidth = Math.max(Math.ceil(size.convert(stretchedWidth)), 0) + 'px';

		if (HAS_INLINE_BLOCK) {
			wStyle.width = wrapperWidth;
			wStyle.height = size.convert(font.height) + 'px';
		}
		else {
			wStyle.paddingLeft = wrapperWidth;
			wStyle.paddingBottom = (size.convert(font.height) - 1) + 'px';
		}

		var g = canvas.getContext('2d'), scale = height / viewBox.height;

		// proper horizontal scaling is performed later
		g.scale(scale, scale * roundingFactor);
		g.translate(-expandLeft, -expandTop);
		g.save();

		function renderText() {
			var glyphs = font.glyphs, glyph, i = -1, j = -1, chr;
			g.scale(stretchFactor, 1);
			while (chr = chars[++i]) {
				var glyph = glyphs[chars[i]] || font.missingGlyph;
				if (!glyph) continue;
				if (glyph.d) {
					g.beginPath();
					if (glyph.code) interpret(glyph.code, g);
					else glyph.code = generateFromVML('m' + glyph.d, g);
					g.fill();
				}
				g.translate(jumps[++j], 0);
			}
			g.restore();
		}

		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				g.save();
				g.fillStyle = shadow.color;
				g.translate.apply(g, shadowOffsets[i]);
				renderText();
			}
		}

		var gradient = options.textGradient;
		if (gradient) {
			var stops = gradient.stops, fill = g.createLinearGradient(0, viewBox.minY, 0, viewBox.maxY);
			for (var i = 0, l = stops.length; i < l; ++i) {
				fill.addColorStop.apply(fill, stops[i]);
			}
			g.fillStyle = fill;
		}
		else g.fillStyle = style.get('color');

		renderText();

		return wrapper;

	};

})());

Cufon.registerEngine('vml', (function() {

	var ns = document.namespaces;
	if (!ns) return;
	ns.add('cvml', 'urn:schemas-microsoft-com:vml');
	ns = null;

	var check = document.createElement('cvml:shape');
	check.style.behavior = 'url(#default#VML)';
	if (!check.coordsize) return; // VML isn't supported
	check = null;

	var HAS_BROKEN_LINEHEIGHT = (document.documentMode || 0) < 8;

	document.write(('<style type="text/css">' +
		'cufoncanvas{text-indent:0;}' +
		'@media screen{' +
			'cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}' +
			'cufoncanvas{position:absolute;text-align:left;}' +
			'cufon{display:inline-block;position:relative;vertical-align:' +
			(HAS_BROKEN_LINEHEIGHT
				? 'middle'
				: 'text-bottom') +
			';}' +
			'cufon cufontext{position:absolute;left:-10000in;font-size:1px;}' +
			'a cufon{cursor:pointer}' + // ignore !important here
		'}' +
		'@media print{' +
			'cufon cufoncanvas{display:none;}' +
		'}' +
	'</style>').replace(/;/g, '!important;'));

	function getFontSizeInPixels(el, value) {
		return getSizeInPixels(el, /(?:em|ex|%)$|^[a-z-]+$/i.test(value) ? '1em' : value);
	}

	// Original by Dead Edwards.
	// Combined with getFontSizeInPixels it also works with relative units.
	function getSizeInPixels(el, value) {
		if (!isNaN(value) || /px$/i.test(value)) return parseFloat(value);
		var style = el.style.left, runtimeStyle = el.runtimeStyle.left;
		el.runtimeStyle.left = el.currentStyle.left;
		el.style.left = value.replace('%', 'em');
		var result = el.style.pixelLeft;
		el.style.left = style;
		el.runtimeStyle.left = runtimeStyle;
		return result;
	}

	function getSpacingValue(el, style, size, property) {
		var key = 'computed' + property, value = style[key];
		if (isNaN(value)) {
			value = style.get(property);
			style[key] = value = (value == 'normal') ? 0 : ~~size.convertFrom(getSizeInPixels(el, value));
		}
		return value;
	}

	var fills = {};

	function gradientFill(gradient) {
		var id = gradient.id;
		if (!fills[id]) {
			var stops = gradient.stops, fill = document.createElement('cvml:fill'), colors = [];
			fill.type = 'gradient';
			fill.angle = 180;
			fill.focus = '0';
			fill.method = 'none';
			fill.color = stops[0][1];
			for (var j = 1, k = stops.length - 1; j < k; ++j) {
				colors.push(stops[j][0] * 100 + '% ' + stops[j][1]);
			}
			fill.colors = colors.join(',');
			fill.color2 = stops[k][1];
			fills[id] = fill;
		}
		return fills[id];
	}

	return function(font, text, style, options, node, el, hasNext) {

		var redraw = (text === null);

		if (redraw) text = node.alt;

		var viewBox = font.viewBox;

		var size = style.computedFontSize || (style.computedFontSize = new Cufon.CSS.Size(getFontSizeInPixels(el, style.get('fontSize')) + 'px', font.baseSize));

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-vml';
			wrapper.alt = text;

			canvas = document.createElement('cufoncanvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}

			// ie6, for some reason, has trouble rendering the last VML element in the document.
			// we can work around this by injecting a dummy element where needed.
			// @todo find a better solution
			if (!hasNext) wrapper.appendChild(document.createElement('cvml:shape'));
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height), roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var minX = viewBox.minX, minY = viewBox.minY;

		cStyle.height = roundedHeight;
		cStyle.top = Math.round(size.convert(minY - font.ascent));
		cStyle.left = Math.round(size.convert(minX));

		wStyle.height = size.convert(font.height) + 'px';

		var color = style.get('color');
		var chars = Cufon.CSS.textTransform(text, style).split('');

		var jumps = font.spacing(chars,
			getSpacingValue(el, style, size, 'letterSpacing'),
			getSpacingValue(el, style, size, 'wordSpacing')
		);

		if (!jumps.length) return null;

		var width = jumps.total;
		var fullWidth = -minX + width + (viewBox.width - jumps[jumps.length - 1]);

		var shapeWidth = size.convert(fullWidth * stretchFactor), roundedShapeWidth = Math.round(shapeWidth);

		var coordSize = fullWidth + ',' + viewBox.height, coordOrigin;
		var stretch = 'r' + coordSize + 'ns';

		var fill = options.textGradient && gradientFill(options.textGradient);

		var glyphs = font.glyphs, offsetX = 0;
		var shadows = options.textShadow;
		var i = -1, j = 0, chr;

		while (chr = chars[++i]) {

			var glyph = glyphs[chars[i]] || font.missingGlyph, shape;
			if (!glyph) continue;

			if (redraw) {
				// some glyphs may be missing so we can't use i
				shape = canvas.childNodes[j];
				while (shape.firstChild) shape.removeChild(shape.firstChild); // shadow, fill
			}
			else {
				shape = document.createElement('cvml:shape');
				canvas.appendChild(shape);
			}

			shape.stroked = 'f';
			shape.coordsize = coordSize;
			shape.coordorigin = coordOrigin = (minX - offsetX) + ',' + minY;
			shape.path = (glyph.d ? 'm' + glyph.d + 'xe' : '') + 'm' + coordOrigin + stretch;
			shape.fillcolor = color;

			if (fill) shape.appendChild(fill.cloneNode(false));

			// it's important to not set top/left or IE8 will grind to a halt
			var sStyle = shape.style;
			sStyle.width = roundedShapeWidth;
			sStyle.height = roundedHeight;

			if (shadows) {
				// due to the limitations of the VML shadow element there
				// can only be two visible shadows. opacity is shared
				// for all shadows.
				var shadow1 = shadows[0], shadow2 = shadows[1];
				var color1 = Cufon.CSS.color(shadow1.color), color2;
				var shadow = document.createElement('cvml:shadow');
				shadow.on = 't';
				shadow.color = color1.color;
				shadow.offset = shadow1.offX + ',' + shadow1.offY;
				if (shadow2) {
					color2 = Cufon.CSS.color(shadow2.color);
					shadow.type = 'double';
					shadow.color2 = color2.color;
					shadow.offset2 = shadow2.offX + ',' + shadow2.offY;
				}
				shadow.opacity = color1.opacity || (color2 && color2.opacity) || 1;
				shape.appendChild(shadow);
			}

			offsetX += jumps[j++];
		}

		// addresses flickering issues on :hover

		var cover = shape.nextSibling, coverFill, vStyle;

		if (options.forceHitArea) {

			if (!cover) {
				cover = document.createElement('cvml:rect');
				cover.stroked = 'f';
				cover.className = 'cufon-vml-cover';
				coverFill = document.createElement('cvml:fill');
				coverFill.opacity = 0;
				cover.appendChild(coverFill);
				canvas.appendChild(cover);
			}

			vStyle = cover.style;

			vStyle.width = roundedShapeWidth;
			vStyle.height = roundedHeight;

		}
		else if (cover) canvas.removeChild(cover);

		wStyle.width = Math.max(Math.ceil(size.convert(width * stretchFactor)), 0);

		if (HAS_BROKEN_LINEHEIGHT) {

			var yAdjust = style.computedYAdjust;

			if (yAdjust === undefined) {
				var lineHeight = style.get('lineHeight');
				if (lineHeight == 'normal') lineHeight = '1em';
				else if (!isNaN(lineHeight)) lineHeight += 'em'; // no unit
				style.computedYAdjust = yAdjust = 0.5 * (getSizeInPixels(el, lineHeight) - parseFloat(wStyle.height));
			}

			if (yAdjust) {
				wStyle.marginTop = Math.ceil(yAdjust) + 'px';
				wStyle.marginBottom = yAdjust + 'px';
			}

		}

		return wrapper;

	};

})());


/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Manufacturer:
 * Dalton Maag Ltd.
 */
Cufon.registerFont({"w":180,"face":{"font-family":"aller","font-weight":400,"font-stretch":"normal","units-per-em":"300","panose-1":"2 0 5 3 3 0 0 2 0 4","ascent":"240","descent":"-60","x-height":"4","bbox":"-12 -245.155 300.889 75","underline-thickness":"15","underline-position":"-15","unicode-range":"U+0020-U+2122"},"glyphs":{" ":{"w":71},"%":{"d":"70,-110v21,0,28,-19,28,-42v0,-24,-5,-42,-28,-42v-22,0,-29,18,-29,42v1,24,6,42,29,42xm70,-88v-38,0,-57,-26,-57,-64v0,-38,18,-64,57,-64v38,0,56,25,56,64v0,39,-19,64,-56,64xm244,-18v21,0,28,-19,28,-42v0,-24,-5,-42,-28,-42v-22,0,-29,18,-29,42v1,24,6,42,29,42xm244,3v-39,0,-57,-26,-57,-63v0,-38,18,-64,57,-64v38,0,56,25,56,64v0,38,-18,63,-56,63xm215,-212v10,-2,21,-2,31,0r-145,212v-10,1,-21,2,-31,0","w":315},"&":{"d":"121,-191v-26,-8,-65,-7,-65,25v0,42,62,25,101,28v11,-12,16,-30,30,-38r0,38r39,0v0,8,2,17,0,24r-39,0v8,77,-19,120,-89,118v-46,-2,-81,-19,-81,-65v0,-31,17,-51,39,-61v-17,-8,-31,-20,-31,-45v-2,-51,59,-60,102,-46v0,9,-3,16,-6,22xm50,-66v0,30,21,43,51,43v52,2,61,-36,57,-90v-53,-2,-109,-5,-108,47","w":228},"'":{"d":"19,-216v10,0,20,-2,29,0r0,82v-9,2,-20,1,-29,0r0,-82","w":66},"(":{"d":"81,-233v-46,64,-48,219,0,283v-10,0,-21,2,-30,0v-47,-65,-47,-218,0,-283v10,0,21,-2,30,0","w":95},")":{"d":"44,-233v48,65,48,219,0,283v-9,0,-21,2,-29,0v46,-66,46,-217,0,-283v10,0,20,-2,29,0","w":95},"*":{"d":"64,-216v6,-2,12,-1,18,0r3,39v-8,0,-17,2,-24,0xm55,-173v-1,8,-4,15,-7,22r-37,-14v1,-6,3,-12,6,-18xm50,-144v7,4,13,7,19,13r-25,31v-7,-3,-10,-7,-15,-12xm128,-183v3,6,5,12,6,18r-36,14v-3,-7,-6,-14,-7,-22xm116,-112v-5,5,-8,9,-15,12r-25,-31r19,-13","w":145},"+":{"d":"77,-92r-50,0v-1,-8,-2,-19,0,-27r50,0r0,-54v9,-2,18,-2,27,0r0,54r49,0v0,9,2,19,0,27r-49,0r0,54v-9,1,-19,2,-27,0r0,-54"},",":{"d":"24,-33v10,-1,18,-2,29,0r-19,67v-9,0,-19,2,-28,0","w":63},"-":{"d":"93,-98v0,9,2,19,0,28r-78,0v0,-9,-2,-19,0,-28r78,0","w":108},".":{"d":"53,0v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34","w":72},"\/":{"d":"83,-216v10,0,20,-2,29,0r-73,216v-10,0,-20,2,-29,0","w":123},"0":{"d":"15,-96v0,-56,19,-100,76,-100v55,0,75,43,75,100v0,56,-21,100,-76,100v-54,0,-75,-43,-75,-100xm134,-96v0,-42,-10,-74,-44,-74v-34,0,-44,33,-44,74v0,41,10,73,44,73v34,0,44,-32,44,-73"},"1":{"d":"41,-135v-6,-7,-8,-12,-11,-22v29,-12,53,-29,84,-38r0,169r43,0v2,10,1,17,0,26r-117,0v-2,-8,-3,-18,0,-26r45,0r0,-128"},"2":{"d":"22,-184v40,-21,127,-18,122,44v-3,52,-45,80,-71,114r79,0v2,9,2,18,0,26r-133,0r-2,-4v30,-40,70,-72,93,-118v23,-46,-47,-58,-80,-37v-3,-7,-8,-16,-8,-25"},"3":{"d":"24,-13v36,16,99,12,99,-37v0,-32,-36,-41,-69,-34r-2,-4r50,-79r-77,0v-3,-8,-2,-18,0,-27r121,0r2,4r-54,83v37,0,58,20,59,55v3,70,-79,88,-139,64v2,-9,6,-18,10,-25"},"4":{"d":"12,-23r-2,-4r88,-172v10,0,19,5,26,10r-70,139r61,0r0,-57v10,0,20,-2,29,0r0,57r27,0v0,9,2,19,0,27r-27,0r0,41v-10,1,-19,0,-29,0r0,-41r-103,0"},"5":{"d":"66,-113v50,-10,87,14,87,62v0,69,-76,86,-134,64v2,-9,4,-18,8,-25v37,14,95,10,95,-38v0,-41,-48,-47,-82,-35r-3,-3r4,-106r102,0v0,9,2,19,0,27r-75,0"},"6":{"d":"93,4v-90,6,-86,-128,-46,-179v19,-24,47,-40,87,-43v3,9,2,16,1,25v-49,6,-76,36,-84,83v9,-15,26,-28,51,-27v41,1,64,27,64,69v0,46,-30,69,-73,72xm135,-68v0,-28,-13,-44,-41,-44v-27,1,-42,19,-42,45v0,28,13,45,40,45v28,0,43,-19,43,-46"},"7":{"d":"74,22v-12,-2,-20,-6,-28,-12r76,-177r-101,0v0,-9,-2,-19,0,-27r143,0v-23,73,-62,144,-90,216"},"8":{"d":"154,-164v1,26,-17,41,-35,50v24,10,45,26,45,59v0,43,-34,59,-74,59v-40,0,-74,-16,-74,-59v0,-33,21,-49,44,-59v-18,-9,-35,-24,-34,-50v1,-35,28,-52,64,-52v36,0,62,17,64,52xm90,-22v48,4,54,-60,17,-73v-25,-16,-58,7,-59,37v0,25,16,34,42,36xm90,-191v-40,-3,-46,51,-13,60v21,12,48,-6,48,-31v-1,-19,-14,-27,-35,-29"},"9":{"d":"88,-196v91,-7,87,127,47,178v-19,24,-47,41,-87,44v-4,-6,-2,-16,-2,-25v49,-6,79,-36,85,-84v-24,49,-122,30,-115,-41v5,-45,29,-69,72,-72xm47,-124v0,27,13,44,40,44v28,-1,43,-18,43,-45v0,-28,-13,-45,-41,-45v-26,0,-43,18,-42,46"},":":{"d":"53,-121v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34xm53,0v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34","w":72},";":{"d":"27,-33v10,-1,18,-2,29,0r-19,67v-9,0,-19,2,-28,0xm58,-121v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34","w":78},"<":{"d":"153,-170v3,11,1,18,1,29r-99,38r99,36v1,10,1,21,-1,30r-125,-50v-1,-10,-2,-22,0,-32"},"=":{"d":"154,-89v1,9,0,17,0,27r-128,0r0,-27r128,0xm154,-147v1,10,0,18,0,28r-128,0r0,-28r128,0"},">":{"d":"27,-37v0,-9,-2,-19,0,-28r98,-38r-98,-37v-2,-10,-2,-21,0,-30r125,51v2,11,3,21,0,32"},"?":{"d":"135,-158v-2,36,-26,53,-52,63r0,31v-9,0,-19,2,-28,0r0,-49v24,-8,47,-14,48,-44v2,-37,-55,-38,-83,-26v-4,-8,-5,-15,-7,-25v49,-18,125,-8,122,50xm86,0v-27,6,-43,0,-34,-34v11,0,23,-2,34,0v1,12,0,22,0,34","w":146},"@":{"d":"178,-219v67,0,108,34,110,101v2,65,-53,122,-115,92v-32,21,-91,13,-89,-37v3,-70,59,-110,130,-87r-21,107v43,17,69,-32,68,-75v-1,-51,-34,-79,-86,-78v-81,2,-125,51,-130,131v-5,79,72,102,138,80r6,21v-80,29,-178,-7,-172,-100v6,-95,61,-155,161,-155xm113,-68v-2,30,29,34,53,24r16,-87v-43,-9,-66,23,-69,63","w":304},"A":{"d":"133,-50r-82,0r-15,50v-10,0,-22,2,-31,0r70,-216v12,0,24,-2,35,0r70,216v-10,0,-23,2,-32,0xm59,-76r65,0r-32,-111","w":185},"B":{"d":"165,-60v1,66,-77,69,-138,60r0,-216v54,-7,127,-7,125,53v-1,25,-14,42,-35,47v28,6,48,21,48,56xm133,-61v0,-38,-35,-41,-76,-39r0,76v36,5,76,2,76,-37xm121,-161v0,-30,-31,-38,-64,-33r0,68v35,2,64,-2,64,-35","w":178},"C":{"d":"51,-106v0,69,55,99,113,74v4,9,7,17,8,25v-76,32,-154,-11,-154,-99v0,-88,70,-133,151,-105v-1,10,-4,17,-7,25v-60,-22,-111,10,-111,80","w":185},"D":{"d":"192,-107v0,96,-74,122,-165,107r0,-216v95,-14,165,15,165,109xm160,-108v0,-63,-40,-92,-103,-82r0,165v66,8,103,-18,103,-83","w":209},"E":{"d":"26,-216r119,0v0,9,2,19,0,27r-88,0r0,62r70,0v0,9,2,19,0,27r-70,0r0,73r90,0v0,9,2,19,0,27r-121,0r0,-216","w":160},"F":{"d":"26,-216r113,0v0,9,2,19,0,27r-82,0r0,63r69,0v0,9,2,19,0,27r-69,0r0,99v-10,0,-22,2,-31,0r0,-216","w":151},"G":{"d":"50,-106v0,60,39,93,101,79r0,-85v11,-1,20,0,31,0r0,106v-82,29,-164,-7,-164,-100v0,-88,71,-132,153,-105v-1,10,-4,17,-7,25v-62,-22,-114,12,-114,80","w":204},"H":{"d":"26,-216v10,0,22,-2,31,0r0,89r92,0r0,-89v10,0,21,-2,30,0r0,216v-10,0,-21,2,-30,0r0,-100r-92,0r0,100v-10,0,-22,2,-31,0r0,-216","w":205},"I":{"d":"26,-216v10,0,22,-2,31,0r0,216v-10,0,-22,2,-31,0r0,-216","w":83},"J":{"d":"13,-26v23,7,50,2,50,-27r0,-136r-37,0v-2,-9,-2,-18,0,-27r68,0r0,156v5,54,-39,73,-86,60","w":118},"K":{"d":"66,-110r69,-106v11,0,23,-2,34,0r-69,104r77,112v-12,0,-24,2,-35,0xm26,-216v10,0,22,-2,31,0r0,216v-10,0,-22,2,-31,0r0,-216"},"L":{"d":"26,-216v10,0,22,-2,31,0r0,189r84,0v1,9,2,19,0,27r-115,0r0,-216","w":148},"M":{"d":"32,-216v11,0,25,-2,35,0r56,135r56,-135v11,0,23,-2,33,0r10,216v-10,0,-21,2,-30,0r-7,-168r-52,123v-8,1,-16,2,-24,0r-51,-124r-7,169v-9,0,-19,2,-28,0","w":244},"N":{"d":"26,-216v10,0,20,-2,29,0r93,162r0,-162v10,0,21,-2,30,0r0,216v-10,0,-20,2,-29,0r-94,-161r0,161v-10,0,-20,2,-29,0r0,-216","w":204},"O":{"d":"200,-108v0,66,-26,112,-90,112v-65,0,-92,-47,-92,-112v0,-64,26,-111,92,-111v65,0,90,46,90,111xm51,-108v0,47,13,85,59,85v45,0,58,-38,58,-85v0,-46,-13,-84,-58,-84v-46,0,-59,37,-59,84","w":218},"P":{"d":"158,-150v0,58,-43,77,-101,72r0,78v-10,0,-22,2,-31,0r0,-216v66,-8,132,-5,132,66xm127,-149v0,-38,-31,-48,-70,-43r0,87v40,5,70,-5,70,-44","w":169},"Q":{"d":"202,20v0,11,-2,18,-5,26r-69,-13v1,-11,3,-17,6,-25xm200,-108v0,65,-27,112,-91,112v-65,0,-92,-47,-92,-112v0,-64,26,-111,92,-111v65,1,91,47,91,111xm50,-108v0,47,13,85,59,85v45,0,58,-37,58,-85v0,-48,-13,-84,-58,-84v-46,0,-59,37,-59,84","w":217},"R":{"d":"124,-151v1,-35,-30,-48,-66,-41r0,192v-10,0,-22,2,-31,0r0,-216v69,-13,150,7,126,84v-6,20,-24,32,-42,41r62,91v-10,1,-24,2,-34,0r-69,-101v26,-8,53,-18,54,-50","w":179},"S":{"d":"147,-86v26,80,-71,107,-133,80v0,-9,3,-20,7,-27v39,24,127,0,86,-53v-30,-23,-87,-19,-87,-75v0,-58,70,-68,120,-50v-1,8,-3,17,-6,25v-34,-20,-109,-2,-73,43v27,20,75,22,86,57","w":163},"T":{"d":"64,-189r-56,0v-2,-9,-2,-18,0,-27r142,0v2,9,2,18,0,27r-56,0r0,189v-10,2,-21,1,-30,0r0,-189","w":157},"U":{"d":"101,4v-102,0,-73,-125,-77,-220v10,-1,21,-2,31,0r0,123v-1,40,7,70,46,69v76,-2,36,-122,46,-192v10,-2,21,-1,31,0v-4,95,26,220,-77,220","w":202},"V":{"d":"7,-216v11,0,23,-2,33,0r55,185r54,-185v10,-2,22,0,33,0r-70,216v-12,0,-25,2,-36,0","w":188},"W":{"d":"8,-216v11,0,24,-2,34,0r37,180r44,-180v10,0,23,-2,32,0r45,182r38,-182v10,0,21,-2,30,0r-52,216v-12,0,-24,2,-35,0r-43,-169r-43,169v-11,0,-25,2,-35,0","w":276},"X":{"d":"90,-113r-51,113v-12,2,-21,1,-33,0r54,-113r-45,-102v11,-1,21,-2,32,0xm92,-113r43,-102v11,0,23,-2,32,0r-45,101r54,114v-12,2,-19,1,-32,0","w":182},"Y":{"d":"74,-79r-69,-137v12,0,25,-2,35,0r50,107r50,-107v11,0,22,-2,32,0r-67,137r0,79v-10,0,-22,2,-31,0r0,-79","w":177},"Z":{"d":"7,-3r109,-186r-95,0v0,-9,-2,-19,0,-27r140,0r2,3r-109,186r101,0v0,9,2,19,0,27r-146,0","w":169},"[":{"d":"15,-228r65,0v1,8,0,16,0,24r-36,0r0,230r36,0v1,8,0,15,0,24r-65,0r0,-278","w":95},"\\":{"d":"112,0v-10,0,-20,2,-29,0r-73,-216v9,0,21,-2,29,0","w":123},"]":{"d":"16,50v-2,-7,-1,-18,0,-24r35,0r0,-229r-35,0v-1,-8,-2,-17,0,-25r65,0r0,278r-65,0","w":95},"^":{"d":"67,-216v10,0,22,-2,31,0r48,106r-28,0r-36,-80r-36,80r-28,0","w":165},"_":{"d":"150,4v1,6,2,16,0,22r-148,0v-2,-7,-2,-15,0,-22r148,0","w":151},"`":{"d":"39,-216v13,-2,25,-2,38,0r34,38v-10,0,-21,2,-30,0","w":150},"a":{"d":"105,-72v-52,-23,-90,51,-27,52v9,-1,19,-1,27,-3r0,-49xm14,-46v2,-43,43,-55,91,-50v6,-43,-42,-41,-72,-31v-4,-7,-6,-15,-6,-24v47,-14,107,-9,107,51r0,96v-45,12,-122,16,-120,-42","w":155},"b":{"d":"161,-81v4,74,-73,101,-137,76r0,-215v9,0,21,-2,29,0r0,85v8,-13,24,-23,45,-23v44,0,61,31,63,77xm92,-132v-49,-1,-38,60,-39,107v42,12,79,-10,77,-55v-1,-31,-10,-51,-38,-52","w":177},"c":{"d":"46,-77v0,49,41,67,81,50v4,6,5,15,6,24v-59,22,-118,-7,-118,-74v0,-64,57,-95,116,-74v-1,7,-2,17,-5,23v-41,-15,-80,4,-80,51","w":143},"d":{"d":"16,-74v0,-62,47,-94,107,-79r0,-67v9,0,21,-2,29,0r0,216v-62,19,-136,6,-136,-70xm47,-74v0,46,34,60,76,50r0,-104v-41,-15,-76,8,-76,54","w":175},"e":{"d":"87,-158v48,0,70,37,64,88r-105,0v-4,50,50,57,90,42v4,6,6,15,6,23v-58,24,-127,1,-127,-71v0,-50,24,-82,72,-82xm122,-92v5,-38,-42,-54,-64,-31v-6,7,-11,18,-12,31r76,0","w":166},"f":{"d":"110,-196v-30,-8,-52,5,-46,42r40,0r0,24r-40,0r0,130v-10,0,-21,2,-30,0r0,-130r-25,0v-2,-6,-1,-18,0,-24r25,0v-5,-52,30,-78,80,-66v1,10,-2,17,-4,24","w":111},"g":{"d":"17,-103v-3,-54,72,-68,106,-41v8,-7,24,-11,39,-11v0,9,2,19,0,27r-27,0v23,46,-19,91,-77,76v-5,3,-14,9,-13,18v1,21,39,13,61,14v32,2,51,12,51,41v0,41,-40,54,-83,54v-36,0,-63,-8,-63,-40v0,-18,11,-30,24,-38v-22,-10,-15,-48,4,-58v-13,-9,-21,-22,-22,-42xm76,51v42,8,75,-44,24,-47v-29,-2,-62,-3,-61,25v0,19,17,22,37,22xm48,-103v0,19,11,32,32,32v21,0,32,-13,32,-32v0,-20,-10,-33,-32,-33v-22,0,-32,13,-32,33","w":165},"h":{"d":"94,-131v-55,0,-39,77,-41,131v-9,0,-21,2,-29,0r0,-220v9,0,21,-2,29,0r0,90v9,-15,24,-27,47,-28v72,-3,48,92,52,158v-9,0,-21,2,-29,0v-6,-47,19,-131,-29,-131","w":173},"i":{"d":"33,-130v-18,4,-25,-6,-19,-24r48,0r0,154v-9,0,-21,2,-29,0r0,-130xm26,-188r0,-30v10,0,23,-2,32,0v1,17,7,38,-23,31v-3,0,-6,-1,-9,-1","w":86},"j":{"d":"-7,30v21,6,41,2,41,-23r0,-137r-20,0v-1,-8,0,-15,0,-24r49,0r0,163v3,42,-38,55,-75,43v0,-8,3,-16,5,-22xm27,-188v0,-10,-2,-20,0,-30v10,0,22,-2,31,0v2,10,2,19,0,30v-10,0,-22,2,-31,0","w":87},"k":{"d":"23,-220v9,0,21,-2,29,0r0,220v-9,0,-21,2,-29,0r0,-220xm61,-80r49,-74v11,0,22,-2,32,0r-49,72r58,82v-11,0,-23,2,-33,0","w":154},"l":{"d":"86,0v-34,8,-63,-5,-63,-40r0,-180v10,0,21,-2,30,0r0,174v-3,22,11,27,31,23v2,7,2,15,2,23","w":89},"m":{"d":"90,-132v-51,0,-33,80,-36,132v-10,0,-21,2,-30,0r0,-154v13,0,29,-6,27,12v1,5,1,9,1,12v11,-33,79,-38,88,0v9,-14,22,-27,44,-28v71,-2,48,92,52,158v-10,0,-21,2,-30,0v-6,-46,19,-131,-27,-131v-51,0,-30,81,-34,131v-10,0,-21,2,-30,0r0,-92v0,-22,-5,-40,-25,-40","w":256},"n":{"d":"95,-131v-55,0,-38,77,-41,131v-10,0,-21,2,-30,0r0,-154v13,0,29,-6,27,12v1,5,1,10,1,13v10,-15,25,-28,49,-29v71,-2,48,92,52,158v-10,0,-21,2,-30,0v-6,-46,19,-131,-28,-131","w":173},"o":{"d":"158,-77v0,49,-25,81,-72,81v-47,0,-71,-32,-71,-81v0,-49,24,-81,71,-81v47,0,72,32,72,81xm46,-77v0,32,9,56,40,57v30,0,41,-24,41,-57v0,-33,-11,-56,-41,-56v-30,0,-40,24,-40,56","w":173},"p":{"d":"161,-81v2,61,-48,97,-108,81r0,71v-9,0,-21,2,-29,0r0,-225v18,-3,30,-1,28,22v8,-16,24,-26,47,-26v44,0,61,32,62,77xm92,-132v-47,0,-39,59,-39,107v41,14,79,-8,77,-55v-1,-30,-10,-52,-38,-52","w":177},"q":{"d":"16,-73v0,-74,69,-98,136,-78r0,222v-10,0,-21,2,-30,0r0,-71v-59,12,-106,-11,-106,-73xm46,-72v0,44,37,59,76,47r0,-105v-41,-12,-76,13,-76,58","w":175},"r":{"d":"104,-127v-62,-13,-50,67,-50,127v-10,0,-21,2,-30,0r0,-154v13,0,29,-6,27,12v1,5,1,9,1,12v9,-14,27,-29,52,-24v2,8,2,18,0,27","w":111},"s":{"d":"112,-75v44,60,-47,97,-98,71r7,-24v32,22,105,-10,55,-37v-24,-13,-57,-15,-58,-48v-2,-47,62,-52,100,-37v-1,8,-3,17,-6,23v-25,-20,-95,5,-48,30v15,8,39,9,48,22","w":136},"t":{"d":"102,-1v-37,10,-72,-1,-72,-42r0,-87v-8,-2,-24,4,-25,-4v19,-19,33,-42,54,-58r0,38r39,0v0,8,2,17,0,24r-39,0r0,70v-4,30,11,45,40,36v3,7,3,14,3,23","w":107},"u":{"d":"149,-5v-56,19,-127,12,-127,-63r0,-86v10,0,21,-2,30,0v5,54,-19,137,42,133v10,0,19,-2,26,-4r0,-129v9,0,21,-2,29,0r0,149","w":172},"v":{"d":"5,-154v11,0,23,-2,33,0r42,127r43,-127v10,0,22,-2,31,0r-60,154v-10,0,-20,2,-29,0","w":159},"w":{"d":"7,-154v10,0,23,-2,32,0r30,126r34,-126v10,0,21,-2,30,0r33,124r30,-124v10,0,21,-2,30,0r-46,154v-10,0,-21,2,-30,0r-33,-116r-35,116v-10,0,-21,2,-30,0","w":232},"x":{"d":"47,-80r-36,-74v11,0,22,-2,32,0r32,74r-38,80v-11,0,-22,2,-32,0xm77,-80r33,-74v10,-1,21,-2,31,0r-35,73r41,81v-10,1,-21,2,-31,0","w":152},"y":{"d":"26,48v19,8,40,0,41,-19r9,-29v-7,2,-13,0,-21,0r-51,-154v11,0,23,-2,33,0r42,143r44,-143v10,0,22,-2,31,0r-68,206v-8,21,-40,28,-65,19v0,-10,2,-16,5,-23","w":158},"z":{"d":"9,-4r81,-126r-72,0v-2,-8,-1,-16,0,-24r116,0r1,4r-81,126r76,0v1,8,2,16,0,24r-120,0","w":143},"{":{"d":"108,50v-56,5,-63,-37,-63,-91v0,-26,-12,-37,-30,-47r0,-4v18,-10,31,-21,30,-51v-2,-53,7,-91,63,-87v0,8,2,17,0,24v-30,-1,-35,18,-34,48v1,34,-3,58,-25,68v22,11,26,35,25,70v0,29,3,49,34,46v0,8,2,17,0,24","w":124},"|":{"d":"35,-233v10,0,20,-2,29,0r0,283v-10,2,-20,2,-29,0r0,-283","w":99},"}":{"d":"109,-88v-62,14,11,144,-93,138v0,-8,-2,-17,0,-24v31,3,35,-18,34,-48v-1,-34,3,-58,25,-68v-47,-11,3,-121,-59,-116v0,-8,-2,-17,0,-24v56,-3,65,34,63,87v-1,30,12,41,30,51r0,4","w":124},"~":{"d":"100,-103v-28,0,-60,-25,-81,-1v-6,-6,-11,-12,-13,-19v25,-40,91,15,119,-17v6,5,10,13,13,21v-10,9,-21,16,-38,16","w":143},"\u00d7":{"d":"71,-106r-36,-36v4,-9,11,-14,19,-20r36,37r36,-36v7,5,14,12,19,19r-36,36r36,36v-6,7,-12,14,-19,19r-36,-36r-37,36v-7,-5,-14,-11,-19,-19"},"\u2013":{"d":"150,-98v0,9,2,19,0,28r-150,0v0,-9,-2,-19,0,-28r150,0","w":150},"\u2014":{"d":"300,-98v0,9,2,19,0,28r-300,0v0,-9,-2,-19,0,-28r300,0","w":300},"\u2018":{"d":"15,-215v10,-2,19,-2,29,0r18,67v-9,1,-19,2,-28,0","w":77},"\u2019":{"d":"33,-216v9,0,21,-2,29,0r-18,67v-10,0,-20,2,-29,0","w":77},"\u201c":{"d":"15,-215v10,-2,19,-2,29,0r18,67v-9,1,-19,2,-28,0xm73,-215v10,-2,19,-2,29,0r18,67v-9,1,-19,2,-28,0","w":135},"\u201d":{"d":"33,-216v9,0,21,-2,29,0r-18,67v-10,0,-20,2,-29,0xm91,-216v9,0,21,-2,29,0r-18,67v-10,0,-20,2,-29,0","w":135},"\u2026":{"d":"127,0v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34xm201,0v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34xm53,0v-26,7,-44,-3,-33,-34v11,-1,21,0,33,0v0,11,2,24,0,34","w":219},"\u2122":{"d":"42,-190r-34,0v-2,-9,-1,-13,0,-22r90,0v2,7,2,15,0,22r-33,0r0,98v-8,0,-16,2,-23,0r0,-98xm118,-212v8,0,17,-2,25,0r30,66r29,-66v8,0,17,-2,25,0r6,120v-8,0,-16,2,-23,0r-5,-77r-26,54v-6,1,-10,2,-17,0r-23,-53r-4,76v-8,2,-15,1,-23,0","w":247},"!":{"d":"28,-216v11,0,22,-2,32,0r-2,151v-9,2,-19,1,-28,0xm60,0v-27,6,-41,-1,-33,-34v11,-1,21,0,33,0v2,11,2,23,0,34","w":87},"\"":{"d":"78,-216v10,0,20,-2,29,0r0,82v-9,2,-20,1,-29,0r0,-82xm19,-216v10,0,20,-2,29,0r0,82v-9,2,-20,1,-29,0r0,-82","w":126},"#":{"d":"57,-63r-37,0v0,-8,-2,-16,0,-23r39,0r4,-50r-37,0v-1,-6,-2,-17,0,-23r39,0r4,-48v9,0,19,-2,27,0r-4,48r51,0r4,-48v9,0,19,-2,27,0r-4,48r35,0v2,7,1,16,0,23r-37,0r-4,50r35,0v0,8,2,16,0,23r-37,0r-4,54v-10,1,-19,2,-27,0r4,-54r-51,0r-4,54v-10,2,-18,1,-28,0xm137,-86r4,-50r-51,0r-4,50r51,0","w":220},"$":{"d":"131,-111v47,25,28,112,-28,112r0,34v-7,2,-14,2,-21,0r0,-32v-22,3,-43,-4,-60,-9r7,-26v35,15,112,13,94,-42v-24,-36,-96,-22,-95,-85v1,-32,23,-52,54,-56r0,-29v6,-2,15,-1,21,0r0,28v16,1,34,4,46,8v-1,8,-4,17,-7,25v-28,-13,-100,-11,-79,34v11,23,46,26,68,38"},"\u00a0":{"w":71}}});

