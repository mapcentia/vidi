var FSProto = FileSaver.prototype;
FSProto.abort = fileSaverAbort;
FSProto.INIT = 0;
FSProto.WRITING = 1;
FSProto.DONE = 2;
FSProto.readyState = FSProto.INIT;
FSProto.error = null;
FSProto.onwritestart = null;
FSProto.onprogress = null;
FSProto.onwrite = null;
FSProto.onabort = null;
FSProto.onerror = null;
FSProto.onwriteend = null;


function FileSaver(blob, name) {
  this.blob = blob = autoBom(blob);
  this.saveUsingObjectURLs = saveUsingObjectURLs;
  this.execSave = execSave;

  // First try a.download, then web filesystem, then object URLs
  var filesaver = this;
  var type = blob.type;
  var blobChanged = false;
  var objectUrl;
  var targetView;


  filesaver.readyState = filesaver.INIT;
  name = name || 'download';

  if ( canUseSaveLink ) {
    return saveUsingLinkElement();
  }

  fixChromeSaveableType();
  fixWebKitDownload();


  if ( ! reqFs ) {
    return saveUsingObjectURLs();
  }

  return saveUsingFyleSystem(filesaver);


  ////////////////

  function saveUsingLinkElement() {
    objectUrl = getURL().createObjectURL(blob);
    saveLinkElement.href = objectUrl;
    saveLinkElement.download = name;

    setImmediate(function () {
      triggerClickOnSaveLink();
      dispatchAll(filesaver);
      revoke(objectUrl);
      filesaver.readyState = filesaver.DONE;
    }, 0);
  }

  function fixChromeSaveableType() {
    /*
     * Object and web filesystem URLs have a problem saving in Google Chrome when
     * viewed in a tab, so I force save with application/octet-stream
     * http://code.google.com/p/chromium/issues/detail?id=91158
     * Update: Google errantly closed 91158, I submitted it again:
     * https://code.google.com/p/chromium/issues/detail?id=389642
     */
    if (view.chrome && type && type !== forceSaveableType) {
      var slice = blob.slice || blob.webkitSlice;
      blob = slice.call(blob, 0, blob.size, forceSaveableType);
      blobChanged = true;
    }
  }

  function fixWebKitDownload() {
    // Since I can't be sure that the guessed media type will trigger a download
    // in WebKit, I append .download to the filename.
    // https://bugs.webkit.org/show_bug.cgi?id=65440
    if (webkitReqFs && name !== 'download') {
      name += '.download';
    }

    if (type === forceSaveableType || webkitReqFs) {
      targetView = view;
    }
  }


  // on any filesys errors revert to saving with object URLs
  function saveUsingObjectURLs() {
    // don't create more object URLs than needed
    if (blobChanged || ! objectUrl) {
      objectUrl = getURL().createObjectURL(blob);
    }

    execSave(objectUrl);
  }


  function execSave(objectUrl, file, event) {

    if( targetView ) {
      targetView.location.href = objectUrl;
    } else {
      var newTab = view.open(objectUrl, '_blank');
      if ( newTab === undefined ) {
        /*
         * Apple do not allow window.open
         * see http://bit.ly/1kZffRI
         */
        view.location.href = objectUrl;
      }
    }


    filesaver.readyState = filesaver.DONE;

    if( ! event ) {
      dispatchAll(filesaver);
    } else {
      dispatch(filesaver, 'writeend', event);
    }

    revoke(file || objectUrl);
  }

}

function fileSaverAbort() {
  var filesaver = this;
  filesaver.readyState = filesaver.DONE;
  dispatch(filesaver, 'abort');
}


// TODO apply dispatch to FileSaver prototype
function dispatchAll(filesaver) {
  dispatch(filesaver, 'writestart progress write writeend'.split(' '));
}


function dispatch(filesaver, eventTypes, event) {
  eventTypes = [].concat(eventTypes);
  var i = eventTypes.length;
  while (i--) {
    var listener = filesaver['on' + eventTypes[i]];
    if (typeof listener === 'function') {
      try {
        listener.call(filesaver, event || filesaver);
      } catch (ex) {
        throwOutside(ex);
      }
    }
  }
}
