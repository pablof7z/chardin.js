# Chardin.js

**Simple overlay instructions for your apps.**

[Check out a demo](http://heelhook.github.com/chardin.js/).

[Or demo sequential stepping](http://heelhook.github.com/chardin.js/sequential.html).

Chardin.js is a jQuery plugin that creates a simple overlay to display instructions on existent elements. It is inspired by
the recent Gmail new composer tour which I loved.

![chardin](https://raw.github.com/heelhook/chardin.js/master/example/img/chardin.png "chardin")  
[Jean-Baptiste-Siméon Chardin](http://en.wikipedia.org/wiki/Jean-Baptiste-Sim%C3%A9on_Chardin)

## Installing

Simple! Fork this repo or download [chardinjs.css][0] and [chardinjs.min.js][1] and add the following assets to your HTML:

```HTML
<link href="chardinjs.css" rel="stylesheet">
<script src="chardinjs.min.js"></script>
```

There's a [`chardinjs-rails`](https://github.com/heelhook/chardin.js-rails) gem.


## Adding data for the instructions

Add the instructions to your elements:

`data-intro`: Text to show with the instructions/tooltip. 
`data-position`: (`left`, `top`, `right`, `bottom`), where to place the text with respect to the element.
In addition you can alter the relative position of the tooltip text by placing a colon and a percentage value (-100 to 100) after the position text, eg "top:-50". 
This will slide the tooltip along the length or height of the element away from the centre.
If you want to increae the distance of the tooltip from the element, you can do it by placing a comma and a percentage value (100, 200, 300, 400 or 500) after the tooltip offset, eg "top:0,200". This will shift the tooltip to be twice farther away from the element than by default.

```HTML
<img src="img/chardin.png" data-intro="An awesome 18th-century painter, who found beauty in everyday, common things." data-position="right" />
```

You can also run Chardin in sequenced mode, where one element will be displayed at a time, moving on to the next with a mouse click (or automatically after a set delay).
Add `data-chardin-sequenced="true"` entry to the body tag. Also add `data-chardin-auto="true"` and `data-chardin-delay="100"` for automatic movement through the elements. Delay is in milliseconds.
The default sequence is as loaded by the DOM, but this can be overridden using the tag `data-sequence` with a number. 
If no auto-traversal is set, clicking will move sequentially through the elements, clicking with the shift key down will move backwards through them.

```HTML
<body data-chardin-sequenced="true" data-chardin-auto="false" data-chardin-delay="800" >
```

## Running

Once you have your elements ready, initialise the library and assign it to a button that the user will click to show the overlay. 
The library will store an initialised object to the containing element's data set so you can start and stop it with whatever options you set.

```Javascript
$('body').chardinJs();
$('body').on('click', 'button[data-toggle="chardinjs"]', function (e) {
    e.preventDefault();
    return ($('body').data('chardinJs')).toggle();
});
````

You can run it explicitly like so:

```Javascript
$('body').chardinJs('start')
```

If you would rather run ChardinJs confined to a particular container (instead of using the whole document) you can
change `body` to some other selector.

```Javascript
$('.container').chardinJs('start')
```

You may also refresh instructions overlay any time to reflect whatever changes happened to the underlying page elements since the instructions overlay has been displayed.

```Javascript
var chardinOverlay = $('body').chardinJs('start');
...
chardinOverlay.refresh();
```

## Options

The chardinJS constructor can take several options, eg:

```Javascript
$('body').chardinJs({ url: "/help/HelpOverlay.json" });
```
Options are:

 - url: specifies a url that returns a json object containing text to show. This is useful to dynamically change the overlay, or to hold all your overlay text in one external file. 
The json file should contain a set of name-value pairs, the name will match the data-intro attribute if it begins with a '#'. The value contains the required text and an optional posiiton.
For conflicts between the data attributes and the json entries, the attribute takes precedence.

Example:

```json
{
    "#summary-btns": {
        "text": "buttons to interact with the displayed summary",
        "position": "left"
    },
    "#search-btn": { 
        "text": "expand this to filter the list of profiles" 
    }
}
```

This text will be shown against an element that has `data-intro='#summary-btns'`. If the data-intro does not start with a #, then the value will be used as the text to display. 
If no entry is present for a given element's data reference, then nothing will be displayed.

 - attribute: changes the data attribute from data-intro to data-<as specified>.
Example:
```Javascript
$('body').chardinJs({ attribute: 'data-intro' });
```


## Methods

### .chardinJs('start')

Start ChardinJs in the selector.

### .chardinJs('toggle')

Toggle ChardinJs.

### .chardinJs('stop')

Make your best guess. That's right! Stops ChardinJs in the selector.

## Events

### 'chardinJs:start'

Triggered when chardinJs is correctly started.

### 'chardinJs:stop'

Triggered when chardinJs is stopped.

### 'chardinJs:next'

Triggered when the sequential option moves to the next element

### 'chardinJs:previous'

Triggered when the sequential option moves to the previous element

## Author

[Pablo Fernandez][2]

### Contributors

 * [John Weir](https://github.com/jweir)
 * [felipeclopes](https://github.com/felipeclopes)
 * [Bobby Jack](https://github.com/fiveminuteargument)
 * [Maxim Syabro](https://github.com/syabro)
 * [nmeum](https://github.com/nmeum)
 * [printercu](https://github.com/printercu)
 * [Max Loginov](https://github.com/maxloginov)
 * [sudodoki](https://github.com/sudodoki)
 * [Mickaël Gentil](https://github.com/yudao)
 * [gbjbaanb](https://github.com/gbjbaanb)
 * [dozyatom](https://github.com/dozyatom)


## Contributions

If you want to contribute, please:

  * Fork the project.
  * Make your feature addition or bug fix.
  * Add yourself to the list of contributors in the README.md.
  * Send me a pull request on Github.

## License

Copyright 2020 Pablo Fernandez

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

 [0]: https://github.com/heelhook/chardin.js/blob/master/chardinjs.css
 [1]: https://github.com/heelhook/chardin.js/blob/master/chardinjs.min.js
 [2]: https://github.com/heelhook
