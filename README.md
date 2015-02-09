# Chardin.js

**Simple overlay instructions for your apps.**

[Check out a demo](http://heelhook.github.com/chardin.js/).

Chardin.js is a jQuery plugin that creates a simple overlay to display instructions on existent elements. It is inspired by
the recent Gmail new composer tour which I loved.

![chardin](https://raw.github.com/heelhook/chardin.js/master/example/img/chardin.png "chardin")  
[Jean-Baptiste-Siméon Chardin](http://en.wikipedia.org/wiki/Jean-Baptiste-Sim%C3%A9on_Chardin)

## Installing

Simple! Fork this repo or download [chardin.css][0] and [chardin.min.js][1] and add the following assets to your HTML:

```HTML
<link href="chardin.css" rel="stylesheet">
<script src="chardin.min.js"></script>
```

### Installing in the rails asset pipeline (optional) 

There's a [`chardinjs-rails`](https://github.com/heelhook/chardin.js-rails) gem.

### Building (optional)

If you choose to fork the repo you can build the assets running

    rake compile


## Adding data for the instructions

Add the instructions to your elements:

`data-intro`: Text to show with the instructions  
`data-position`: (`left`, `top`, `right`, `bottom`), where to place the text with respect to the element

```HTML
<img src="img/chardin.png" data-intro="An awesome 18th-century painter, who found beauty in everyday, common things." data-position="right" />
```

## Running

Once you have your elements ready you can show instructions running

```Javascript
$('body').chardin('start')
```

If you would rather run Chardin.js confined to a particular container (instead of using the whole document) you can
change `body` to some other selector.

```Javascript
$('.container').chardin('start')
```

## Methods

### .chardin('start')

Start Chardin in the selector.

### .chardin('toggle')

Toggle Chardin.

### .chardin('stop')

Make your best guess. That's right! Stops Chardin in the selector.

## Events

### 'chardin:start'

Triggered when chardin is correctly started.

### 'chardin:stop'

Triggered when chardin is stopped.

## Extensions

A number of interface methods have been provided to facilitate the customization of this library to specific user needs. The intended pattern is to add a function that extends `chardin.prototype` to the `decorators` object of the plugin. The following descriptions are oriented toward the idea of one customizing the plugin to create a guided tour with elements and tooltips revealed in sequence, after which a video is displayed.

### User interaction

In order to prevent users from interacting with the document until the tour has completed, click events on the document are intercepted for its duration. By default, the click interceptor does nothing. If you want to only intercept clicking for certain elements, specify them in `this.clickBlacklist` (e.g. `:not(.tour-clickable)`).

The escape key is also endowed with a listener that calls `stop()`. This is added with the idea that users may want to exit the tour early.

All additional listeners are removed when the overlay is closed.

### `preOverlaySetup()`, `postOverlaySetup()`, `finalSetup()`

These functions are called in sequence in `start()`, with `finalSetup()` after the tooltips have been shown and the start event has been triggered.

### `getElements()`

By default, this returns the elements with a `data-intro` attribute. One might customize it in order to sort these elements by a `data-ord` attribute, in order to reveal elements in a sequence.

### `showElement(el, i)`

This delegates to the internal `_showElement(el)` method by default. `el` is the element itself, and `i` refers to its index in the list returned by `getElements()`. Again, additional logic can be added around this as appropriate. One might call this method with a timeout in order to create an ordered tour.

### `destroy()`

Called in `stop` before the overlay is removed. Clean up any extra listeners or other items here.

### `registerTimeout(callback, delay)`

Add to chardin's internal list of timeouts, to be automatically cleaned up at the end of the tour.

### `removeTooltips(selector)`

Remove the plugin's text tooltips without actually closing the tour. One might implement this in order to display a video after all the items have been revealed. Optionally provide a selector (e.g. `:not(.persistent)`) in order to remove only certain tooltips.

### `restoreClick()`

Restore normal click behavior to the document. Again, this might be used to enable video controls after the main portion of the tour has ended.

## Author

[Pablo Fernandez][2]

### Contributors

 * [John Weir](https://github.com/jweir)
 * [felipeclopes](https://github.com/felipeclopes)
 * [Bobby Jack](https://github.com/fiveminuteargument)
 * [Maxim Syabro](https://github.com/syabro)
 * [nmeum](https://github.com/nmeum)
 * [printercu](https://github.com/printercu)
 * [Kurt Kotzur](https://github.com/kurtkotzur)

## Contributions

If you want to contribute, please:

  * Fork the project.
  * Make your feature addition or bug fix.
  * Add yourself to the list of contributors in the README.md.
  * Send me a pull request on Github.

## License

Copyright 2013 Pablo Fernandez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

 [0]: https://github.com/heelhook/chardin.js/blob/master/chardin.css
 [1]: https://github.com/heelhook/chardin.js/blob/master/chardin.min.js
 [2]: https://github.com/heelhook


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/heelhook/chardin.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

