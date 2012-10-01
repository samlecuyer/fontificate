
var KeySet = function(format, font) {
	if (format !== 'svg') {
		throw 'Unsupported rendering output format';
	}
	this.font = font;
};
KeySet.prototype = {
	render: function(text, height) {
		var glyphIds = this.font.getTextAsGlyphIds(text),
		xOffset = 0,
		output = '',
		maxY = 0;
		for (var i in glyphIds) {
			var hmtx = this.font.getHmtxForChar(glyphIds[i]);
			var kern = this.font.getKernForPair(glyphIds[i-1],glyphIds[i]);
			var glyph = this.font.glyf.glyphs[glyphIds[i]];
			var wrapped = '';
			try {
				if (glyph) {
					var path = getGlyphAsSVGPath(glyph);
					wrapped = '<g transform="translate('+(xOffset + Math.max(hmtx.leftSideBearing, 0) + kern)+', 0)">\n'+path+'\n</g>';
				}
			} catch (e) {
				console.log('error rendering "'+text[i]+'": '+e);
			}
			output += wrapped;
			xOffset += (hmtx.advanceWidth + kern);
		}
		output += '\n<line x1="0" y1="0" x2="'+xOffset+'" y2="0" style="stroke-width: 10; stroke: red;"/>';
		var actualHeight = this.font.hhea.ascender - this.font.hhea.descender;
		var wholeWord = '<g transform="translate(0,'+this.font.hhea.ascender+') scale(1,-1)">\n'+output+'\n</g>';
		var svg = '<svg height="'+height+'px" viewBox="0 '+this.font.hhea.descender+' '+xOffset+' '+
		(actualHeight-this.font.hhea.descender)+'" xmlns="http://www.w3.org/2000/svg" version="1.1">\n'+wholeWord +
		'\n</svg>';
		return svg;
	}
};

var cache = {};
function getGlyphAsSVGPath(glyph) {
	var bb = glyph.boundingBox;
	var svg = '<path d="';

	var segments = glyph.getSegmentedPoints();
	var xcoords = segments.xcoords, 
	ycoords = segments.ycoords, 
	flags = segments.flags;
	for (var i = 0; i < glyph.getContourCount(); i++) {
		for (var k = 0; k < flags[i].length; k++) {
			if (k === 0) {
				svg += " M"+xcoords[i][k]+','+ycoords[i][k];
			} else if (flags[i][k] & 0x01) {
				svg += " L"+xcoords[i][k]+','+ycoords[i][k];
			} else {
				if (flags[i][k+1] & 0x01 || k === flags[i].length-2) {
					svg += " Q"+xcoords[i][k]+','+ycoords[i][k];
					svg += " "+xcoords[i][k+1]+','+ycoords[i][k+1];
					k++;
				} else if (k < flags[i].length-2){
					console.log('TODO: handle higher than n=3 b-splines');
					svg += " C"+xcoords[i][k]+','+ycoords[i][k];
					svg += " "+xcoords[i][k+1]+','+ycoords[i][k+1];
					svg += " "+xcoords[i][k+2]+','+ycoords[i][k+2];
					k += 2;
				}
			}
		}
	}
	svg += '"/>';
	return svg;
}
