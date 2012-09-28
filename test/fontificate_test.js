/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	/*
	======== A Handy Little QUnit Reference ========
	http://docs.jquery.com/QUnit

Test methods:
expect(numAssertions)
stop(increment)
start(decrement)
Test assertions:
ok(value, [message])
equal(actual, expected, [message])
notEqual(actual, expected, [message])
deepEqual(actual, expected, [message])
notDeepEqual(actual, expected, [message])
strictEqual(actual, expected, [message])
notStrictEqual(actual, expected, [message])
raises(block, [expected], [message])
*/

module('sanitycheck');
test('should support binary APIs', 2, function() {
	ok(FileReader, 'should have FileReader');
	ok(ArrayBuffer, 'should have ArrayBuffer');
});

module('fontificate#fontificate', {
	setup: function() {
		var deferred = new $.Deferred();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/test/resources/FreeSans.ttf', true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.status == 200) {
				deferred.resolve(this.response);
			} else {
				deferred.reject(this.status);
			}
		};
		xhr.onerror = function(e) {
			deferred.reject(JSON.stringify(xhr));
		};
		xhr.send();
		this.filePromise = deferred.promise();
	}
});

asyncTest('should return a font object', 1, function() {
	this.filePromise.then(
		function(thefile) {
			fontificate(thefile).then(
				function(font) {
					ok(font, 'should return a font object');
				})
			.always(function() {
				start();
			});
		}, function(e) {	
			ok(false, 'should return a file, instead returned '+e);
			start();
	});
});

asyncTest('should initialize headers', 2, function() {
	this.filePromise.then(
		function(thefile) {
			fontificate(thefile).then(
				function(font) {
					equal(font.head, undefined, 'should not have initialized header');
					font.initTables();
					ok(font.head, 'should initialize head');
				})
			.always(function() {
				start();
			});
		}, function(e) {	
			ok(false, 'should return a file, instead returned '+e);
			start();
	});
});

asyncTest('should initialize headers if given doInit parameter', 1, function() {
	this.filePromise.then(
		function(thefile) {
			fontificate(thefile, true).then(
				function(font) {
					ok(font.head, 'should initialize head first');
				})
			.always(function() {
				start();
			});
		}, function(e) {	
			ok(false, 'should return a file, instead returned '+e);
			start();
	});
});

}(jQuery));
