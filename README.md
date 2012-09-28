# fontificate.js

A client-side font library

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/samlecuyer/fontificate/master/dist/fontificate.min.js
[max]: https://raw.github.com/samlecuyer/fontificate/master/dist/fontificate.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/fontificate.min.js"></script>
<script>
var file = ... // somehow obtain an html File
fontificate(file).then(function(thefont) {
	$('#samplediv').html(thefont.stringToSVG('hello, world'));
});
</script>
```
## Demo
Check out the demo [housed here](http://fontificate.samlecuyer.com)

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Sam L'Ecuyer  
Licensed under the MIT license.

FreeSans.ttf is not subject to my own licensing. It is subject to the GPL.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

### Important notes
Please don't edit files in the `dist` subdirectory as they are generated via grunt. You'll find source code in the `src` subdirectory!

While grunt can try to run the included unit tests via PhantomJS, this shouldn't be considered a substitute for the real thing. Please be sure to test the `test/*.html` unit test file(s) in _actual_ browsers.  PhantomJS doesn't support all the APIs fontificate uses properly, so it really can't be used for testing.  You can fire up a local server in the root directory using `python -m SimpleHTTPServer 8000`.

### Installing grunt
_This assumes you have [node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed already._

1. Test that grunt is installed globally by running `grunt --version` at the command-line.
1. If grunt isn't installed globally, run `npm install -g grunt` to install the latest version. _You may need to run `sudo npm install -g grunt`._
1. From the root directory of this project, run `npm install` to install the project's dependencies.
