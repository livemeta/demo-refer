/*******************
********************

HTML5 / Javascript: 
get hash of files using drag and drop

Developed by Marco Antonio Alvarez => https://github.com/marcu87/hashme

*******************/

function url2Base64_V2(url) {
	var canvas =document.createElement('canvas');
	document.body.appendChild(canvas);

	var img=new Image();
	img.src=url;

	img.onload=function() {
		ctx=canvas.getContext('2d');
		canvas.height=img.height;
		canvas.width=img.width;
		ctx.drawImage(img, 0,0);
	
		//console.log(canvas.toDataURL());
		copyToClipboard(canvas.toDataURL());
		console.log('done!');
	};
	if (img.complete) {
		console.log('cached!');
		img.onload();
	}
	
	
	function copyToClipboard(str) {

	  // Create an auxiliary hidden input
	  var aux = document.createElement("input");

	  // Get the text from the element passed into the input
	  aux.setAttribute("value", str);

	  // Append the aux input to the body
	  document.body.appendChild(aux);

	  // Highlight the content
	  aux.select();

	  // Execute the copy command
	  document.execCommand("copy");

	  // Remove the input from the body
	  document.body.removeChild(aux);

	}
}


var hashMe = function (file, callback) {
    var fileManager = new FileReader;
    
    this.md5sum = function (start, end) {
        this._hash = rstr2hex(rstr_md5(start + end));
        callback(this._hash);
    };
    
    this.getHash = function() {
        return this._hash;
    };
    
    this.calculateHashOfFile = function (file) {
        fileManager.onload = function (f) {
            this._hash = rstr2hex(rstr_md5(f.target.result));
            callback(this._hash);
        };
        fileManager.readAsBinaryString(file.slice(0, file.size));
    };
    
    this.calculateHashOfFile(file);
};
function url2Base64(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function ()
    {
        if (this.readyState === 4) {  // 4 = "loaded"
            if (this.status === 200) { // 200 = OK
                toBase64(this.response);
            } else {
                console.error('Problem retrieving remote data');
            }
        }
    };
    xhr.send(null);

    function toBase64(blob) {
        // get binary data as a response
		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function() {
			base64data = reader.result;
			var img = document.createElement('img');
			img.src = base64data;	 // console.log(base64data);
			document.body.appendChild(img);
		}
    }
}

function url2Md5(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function ()
    {
        if (this.readyState === 4) {  // 4 = "loaded"
            if (this.status === 200) { // 200 = OK
                calMd5Sum(this.response);
            } else {
                console.error('Problem retrieving remote data');
            }
        }
    };
    xhr.send(null);

    function calMd5Sum(file) {
        var fileManager = new FileReader();
        fileManager.onload = function (f) {
            this._hash = rstr2hex(rstr_md5(f.target.result));
            console.log(this._hash);
        };
        fileManager.readAsBinaryString(file.slice(0, file.size));
    }
}
// location.href='http://res.mg.netease.com:8797/html5/hashme/';
// url2Md5('http://loot-hoarder-cache/hotpatch/1801.js')
// url2Md5('http://54.223.160.137/1702.js')