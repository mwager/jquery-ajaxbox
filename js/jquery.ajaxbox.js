/*global window: true, document: true, $: true, jQuery: true, console: true*/
/**
 * simple jQuery ajaxbox plugin v0.3
 *
 * @copyright   2012, Michael Wager <mail@mwager.de>
 * @licence     http://philsturgeon.co.uk/code/dbad-license
 */
;
(function($) {
    'use strict';

    // const
    var ajax_box_overlay;

    var Ajaxbox = function(element, options) {

        // background overlay only once
        if($('#ajax_box_overlay').length === 0) {
            $('body').append('<div id="ajax_box_overlay"></div>');
            ajax_box_overlay = $('#ajax_box_overlay');
        }

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
        init:  function(element, options) {
            this.$element = $(element);

            // auto open
            if(element === null) {
                this.options = $.extend({}, $.fn.ajaxbox.defaults, options);
                this.enter({data: {self: this}});
                return;
            }

            this.href = null; // href attr of html tag
            this.box = null; // the ajaxbox itself

            this.options = $.extend({}, $.fn.ajaxbox.defaults, options, this.$element.data());
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
         * unbind events, cleanup
         */
        off: function() {
            if(this.options.sel) {
                this.$element.off(this.options.event, this.options.sel);
            }
            else {
                this.$element.off(this.options.event);
            }
            this.box !== null && this.box.remove();
            this.box = null;
            this.href = null;
            this.options = null;
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
                html.push('<span class="ajax_box_close_button" style="left:' + (this.options.width - 10) + 'px;"></span>');
                html.push('<span class="ajax_box_loader" style="top:' + (parseInt(this.options.height, 10) / 2 - 60) + 'px;"></span>');
                html.push('<div  class="ajax_box_body"></div>');
                html.push('</div>');

                html = html.join('');

                //this.log(html);

                //save box object
                this.box = $(html);

                //now put contents in body of box either from ajax response (or use iframe? )
                if(this.options.content === null) {
                    this.getContentViaAjax();
                }
                else {
                    this.putContent(this.options.content);
                }

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
            if($.isFunction(this.options.beforeOpen))
                this.options.beforeOpen.call(this);

            ajax_box_overlay.show(); // fadeIn(100);

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

                if($.isFunction(this.options.afterClose))
                    this.options.afterClose.call(this);
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

            self.box.find('.ajax_box_close_button').on('click', function() {
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
         * put content in the box. either via ajax or via options.content
         * @param string content
         */
        putContent: function(content) {
            this.box.find('.ajax_box_body').html(content);
            this.box.find('.ajax_box_loader').remove();

            if($.isFunction(this.options.onContentLoaded))
                this.options.onContentLoaded.call(this, content);
        },


        /**
         * Get content of ajaxbox via ajax. Only html is accepted.
         * On success we fill the body of the box.
         */
        getContentViaAjax: function() {
            var self = this;

            var url = this.options.url ? this.options.url : this.href;

            self.log('getContentViaAjax() URL: ' + url);

            $.ajax({
                type:     "GET", // POST
                dataType: "html",
                url:      url,
                data:     {},
                success:  function(html) {
                    self.putContent(html);
                },
                error:    function(request, textStat, thrown) {
                    var html = ['[AJAX ERROR]<br/> Status: ' + request.status + '<br/>', 'Status-Text: ' + request.statusText + '<br/>'];
                    self.log(thrown);
                    self.putContent(html.join(''));
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
        if(this.length === 0) {
            var options = typeof option == 'object' && option;
            new Ajaxbox(null, options);
            return;
        }

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
        content:         null, // custom content, no ajax
        event:           'click', // show event - default click
        sel:             null, // optional selector to support "live" binding
        url:             null, // optional url, if null href attr is used
        beforeOpen:      null, // callback function
        afterClose:      null, // callback function
        onContentLoaded: null, // callback function
        debug:           false // debugging, log some messages to the console if set to true
    };
}(window.jQuery));