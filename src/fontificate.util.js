
function LinearStreamReader(arrayBuffer, offset) {
	var i = offset || 0;
	var view = new window.DataView(arrayBuffer, i);
	// TODO: bounds checking
	this.getInt8 = function() { return view.getInt8(i++); };
	this.getUint8 = function() { return view.getUint8(i++); };
	this.getInt16 = function() { return i+= 2,view.getInt16(i-2); };
	this.getUint16 = function() { return i+= 2,view.getUint16(i-2); };
	this.getInt32 = function() { return i += 4, view.getInt32(i-4); };
	this.getUint32 = function() { return i += 4, view.getUint32(i-4); };
	this.getFloat32 = function() { return i += 4, view.getFloat32(i-4); };
	this.getInt64 = function() { 
		var hb = this.getInt32(), lb;
		if (hb === 0) { // this is a horrifying hack
			return this.getUint32();
		} else {
			lb = this.getInt32();
			return hb << 32 | lb;
		}
	};
	this.backup = function(bytes) { i -= bytes; };
	this.offset = function() { return i; };
	this.goto = function(l) { i = Math.max(l,0); };

	this.readString = function(count) {
		var str = this.getStringAt(i, count);
		i += count;
		return str;
	};
	this.getStringAt = function(start, len) {
		var str = '';
		for (var k = 0; k < len; k++) {
			str += String.fromCharCode(view.getInt8(start+k));
		}
		return str;
	};
	this.get32Fixed = function() {
		var ret = 0.0;
		ret = this.getInt16();
		ret += (this.getInt16()/65536);
		return ret;
	};
	this.getUint8Array = function(len) { 
		var ret = [];
		for (var i = 0; i < len; i++) {
			ret[i] = this.getUint8();
		} 
		return ret;
	};
	this.getUint16Array = function(len) { 
		var ret = [];
		for (var i = 0; i < len; i++) {
			ret[i] = this.getUint16();
		} 
		return ret;
	};
	this.getInternationalDate = function() {
		var secondsSince1904 = this.getInt64();
		var millisFor1904 = Date.UTC(1904,0,1);
		millisFor1904 += secondsSince1904 * 1000;
		return new Date(millisFor1904);
	};
}

var nameLabels =
['Copyright notice','Font family','Font subfamily','Subfamily identifier','Full name', 'Version',
'Postscript name','Trademark notice','Manufacturer name','Designer','Description','Vendor Url',
'Designer Url','License'];
var platformIds = 
['Unicode','Macintosh',undefined,'Microsoft'];

var macEncodingIds =
['Roman','Japansese','Traditional Chinese','Korean','Arabic','Hebrew','Greek','Russian','RSymbol',
'Devanagari','Gurmukhi','Gujarati','Oriya','Bengali','Tamil','Telugu','Kannada','Malayalam',
'Sinhalese','Burmese','Khmer','Thai','Laotian','Georgian','Armenian','Simplified Chinese','Tibetan',
'Mongolian','Geez','Slavic','Vietnamese','Sindhi'];

var uniEncodingIds = 
['Default semantics', 'Version 1.1 semantics', 'ISO 10646 1993 semantics (deprecated)',
'Unicode 2.0 or later semantics'];

var macRomanEncoding = 
['.notdef','.null','nonmarkingreturn','space','exclam','quotedbl','numbersign','dollar','percent','ampersand', 
'quotesingle','parenleft','parenright','asterisk','plus','comma','hyphen','period','slash','zero','one','two',
'three','four','five','six','seven','eight','nine','colon','semicolon','less','equal','greater','question','at',
'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','bracketleft',
'backslash','bracketright','asciicircum','underscore','grave','a','b','c','d','e','f','g','h','i','j','k','l','m','n',
'o','p','q','r','s','t','u','v','w','x','y','z','braceleft','bar','braceright','asciitilde','Adieresis','Aring',
'Ccedilla','Eacute','Ntilde','Odieresis','Udieresis','aacute','agrave','acircumflex','adieresis','atilde','aring',
'ccedilla','eacute','egrave','ecircumflex','edieresis','iacute','igrave','icircumflex','idieresis','ntilde','oacute',
'ograve','ocircumflex','odieresis','otilde','uacute','ugrave','ucircumflex','udieresis','dagger','degree','cent',
'sterling','section','bullet','paragraph','germandbls','registered','copyright','trademark','acute','dieresis',
'notequal','AE','Oslash','infinity','plusminus','lessequal','greaterequal','yen','mu','partialdiff','summation',
'product','pi','integral','ordfeminine','ordmasculine','Omega','ae','oslash','questiondown','exclamdown','logicalnot',
'radical','florin','approxequal','Delta','guillemotleft','guillemotright','ellipsis','nonbreakingspace','Agrave','Atilde',
'Otilde','OE','oe','endash','emdash','quotedblleft','quotedblright','quoteleft','quoteright','divide','lozenge','ydieresis',
'Ydieresis','fraction','currency','guilsinglleft','guilsinglright','fi','fl','daggerdbl','periodcentered','quotesinglbase',
'quotedblbase','perthousand','Acircumflex','Ecircumflex','Aacute','Edieresis','Egrave','Iacute','Icircumflex','Idieresis',
'Igrave','Oacute','Ocircumflex','apple','Ograve','Uacute','Ucircumflex','Ugrave','dotlessi','circumflex','tilde','macron',
'breve','dotaccent','ring','cedilla','hungarumlaut','ogonek','caron','Lslash','lslash','Scaron','scaron','Zcaron','zcaron',
'brokenbar','Eth','eth','Yacute','yacute','Thorn','thorn','minus','multiply','onesuperior','twosuperior','threesuperior',
'onehalf','onequarter','threequarters','franc','Gbreve','gbreve','Idotaccent','Scedilla','scedilla','Cacute','cacute',
'Ccaron','ccaron','dcroat']; // minify *this*

function getTableByTag(font, tag) {
	var tb = font.tables.filter(function(tb) {
		return tb.tag === tag;
	});
	return tb? tb[0]: undefined;
}

function linearTransformX(comp, x, y) {
	var x1 = Math.round(x * comp.xscale + y * comp.scale10);
	return x1 + comp.xtranslate;
}
function linearTransformY(comp, x, y) {
	var y1 = Math.round(x * comp.scale01 + y * comp.yscale);
	return y1 + comp.ytranslate;
}
