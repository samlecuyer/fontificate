/*! fontificate - v0.0.1 - 2012-09-19
* Copyright (c) 2012 sam l'ecuyer; Licensed MIT */
(function(window, undefined) {
	
	function _StreamReader(arrayBuffer, offset) {
		var i = offset || 0;
		var view = new window.DataView(arrayBuffer, i);

		this.getInt8 = function() { return view.getInt8(i++); };
		this.getUint8 = function() { return view.getUint8(i++); };

		this.getInt16 = function() { return i+= 2, view.getInt16(i-2); };
		this.getUint16 = function() { return i+= 2,view.getUint16(i-2); };

		this.getInt32 = function() { return i += 4, view.getInt32(i-4); };
		this.getUint32 = function() { return i += 4, view.getUint32(i-4); };
		this.backup = function(bytes) { i -= bytes; };
		this.offset = function() { return i };
		this.goto = function(l) { i = l };

		this.readString = function(count) {
			var str = '';
			for (;count > 0; count--) {
				str += String.fromCharCode(this.getUint8());
			}
			return str;
		}
		this.getStringAt = function(start, len) {
			var str = '';
			for (var k = 0; k < len; k++) {
				str += String.fromCharCode(view.getInt8(start+k));
			}
			return str;
		}
	}
	
	function readTableDirectory(slr) {
		var ret = {};
		ret.tag = slr.readString(4);
		ret.crc = slr.getUint32();
		ret.offset = slr.getUint32();
		ret.len = slr.getUint32();
		return ret;
	}
	
	function populateNamesTable(font) {
		var tb = font.tables.filter(function(tb) {
			return tb.tag === 'name';
		})[0];
		var slr = font.stream;
		slr.goto(tb.offset);
		var namesTable = { records: [] };
		namesTable.version = slr.getUint16();
		var count = slr.getUint16();
		var stringOffset = slr.getUint16();
		for (var i = 0; i < count; i++) {
			var record = {};
			record.platformID = slr.getUint16();
			record.platformSpecificID = slr.getUint16();
			record.language = slr.getUint16();
			record.nameID = slr.getUint16();
			var length = slr.getUint16();
			var offset = slr.getUint16();
			record.text = slr.getStringAt(tb.offset + stringOffset + offset, length);
			namesTable.records.push(record);
		}
		tb.data = namesTable;
	}
	
	function Font(slr){
		this.stream = slr;
	}
	Font.prototype = {
		tables: [],
		getNamesForLanguage: function(lang) {
			var tb = this.tables.filter(function(tb) {
				return tb.tag === 'name';
			})[0];
			return tb.data.records.filter(function(name) {
				return name.language === lang;
			});
		}
	};
	
	function getFontFromResults(result) {
		var slr = new _StreamReader(result);
		var font = new Font(slr);
		font.version = slr.getUint32();
		if (font.version !== 0x74727565 && font.version !== 0x00010000) {
			throw "This is not a valid TrueType font, according to the spec."
		}
		var numberOfTables = slr.getUint16();
		var searchRange = slr.getUint16();
		var entrySelector = slr.getUint16();
		var rangeShift = slr.getUint16();
		for (var i = 0; i < numberOfTables; i++) {
			var table = readTableDirectory(slr);
			font.tables.push(table);
		}
		populateNamesTable(font);
		return font;
	}
	
	window.fontificate = fontificate;
	function fontificate(file) {
		var deferred = K.defer();
		var reader = new FileReader();
		reader.onload = function(thefile) {
			try {
				var font = getFontFromResults(this.result);
				deferred.resolve(font);
			} catch (e) {
				deferred.reject(e);
			}
		};
		reader.readAsArrayBuffer(file);
		return deferred.promise;
	}
	
})(window);