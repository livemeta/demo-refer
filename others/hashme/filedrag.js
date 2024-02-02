/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/

(function() {
	// getElementById
	function $id(id) {
		return document.getElementById(id);
	} 


	// output information
	function Output(msg) {
		var m = $id('messages');
		m.innerHTML = msg + m.innerHTML;
	}
    
	function OutputHash(eId, msg) {
        $('#' + eId + ' .hash').html(msg);
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == 'dragover' ? 'hover' : '');
	}


	// file selection
	function FileSelectHandler(e) {
		FileDragHover(e);
		var files = e.target.files || e.dataTransfer.files;
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f, i);
		}

	}

	// output file information
	function ParseFile(file, id) {
		Output(
			'<p id="' + id + '">File information: <strong>' + file.name +
			'</strong> type: <strong>' + file.type +
			'</strong> size: <strong>' + file.size +
			'</strong><span style="color:green;">hash: <strong class="hash">' +
			'</strong></span> ' +
            '</p>'
		);

        // added to process the hash of the files:
        var hash = new hashMe(file, function OutputHash(msg) {
            $('#'+ id +' .hash').html(msg);
        });
	}


	// initialize
	function Init() {
		var fileselect = $id('fileselect'),
			filedrag = $id('filedrag'),
			submitbutton = $id('submitbutton');

		// file select
		fileselect.addEventListener('change', FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			// file drop
			filedrag.addEventListener('dragover', FileDragHover, false);
			filedrag.addEventListener('dragleave', FileDragHover, false);
			filedrag.addEventListener('drop', FileSelectHandler, false);
			filedrag.style.display = 'block';

			// remove submit button
			submitbutton.style.display = 'none';
		}
	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();