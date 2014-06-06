[![Build Status](https://api.travis-ci.org/cleverage/ca.jquery.simplemodal.svg?branch=master)](https://api.travis-ci.org/cleverage/ca.jquery.simplemodal)

jQuery Simplemodal Plug-in
==========================

This plugin provide a simple and lightweight modalbox implementation, inspired
by leanModal.js. It does **not** include custom CSS or dependencies (except to
manage positionning). It only provides a modal engine that you can tweak with
CSS and classes.


API
---

The entry point for the plug-in is the `simplemodal` function.

```javascript
$('#mybox').simplemodal(options);
```

The content of the node to which is attached the plugin is moved to the
modalbox, so don't forget to saved it somewhere else before destroying the
modalbox if you want to save it.

You can also pass a ghost content (aka _the casper mode_) directly to the modal:

```javascript
$('<div/>', {text: "My Ghost content for the modal."}).simplemodal(options);
```


### Properties of the configuration object

#### `autoDestroy`

This property takes a boolean value. It defines is the modalbox must destroy
itself at close, removing it's container and overlay from the DOM.

The default value is `false`.

#### `autoOpen`

This property defines if the modal must open at creation time or not, and takes
a boolean value. If not, you must open it manually by passing the string `open`
to the plugin.

```javascript
// This modal will open directly
$('#mybox-auto').simplemodal({
    autoOpen: true
});

// This one must be triggered manually
$('#mybox-noauto').simplemodal({
    autoOpen: false
});

$('button').on('click', function () {
    $('#mybox-noauto').simplemodal('open');
});
```

The default value is `false`.

#### `className`

This property is a _string_ that contains the className(s) you want to apply
to the modalbox container. The default class always apply is `sm-modal`. The 
`className` option string is concatenated after the default one.

The default value is `null` (only apply `.sm-modal` class).

#### `closeButton`

This property enable / disable the presence of a close button inside the
modalbox container. It takes a boolean value that sets it's injection.

The default value is `false` (no close button by default).

#### `duration`

This property is a _number_ and defines the duration in milliseconds for
transitions (appear, disappear).

The default value is `500`.

#### `onOpen` / `onClose`

Those properties are callbacks that'll be called at open / close events. The
context is the DOM element to which is attached the plugin.

#### `overlay`

This property defines the opacity applied to the overlay (the fog layer) behind
the modalbox. It can takes any value from `0` to `1` and is passed directly to
the jQuery `fadeTo` method.

The default value is `0.5`.

#### `top`

This property defines the vertical position of the modal inside the viewport. It
can takes one of the following values:

* `{falsy}` : Any falsy value will centerize vertically the modalbox, determined
              by the modalbox `innerHeight` and the viewport `height`.
* {number>0}: Any number greater than zero will position the modalbox at this
              distance from the top of the viewport.

The default value is `null` (`{falsy}`).
