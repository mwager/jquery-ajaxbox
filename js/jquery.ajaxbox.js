/*global window: true, document: true, $: true, jQuery: true, console: true*/

/**
 * simple jQuery ajaxbox plugin v0.3
 *
 * @copyright   2012, Michael Wager <mail@mwager.de>
 * @licence     http://philsturgeon.co.uk/code/dbad-license
 */
;(function($) {
    'use strict'

    // we need an overlay background only once
    $('body').append('<div id="ajax_box_overlay"></div>');

    // const
    var ajax_box_overlay = $('#ajax_box_overlay');

    var Ajaxbox = function(element, options) {
        this.init(element, options);
    };

    Ajaxbox.prototype = {
        constructor: Ajaxbox,

        /**
         * Init member variables and bind event
         *
         * @param string element - the element on which we bind the event
         * @param object options - options of plugin
         */
        init: function(element, options) {
            this.$element = $(element);
            this.options = $.extend({}, $.fn.ajaxbox.defaults, options, this.$element.data());

            this.href = null; // href attr of html tag
            this.box = null; // the ajaxbox itself

            this.log('entering init');
            this.log(this.options, true);

            if(this.options.sel) {
                this.$element.on(this.options.event, this.options.sel, {self: this}, this.enter);
            }
            else {
                this.$element.on(this.options.event, {self: this}, this.enter);
            }
        },

        /**
         * Main entry point of event
         *
         * @param object event - event thrown over here in jQuery's on()
         */
        enter: function(event) {
            var self = event.data.self;

            self.href = $(this).attr('href');

            self.createBox($(this));

            return false;
        },

        /**
         * Create the box, bind events, get contents and show.
         * If the box was already open, just show it.
         *
         * @param object $this - the html tag, on which the user has clicked
         */
        createBox: function($this) {
            if(this.box && this.box.length > 0) {
                this.showBox();
            }

            else {
                var html = [];

                html.push('<div  class="ajax_box">');
                html.push('<span class="close_button" style="left:' + (this.options.width - 10) + 'px;"></span>');
                html.push('<span class="ajax_box_loader" style="top:' + (parseInt(this.options.height, 10) / 2 - 60) + 'px;"></span>');
                html.push('<div  class="ajax_box_body"></div>');
                html.push('</div>');

                html = html.join('');

                //this.log(html);

                //save box object
                this.box = $(html);

                //now put contents in body of box either from ajax response (or use iframe? TODO)
                this.getContent();

                $('body').append(this.box);

                this.box.css({
                    'width':  this.options.width,
                    'height': this.options.height
                });

                this.showBox();
            }

            this.makeClosable();
        },

        //---------- plugin helpers ----------
        showBox:   function(w, h) {
            $.isFunction(this.options.beforeOpen) && this.options.beforeOpen.apply();

            ajax_box_overlay.fadeIn(300);
            this.centerBox();
            this.box.fadeIn(300);
        },

        closeBox: function() {
            var self = this;

            self.log('closeBox()');

            if(self.box) {
                self.box.fadeOut(300, function() {
                    ajax_box_overlay.fadeOut(300);
                    self.box.remove();
                    self.box = null;
                });

                $.isFunction(this.options.afterClose) && this.options.afterClose.apply();
            }
        },

        /**
         * Position the box relative to the browser window.
         */
        centerBox: function() {
            var left = ($(window).width() - this.box.outerWidth()) / 2;
            var top = ($(window).height() - this.box.outerHeight()) / 2;

            this.box.css({
                top:  (top > 0 ? top : 0) + 'px',
                left: (left > 0 ? left : 0) + 'px'
            });
        },

        /**
         * Click on overlay, X and hitting ESC should close the box.
         */
        makeClosable: function() {
            var self = this;

            ajax_box_overlay.on('click', function() {
                ajax_box_overlay.off('click');
                self.closeBox();
            });

            this.box.find('.close_button').on('click', function() {
                self.closeBox();
            });

            $(document).on('keydown', function(e) {
                var code = (e.keyCode || e.which);
                if(code === 27) {
                    self.closeBox();
                    $(document).off('keydown');
                }
            });
        },

        /**
         * Get content of ajaxbox via ajax. Only html is accepted.
         * On success we fill the body of the box.
         */
        getContent: function() {
            var self = this;

            var url = this.options.url ? this.options.url : self.href;

            self.log('getContent() URL: ' + url);

            $.ajax({
                type:     "GET", // POST
                dataType: "html",
                url:      url,
                data:     {},
                success:  function(html) {
                    self.box.find('.ajax_box_body').html(html); //BAAM
                    self.box.find('.ajax_box_loader').remove(); //not needed anymore

                    $.isFunction(self.options.onContentLoaded) && self.options.onContentLoaded.apply();

                },
                error:    function(request, textStat, thrown) {
                    self.box = null; //destroy this box, so it gets loaded again next time
                    $.error('ajax error callback - something went wrong... is the link pointing to the same domain?');
                }
            });
        },

        /**
         * simple log helper
         * @param s
         * @param raw
         */
        log: function(s, raw) {
            if(this.options.debug && window.console && console.log) {
                console.log(raw ? s : '[ajaxbox] ' + s);
            }
        }
    };

    $.fn.ajaxbox = function(option) {
        return this.each(function() {
            var $this = $(this),
            // data = $this.data('ajaxbox'),
                    options = typeof option == 'object' && option;

            //if (!data)
            //    $this.data('ajaxbox', (data = new Ajaxbox(this, options)));

            new Ajaxbox(this, options);
        });
    };

    $.fn.ajaxbox.Constructor = Ajaxbox;

    $.fn.ajaxbox.defaults = {
        width:           400,
        height:          200,
        event:           'click', // show event - default click
        sel:             null, // optional selector to support "live" binding
        url:             null, // optional url, if null href attr is used
        beforeOpen:      null, // callback function
        afterClose:      null, // callback function
        onContentLoaded: null, // callback function
        debug:           false // debugging, log some messages to the console if set to true
    };
}(window.jQuery));