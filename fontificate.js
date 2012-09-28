/*! fontificate.js - v0.0.1 - 2012-09-28
* https://github.com/samlecuyer/fontificate
* Copyright (c) 2012 Sam L'Ecuyer; Licensed MIT */
(function(e,t,n){"use strict";function s(e){var t=e.boundingBox,n='<path d="',r=e.getSegmentedPoints(),i=r.xcoords,s=r.ycoords,o=r.flags;for(var u=0;u<e.getContourCount();u++)for(var a=0;a<o[u].length;a++)a===0?n+=" M"+i[u][a]+","+s[u][a]:o[u][a]&1?n+=" L"+i[u][a]+","+s[u][a]:o[u][a+1]&1||a===o[u].length-2?(n+=" Q"+i[u][a]+","+s[u][a],n+=" "+i[u][a+1]+","+s[u][a+1],a++):a<o[u].length-2&&(console.log("TODO: handle higher than n=3 b-splines"),n+=" C"+i[u][a]+","+s[u][a],n+=" "+i[u][a+1]+","+s[u][a+1],n+=" "+i[u][a+2]+","+s[u][a+2],a+=2);return n+='"/>',n}function o(t,n){var r=n||0,i=new e.DataView(t,r);this.getInt8=function(){return i.getInt8(r++)},this.getUint8=function(){return i.getUint8(r++)},this.getInt16=function(){return r+=2,i.getInt16(r-2)},this.getUint16=function(){return r+=2,i.getUint16(r-2)},this.getInt32=function(){return r+=4,i.getInt32(r-4)},this.getUint32=function(){return r+=4,i.getUint32(r-4)},this.getFloat32=function(){return r+=4,i.getFloat32(r-4)},this.getInt64=function(){this.getInt32()<<32|this.getInt32()},this.backup=function(e){r-=e},this.offset=function(){return r},this.goto=function(e){r=Math.max(e,0)},this.readString=function(e){var t=this.getStringAt(r,e);return r+=e,t},this.getStringAt=function(e,t){var n="";for(var r=0;r<t;r++)n+=String.fromCharCode(i.getInt8(e+r));return n},this.get32Fixed=function(){var e=0;return e=this.getInt16(),e+=this.getInt16()/65536,e},this.getUint8Array=function(e){var t=[];for(var n=0;n<e;n++)t[n]=this.getUint8();return t},this.getUint16Array=function(e){var t=[];for(var n=0;n<e;n++)t[n]=this.getUint16();return t}}function h(e,t){var r=e.tables.filter(function(e){return e.tag===t});return r?r[0]:n}function p(e){var t={};return t.tag=e.readString(4),t.crc=e.getUint32(),t.offset=e.getUint32(),t.len=e.getUint32(),t}function v(e){var t={};t.firstGlyph=e.getUint16();var n=e.getUint16();return t.offsets=e.getUint16Array(n),t}function m(e,t){t.goto(e),this.numberOfContours=t.getInt16(),this.boundingBox={},this.boundingBox.llX=t.getInt16(),this.boundingBox.llY=t.getInt16(),this.boundingBox.upX=t.getInt16(),this.boundingBox.upY=t.getInt16();if(this.numberOfContours>=0){var n=t.getUint16Array(this.numberOfContours),r=t.getUint16();this.instructions=t.getUint8Array(r);var i=n[n.length-1]+1;this.flags=[];for(var s=0;s<i;s++){var o=t.getUint8();this.flags.push(o);if(o&8){var u=t.getUint8();for(var a=0;a<u;a++)this.flags.push(o);s+=u}}var f=[],l=[],c=0,h=0;for(var s=0;s<i;s++){var o=this.flags[s];o&16?o&2&&(c+=t.getUint8()):o&2?c+=-t.getUint8():c+=t.getInt16(),f[s]=c}for(var s=0;s<i;s++){var o=this.flags[s];o&32?o&4&&(h+=t.getUint8()):o&4?h+=-t.getUint8():h+=t.getInt16(),l[s]=h}this.xCoords=f,this.yCoords=l,this.endPtsOfContours=n}else if(this.numberOfContours===-1){this.components=[];var p;do{p={},p.flags=t.getUint16(),p.glyphIndex=t.getUint16(),p.flags&1?(p.argument1=t.getUint16(),p.argument2=t.getUint16()):(p.argument1=t.getUint8(),p.argument2=t.getUint8()),p.flags&2?(p.xtranslate=p.argument1,p.xtranslate=p.argument2):(p.point1=p.argument1,p.point2=p.argument2);if(p.flags&8){var s=t.getInt16();p.xscale=s/16384,p.yscale=s/16384}else p.flags&64?(p.xscale=t.getInt16()/16384,p.yscale=t.getInt16()/16384):p.flags&128&&(p.xscale=t.getInt16()/16384,p.scale01=t.getInt16()/16384,p.scale10=t.getInt16()/16384,p.yscale=t.getInt16()/16384);this.components.push(p)}while(p.flags&32)}}function g(e){this.stream=e}function y(e){var t=new o(e),n=new g(t);n.version=t.getUint32();if(n.version!==1953658213&&n.version!==65536)throw"This is not a valid TrueType font, according to the spec.";var r=t.getUint16(),i=t.getUint16(),s=t.getUint16(),u=t.getUint16();for(var a=0;a<r;a++){var f=p(t);n.tables.push(f)}return d.name(n),n}function b(e,n){var r=new t.Deferred;try{var i=new FileReader;i.onloadend=function(e){console.log("\nloaded");try{var t=y(this.result);n&&t.initTables(),r.resolve(t)}catch(i){r.reject(i)}},i.onerror=function(e){r.reject(e)},i.readAsArrayBuffer(e)}catch(s){r.reject(s)}return r.promise()}var r=function(e,t){if(e!=="svg")throw"Unsupported rendering output format";this.font=t};r.prototype={render:function(e,t){var n=this.font.getTextAsGlyphIds(e),r=0,i="",o=0;for(var u in n){var a=this.font.getHmtxForChar(n[u]),f=this.font.getKernForPair(n[u-1],n[u]),l=this.font.glyf.glyphs[n[u]],c="";try{if(l){var h=s(l);c='<g transform="translate('+(r+Math.max(a.leftSideBearing,0)+f)+', 0)">\n'+h+"\n</g>"}}catch(p){console.log('error rendering "'+e[u]+'": '+p)}i+=c,r+=a.advanceWidth+f}i+='\n<line x1="0" y1="0" x2="'+r+'" y2="0" style="stroke-width: 10; stroke: red;"/>';var d=this.font.hhea.ascender-this.font.hhea.descender,v='<g transform="translate(0,'+this.font.hhea.ascender+') scale(1,-1)">\n'+i+"\n</g>",m='<svg height="'+t+'px" viewBox="0 '+this.font.hhea.descender+" "+r+" "+(d-this.font.hhea.descender)+'" xmlns="http://www.w3.org/2000/svg" version="1.1">\n'+v+"\n</svg>";return m}};var i={},u=["Copyright notice","Font family","Font subfamily","Subfamily identifier","Full name","Version","Postscript name","Trademark notice","Manufacturer name","Designer","Description","Vendor Url","Designer Url","License"],a=["Unicode","Macintosh",n,"Microsoft"],f=["Roman","Japansese","Traditional Chinese","Korean","Arabic","Hebrew","Greek","Russian","RSymbol","Devanagari","Gurmukhi","Gujarati","Oriya","Bengali","Tamil","Telugu","Kannada","Malayalam","Sinhalese","Burmese","Khmer","Thai","Laotian","Georgian","Armenian","Simplified Chinese","Tibetan","Mongolian","Geez","Slavic","Vietnamese","Sindhi"],l=["Default semantics","Version 1.1 semantics","ISO 10646 1993 semantics (deprecated)","Unicode 2.0 or later semantics"],c=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"],d={head:function(e){var t=h(e,"head"),n=e.stream;n.goto(t.offset);var r={};r.version=n.get32Fixed(),r.revision=n.get32Fixed(),r.checkSumAdjustment=n.getUint32(),r.magic=n.getUint32();if(r.magic!==1594834165)throw"Font header has incorrect magic number";r.flags=n.getUint16(),r.unitsPerEm=n.getUint16(),r.created=n.getInt64(),r.modified=n.getInt64(),r.xMin=n.getInt16(),r.yMin=n.getInt16(),r.xMax=n.getInt16(),r.yMax=n.getInt16(),r.macStyle=n.getUint16(),r.lowestRecPPEM=n.getUint16(),r.fontDirectionHint=n.getInt16(),r.indexToLocFormat=n.getInt16(),r.glyphDataFormat=n.getInt16(),e.head=Object.freeze(r)},name:function(e){var t=h(e,"name"),n=e.stream;n.goto(t.offset);var r={records:[]};r.version=n.getUint16();var i=n.getUint16(),s=n.getUint16();for(var o=0;o<i;o++){var u={};u.platformID=n.getUint16(),u.platformSpecificID=n.getUint16(),u.language=n.getUint16(),u.nameID=n.getUint16();var a=n.getUint16(),f=n.getUint16();u.text=n.getStringAt(t.offset+s+f,a),r.records.push(u)}e.name=r},hhea:function(e){var t=h(e,"hhea"),n=e.stream;n.goto(t.offset);var r={};r.version=n.get32Fixed(),r.ascender=n.getInt16(),r.descender=n.getInt16(),r.lineGap=n.getInt16(),r.advanceWidthMax=n.getUint16(),r.minLeftSideBearing=n.getInt16(),r.minRightSideBearing=n.getInt16(),r.xMaxExtent=n.getInt16(),r.caretSlopeRise=n.getInt16(),r.caretSlopeRun=n.getInt16(),r.reserved1=n.getInt16(),r.reserved2=n.getInt16(),r.reserved3=n.getInt16(),r.reserved4=n.getInt16(),r.reserved5=n.getInt16(),r.metricDataFormat=n.getInt16(),r.numberOfHMetrics=n.getUint16(),e.hhea=Object.freeze(r)},maxp:function(e){var t=h(e,"maxp"),n=e.stream;n.goto(t.offset);var r={};r.version=n.get32Fixed(),r.numGlyphs=n.getInt16(),r.maxPoints=n.getInt16(),r.maxContours=n.getInt16(),r.maxComponentPoints=n.getInt16(),r.maxComponentContours=n.getInt16(),r.maxZones=n.getInt16(),r.maxTwilightPoints=n.getInt16(),r.maxStorage=n.getInt16(),r.maxFunctionDefs=n.getInt16(),r.maxInstructionDefs=n.getInt16(),r.maxStackElements=n.getInt16(),r.maxSizeOfInstructions=n.getInt16(),r.maxComponentElements=n.getInt16(),r.maxComponentDepth=n.getInt16(),e.maxp=Object.freeze(r)},post:function(e){var t=h(e,"post"),n=e.stream;n.goto(t.offset);var r={};r.format=n.get32Fixed(),r.italicAngle=n.get32Fixed(),r.underlinePosition=n.getInt16(),r.underlineThickness=n.getInt16(),r.isFixedPitch=n.getUint32(),r.minMemType42=n.getUint32(),r.maxMemType42=n.getUint32(),r.minMemType1=n.getUint32(),r.maxMemType1=n.getUint32();var i=[],s;if(r.format===1)for(s=0;s<258;s++)i[s]=c[s];else if(r.format===2){var o=n.getUint16(),u=new Array(o),a=Number.MIN_VALUE;for(s=0;s<o;s++){var f=n.getUint16();u[s]=f,a=Math.max(a,f)}var l=[];if(a>=258)for(s=0;s<a-258+1;s++){var p=n.getUint8();l[s]=n.readString(p)}for(s=0;s<o;s++){var f=u[s];if(f<258)i[s]=c[s];else{if(!(f>=258&&f<=32767))throw"Unknow glyph name: "+f;i[s]=l[f-258]}}}r.glyphNames=i,e.post=Object.freeze(r)},loca:function(e){var t=h(e,"loca"),n=e.stream;n.goto(t.offset);var r={},i=e.head.indexToLocFormat,s=e.maxp.numGlyphs;r.offsets=new Array(s+1);for(var o=0;o<s+1;o++)if(i===0)r.offsets[o]=n.getUint16()*2;else{if(i!==1)throw"Font contains invalid glyph IndexToLocFormat";r.offsets[o]=n.getUint32()}e.loca=Object.freeze(r)},cmap:function(e){var t=h(e,"cmap"),n=e.stream;n.goto(t.offset);var r={},i=n.getUint16(),s=n.getUint16(),o=new Array(s),u,a;for(a=0;a<s;a++)u={},u.platformID=n.getUint16(),u.platformSpecificID=n.getUint16(),u.offset=n.getUint32(),o[a]=u;for(a=0;a<s;a++){u=o[a],n.goto(t.offset+u.offset),u.format=n.getUint16(),u.length=n.getUint16(),u.language=n.getUint16(),u.glyphIndexArray=new Array(256);switch(u.format){case 0:for(var f=0;f<256;f++)u.glyphIndexArray[f]=n.getUint8();break;case 4:var l=e.maxp.numGlyphs,c=n.getUint16(),p=c/2,d=n.getUint16(),v=n.getUint16(),m=n.getUint16(),g=n.getUint16Array(p);n.getUint16();var y=n.getUint16Array(p),b=n.getUint16Array(p),w=n.getUint16Array(p),E=new Array(l),S=n.offset();for(var f=0;f<p;f++){var x=y[f],T=g[f],N=b[f],C=w[f];if(x!==65535&&T!==65535)for(var k=x;k<T;k++)if(C===0)E[(k+N)%65536]=k,u.glyphIndexArray[k]=(k+N)%65536;else{var L=S+(C/2+(k-x)+(a-p))*2;n.goto(L);var A=n.getUint16();A!=0&&(A+=N,A%=65536,E[A]===0&&(E[A]=k,u.glyphIndexArray[k]=A))}}u.glyphToCharacterMap=E}}r.cmaps=o,e.cmap=Object.freeze(r)},glyf:function(e){var t=h(e,"glyf"),n=e.stream;n.goto(t.offset);var r={},i=e.maxp,s=e.loca,o=e.post,u=s.offsets,a=i.numGlyphs,f=o.glyphNames,l=new Array(a);for(var c=0;c<a-1;c++){if(u[c]===u[c+1])continue;var p=new m(t.offset+u[c],n);l[c]=p}for(var c=0;c<a-1;c++)l[c]&&l[c].numberOfContours===-1&&l[c].resolve(l);r.glyphs=l,e.glyf=Object.freeze(r)},hmtx:function(e){var t=h(e,"hmtx"),n=e.stream;n.goto(t.offset);var r={},i=e.hhea.numberOfHMetrics;r.longHorMetric=new Array(i);var s;for(s=0;s<i;s++){var o={};o.advanceWidth=n.getUint16(),o.leftSideBearing=n.getInt16(),r.longHorMetric[s]=o}var u=r.longHorMetric[s-1].advanceWidth;for(;s<e.maxp.numGlyphs;s++){var o={};o.advanceWidth=u,o.leftSideBearing=n.getInt16(),r.longHorMetric[s]=o}e.hmtx=Object.freeze(r)},kern:function(e){var t=h(e,"kern");if(!t)return;var n=e.stream;n.goto(t.offset);var r={},i=n.getUint16(),s=n.getUint16();i===1&&s===0?(r.version=1,r.nTables=n.getUint32()):(r.version=i,r.nTables=s),r.tables=new Array(r.nTables);for(var o=0;o<r.nTables;o++){var u={};u.start=n.offset(),u.length=n.getUint32(),u.coverage=n.getUint16(),u.tupleIndex=n.getUint16();switch(u.coverage&255){case 0:var a=n.getUint16(),f=n.getUint16(),l=n.getUint16(),c=n.getUint16();u.pairs={};for(var p=0;p<u.nPairs;p++){var d=n.getUint32(),m=n.getInt16();u.pairs[d]=m}break;case 2:var g=n.getUint16(),y=n.getUint16(),b=n.getUint16(),w=n.getUint16();n.goto(u.start+y),u.leftOffsetTable=v(n),n.goto(u.start+b),u.rightOffsetTable=v(n)}r.tables[o]=u}e.kern=Object.freeze(r)}};m.prototype={resolve:function(e){if(this.numberOfContours===-1){var t=0,n=0;this.glyphs=e;for(var r in this.components){var i=this.components[r];i.firstIndex=t,i.firstContour=n;var s=e[i.glyphIndex];s&&(s.resolve(e),t+=s.getPointCount(),n+=s.getContourCount())}}},getPointCount:function(){if(this.numberOfContours>=0)return this.flags.length;var e=this;return this.components.reduce(function(t,n){var r=e.glyphs[n.glyphIndex];return t+n.glyph.getPointCount()},0)},getContourCount:function(){if(this.numberOfContours>=0)return this.numberOfContours;var e=this;return this.components.reduce(function(t,n){var r=e.glyphs[n.glyphIndex];return t+r.getContourCount()},0)},getSegmentedPoints:function(){var e=[],t=[],n=[];if(this.numberOfContours===1)e.push(this.xCoords),t.push(this.yCoords),n.push(this.flags);else if(this.numberOfContours>1){var r=0;for(var i in this.endPtsOfContours)e.push(this.xCoords.slice(r,this.endPtsOfContours[i]+1)),t.push(this.yCoords.slice(r,this.endPtsOfContours[i]+1)),n.push(this.flags.slice(r,this.endPtsOfContours[i]+1)),r=this.endPtsOfContours[i]+1}else if(this.numberOfContours===-1){var s=this;this.components.forEach(function(r){var i=s.glyphs[r.glyphIndex],o=i.getSegmentedPoints();for(var u=0;u<o.flags.length;u++)e.push(o.xcoords[u]),t.push(o.ycoords[u]),n.push(o.flags[u])})}return{xcoords:e,ycoords:t,flags:n}}},g.prototype={tables:[],getNamesForFont:function(e){return e===n?this.name:this.name.records.filter(function(t){return e===n||t.language===e})},fullName:function(e){var t=this.name.records.filter(function(e){return e.nameID===4});if(t.length===1)return t[0].text;var r=t.filter(function(t){return e===n||t.language===e});return r?r[0].text:n},getGlyphIndexForCharacterCode:function(e){var t=e.charCodeAt(0);for(var n in this.cmap.cmaps){var r=this.cmap.cmaps[n].glyphIndexArray[t];if(r)return r}return 0},getHmtxForChar:function(e){return this.post.isFixedPitch?this.hmtx.longHorMetric[0]:this.hmtx.longHorMetric[e]},getKernForPair:function(e,t){if(this.kern&&e!==n&&t!==n){var r=this.kern.nTables;for(var i=0;i<r;i++){var s=this.kern.tables[i];switch(s.coverage&255){case 0:var o=(e&65535)<<16|t&65535;return s.pairs[o]||0;case 2:var u=0;e>=s.leftOffsetTable.firstGlyph&&(u=s.leftOffsetTable.offsets[e-s.leftOffsetTable.firstGlyph]);var a=0;t>=s.rightOffsetTable.firstGlyph&&(a=s.rightOffsetTable.offsets[t-s.rightOffsetTable.firstGlyph]);var f=u+a;return this.stream.goto(s.start+f),this.stream.getInt16();case 4:}}}return 0},stringToSVG:function(e,t){var n=new r("svg",this);return n.render(e,t)},getTextAsGlyphIds:function(e){var t=new Array(e.length);for(var n=0;n<e.length;n++)t[n]=this.getGlyphIndexForCharacterCode(e[n]);return t},initTables:function(){d.head(this),d.hhea(this),d.maxp(this),d.hmtx(this),d.post(this),d.loca(this),d.glyf(this),d.cmap(this),d.kern(this)}},e.fontificate=b})(window,jQuery);