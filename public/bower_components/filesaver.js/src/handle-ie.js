if (root.navigator !== undefined) {

  /*
   * IE <10 is explicitly unsupported
   */
  if (/MSIE [1-9]\./.test(root.navigator.userAgent)) {
    return;
  }

  /*
   * IE 10+ (native saveAs)
   */
  if (root.navigator.msSaveOrOpenBlob) {
    return nativeIeSaveAs;
  }

}

function nativeIeSaveAs(blob, name) {
  return root.navigator.msSaveOrOpenBlob(autoBom(blob), name);
}
