
function autoBom(blob) {
  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob(['\ufeff', blob], {type: blob.type});
  }

  return blob;
}

// only get URL when necessary in case Blob.js hasn't overridden it yet
function getURL() {
  return view.URL || view.webkitURL || view;
}

function revoke(file) {
  setTimeout(revoker, arbitraryRevokeTimeout);

  ///////////

  function revoker() {
    if (typeof file === 'string') { // file is an object URL
      getURL().revokeObjectURL(file);
    } else { // file is a File
      file.remove(function(){});
    }
  }
}



function throwOutside(ex) {
  setImmediate(function () {
    throw ex;
  }, 0);
}

function triggerClickOnSaveLink() {
  var event = new MouseEvent('click');
  saveLinkElement.dispatchEvent(event);
}
