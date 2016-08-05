
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
var view = root.self || root.window || root.content;
var saveLinkElement = view.document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
var canUseSaveLink = 'download' in saveLinkElement;
var webkitReqFs = view.webkitRequestFileSystem;
var reqFs = view.requestFileSystem || webkitReqFs || view.mozRequestFileSystem;
var forceSaveableType = 'application/octet-stream';
var fsMinSize = 0;

// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
// for the reasoning behind the timeout and revocation flow
var arbitraryRevokeTimeout = 500;
var setImmediate = view.setImmediate || view.setTimeout;

function saveAs(blob, name) {
  return new FileSaver(blob, name);
}

