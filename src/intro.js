(function(module) {
	if (typeof define === "function") {
		define('fontificate', ['jquery'], module);
	} else {
		window.fontificate = module(jQuery);
	}
})(function($, undefined) {
	"use strict";
