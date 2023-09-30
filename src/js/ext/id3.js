
DataView.prototype.str = function(a, b, c, d) {
	//start,length,placeholder,placeholder
	b = b || 1;
	c = 0;
	d = "";
	for(;c<b;) d += String.fromCharCode(this.getUint8(a + c++));
	return d;
}

DataView.prototype.int = function(a) {
	return  (this.getUint8(a) << 21) |
			(this.getUint8(a+1) << 14) |
			(this.getUint8(a+2) << 7) |
			(this.getUint8(a+3));
}

var frID3 = {
	"APIC" : function(x, y, z, q) {
		//DataView,position,id3FrameSize,framesize
		var b = 0,
			c = ["", 0, ""],
			d = 1,
			e,
			/*oUrl,*/
			b64;
		while (b < 3) e = x.getUint8(y+z+d++);
		c[b] += String.fromCharCode(e);
		e != 0 || (b += b == 0 ? (c[1] = x.getUint8(y + z + d), 2) : 1);
		b64 = "data:"+ c[0] +";base64,"+ btoa(String.fromCharCode.apply(null, new Uint8Array(x.buffer.slice(y + z+++d, q))));
		return {
			mime: c[0],
			description: c[2],
			type: c[1],
			base64: b64
		}
	}
}

function readID3(a, b, c, d, e, f, g, h) {
	//DataView,byteLength,position,id3FrameSize,framesize,frameChar,tags,frameName
	if (!(a = new DataView(this.result)) || a.str(0, 3) != "ID3") return;
	g = { Version: "ID3v2."+ a.getUint8(3) +"."+ a.getUint8(4) };
	a = new DataView(a.buffer.slice(10 + ((a.getUint8(5) & 0x40) != 0 ? a.int(10) : 0), a.int(6) + 10));
	b = a.byteLength;
	c = 0;
	d = 10;
	while(true) {
		f = a.str(c);
		e = a.int(c + 4);
		if (b - c < d || (f < "A" || f > "Z") || c + e > b) break;
		g[h = a.str(c, 4)] = frID3[h] ? frID3[h](a, c, d, e) : a.str(c + d, e);
		c += e + d;
	}
	console.log(g);
	return g;
}

/*
function readFile() {
	var a=new FileReader();
	a.onload=readID3;
	a.readAsArrayBuffer(this.files[0]);
}

var file=document.createElement("input");
file.type="file";
file.addEventListener("change",readFile,false);
document.body.appendChild(file);
*/