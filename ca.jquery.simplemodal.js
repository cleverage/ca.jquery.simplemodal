/*! Copyright (c) 2014 Clever Age
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function($, undefined) {
  'use strict';

  // Default options and settings
  var namespace = 'simplemodal';

  // PLUGIN
  // ===========================================================================

  // The Plugin object
  // -----------------
  //
  function Plugin(element, options) {
    // Store elements to access it later easily
    this.element = element;
    this.options = $.extend({classNames: {}}, $.fn[namespace].defaults, options);

    // Create and stores all DOM elements using the Plugin as context.
    this.$overlay = this._setOverlay();
    this.$el      = this._setModal();

    // Open the modalbox if setted as it.
    if (this.options.autoOpen) { this.open(); }
  }


  // Return a class from current options or main configuration (pseudo private)
  // ---------------------------------
  //
  Plugin.prototype._getClass = function(className) {
    return this.options.classNames[className] ||
           $.fn[namespace].className[className];
  };

  // Overlay template (pseudo private)
  // ---------------------------------
  //
  Plugin.prototype._setOverlay = function () {
    // Create a jQuery Node, and attaching to it some events.
    //
    // The Overlay is used as a fog layer behind the modal box. It receive a
    // click handler to call the plugin close method to close the modal on a
    // click on the fog
    //
    // Each overlay is dependent to its modalbox. So you'll have as many
    // overlays as you've got active modals.
    //
    var $el = $('<div/>', {'class': this._getClass('overlay')})
    .hide()
    .on('click', $.proxy(this.close, this))
    .appendTo('body');

    // Create a jQuery Node as overlay child to be used as a throbber. It'll
    // show at call and hide when the modal appear.
    //
    $('<div/>', {'class': this._getClass('loader')})
    .hide()
    .appendTo($el);

    return $el;
  };

  // Modal template (pseudo private)
  // -------------------------------
  //
  Plugin.prototype._setModal = function () {
    var $el,
        // Expand className with the default modal className and custom ones.
        className = this._getClass('modal');

    if (this.options.className) {
      className += ' ' + this.options.className;
    }

    // Create a jQuery Node for the modal box container.
    //
    $el = $('<div/>', {'class': className})
    .hide()
    .appendTo('body');

    // Create a jQuery Node for modalbox content, attach ot to the container
    // and append to it the content of the initial DOM Node passed to the
    // plugin.
    //
    // Be careful that the content isn't duplicate to the modal box, but moved
    // to it. It authorize to create (or retrieve) content and place it
    // directly into the modalbox, but remember that this content will be
    // loose if you don't save it before the modalbox disposing.
    //
    $('<div/>', {'class': this._getClass('content')})
    .append( $(this.element) )
    .appendTo($el);

    // If the closeButton is activated, create it and attach it to the
    // modalbox container. It's a simple `<button>` with a click handler
    // that'll call the plugin close method.
    if (this.options.closeButton) {
      $('<button/>', {'class': this._getClass('close')})
      .append( $('<span/>', {'text': $.fn[namespace].l10n.close}) )
      .on('click', $.proxy(this.close, this))
      .appendTo($el);
    }

    return $el;
  };

  // ToggleLoader (pseudo private)
  // -----------------------------
  //
  // Simple toggle wrapper for the thobber inside the current overlay.
  //
  Plugin.prototype._toggleLoader = function () {
    this.$overlay.find('.' + this._getClass('loader')).toggle();
  };

  // Open (public)
  // -------------
  //
  // The opening method. It can be called inside the plugin, or outside
  // directly by passing the call to the attached plugin.
  //
  // e.g.:
  //
  //     // Init the modalbox
  //     var options = {
  //       autoOpen: false
  //     };
  //     $('#mybox').simplemodal(options);
  //
  //     // Call the open later (e.g. in a onClick handler)
  //     $('#mybox').simplemodal('open');
  //
  Plugin.prototype.open = function() {
    // Proxying the close method to the current plugin instance, and the
    // optional `onOpen` callback to the current DOM element (mapped to
    // the context inside the callback).
    //
    var close = $.proxy(this.close, this),
        toggleLoader = $.proxy(this._toggleLoader, this),
        onOpen = $.noop;

    if ($.type(this.options.onOpen) === 'function') {
      onOpen = $.proxy(this.options.onOpen, this.element);
    }

    // Animate the overlay with a fade from `0` to the passed option value.
    // Toggle the throbber (show it) inside the overlay for waiting to the
    // modalbox.
    //
    this.$overlay
    .fadeTo(this.options.duration, this.options.overlay, toggleLoader);

    // Fade it from `0` tp `100` and call the optional `onOpen` callback
    // at end.
    //
    this.$el
    .fadeIn(this.options.duration, onOpen);

    // We also attach the close event to the `ESC` key.
    //
    $(document).one('keyup', function (e) {
      if (e.which === 27) { close(); }
    });
  };

  // Close (public)
  // --------------
  //
  // The closing method, can be called inside the plugin or outside by passing
  // the call to the attached plugin (see #open for an exemple of use).
  //
  Plugin.prototype.close = function() {
    // Create a callback ready to be fired at fading end, binded to the
    // current plugin instance. It calls the optional `onClose` callback and
    // dispose the modalbox if setted in the options hash.
    //
    var onClose = $.proxy(function () {
      // Proxying the optional `onClose` callback to the current DOM element
      // mapped to the context inside the callback.
      if ($.type(this.options.onClose) === 'function') {
        this.options.onClose.call(this.element);
      }

      // If the modalbox needs to be disposed when closed, we destroy it.
      if (this.options.autoDestroy) {
        this.destroy();
      }
    }, this);

    // We simply fadeOut the overlay and the container, toggling the throbber
    // at end and calling the optional `onClose` callback.
    //
    this.$overlay
    .fadeOut(this.options.duration, $.proxy(this._toggleLoader, this));

    this.$el
    .fadeOut(this.options.duration, onClose);
  };

  // Destroy (public)
  // ----------------
  //
  // The dispose method that simply remove the created nodes from the DOM.
  // Remember that the content of the modalbox is **not** saved and will be
  // removed from the DOM if you don't save it before.
  //
  Plugin.prototype.destroy = function() {
    this.$overlay.remove();
    this.$el.remove();
  };


  // JQUERY
  // ===========================================================================
  //
  // Expose the plugin in the jQuery prototype
  //
  $.fn[namespace] = function(options) {
    // Explode arguments to use it when callbacking
    var args, _;

    _ = arguments[0];
    args = [].slice.call(arguments, 1);

    // Iterate over jQuery elements
    return this.each(function() {
      var plugin,
          ns = ['plugin', namespace].join('_');

      // Get the plugin attached to the element
      plugin = $.data(this, ns);

      // Instanciate a new plugin and store it in the jQuery object
      if(!plugin) {
        $.data(this, ns, new Plugin(this, options));
      }
      // If the plugin contains the called method, apply it
      else if(plugin[_] && $.type(plugin[_]) === 'function' && _.indexOf('_') !== 0) {
        return plugin[_].apply(plugin, args);
      }
    });
  };

  // Default configuration
  $.fn[namespace].defaults = $.extend({
    top         : null,          // Fix `Top` position instead of vertical centering
    overlay     : 0.5,           // Set overlay opacity
    closeButton : false,         // Enable / Disable a close button inside the modal
    className   : null,          // Add one (or more) class(es) to the modal box
    duration    : 500,           // Duration of transition
    autoOpen    : false,         // Open the modalbox when created
    autoDestroy : false,         // Destroy the modalbox when it is closed
    onOpen      : function() {}, // Callback to execute at Open event
    onClose     : function() {}  // Callback to execute at Close event
  }, $.fn[namespace].defaults);

  // Default class names
  $.fn[namespace].className = $.extend({
    overlay : 'sm-overlay',
    loader  : 'sm-loader',
    modal   : 'sm-modal',
    content : 'sm-content',
    close   : 'sm-close'
  }, $.fn[namespace].className);

  // Default displayed string
  $.fn[namespace].l10n = $.extend({
    close : 'close'
  }, $.fn[namespace].l10n);

})(jQuery);
