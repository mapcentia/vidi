
function saveUsingFyleSystem(filesaver) {
  fsMinSize += filesaver.blob.size;
  var createIfNotFound = {create: true, exclusive: false};

  reqFs(view.TEMPORARY, fsMinSize, abortable(getFyleSystem), filesaver.saveUsingObjectURLs);

  ////////////

  function getFyleSystem(fs) {
    fs.root.getDirectory('temp', createIfNotFound, abortable(getTempDirectory), filesaver.saveUsingObjectURLs);
  }

  function getTempDirectory(dir) {
    dir.getFile(name, { create: false }, abortable(getExistentFileForRemove), abortable(existentFileNotFound) );

    /////////////

    function getExistentFileForRemove(file) {
      // delete file if it already exists
      file.remove(function() {
        save();
      });
    }

    function existentFileNotFound(ex) {
      if (ex.name === 'NotFoundError') {
        save();
      } else {
        filesaver.saveUsingObjectURLs();
      }
    }

    //////////

    function save() {
      dir.getFile(name, createIfNotFound, abortable(getFileForWrite), filesaver.saveUsingObjectURLs);
    }

    function getFileForWrite(file) {
      file.createWriter(abortable(createWriter), filesaver.saveUsingObjectURLs);

      ////////

      function createWriter(writer) {
        writer.onwriteend = onWriterEnd;
        writer.onerror = onError;

        bindEventsToWriter();

        writer.write(blob);
        filesaver.abort = onAbort;
        filesaver.readyState = filesaver.WRITING;

        ////////////

        function onWriterEnd(event) {
          filesaver.execSave(file.toURL(), file, event);
        }

        function onError() {
          var error = writer.error;
          if (error.code !== error.ABORT_ERR) {
            filesaver.saveUsingObjectURLs();
          }
        }

        function bindEventsToWriter() {
          'writestart progress write abort'.split(' ').forEach(function (event) {
            writer['on' + event] = filesaver['on' + event];
          });
        }

        function onAbort() {
          writer.abort();
          filesaver.readyState = filesaver.DONE;
        }
      }
    }
  }

  function abortable(func) {
    return function () {
      if (filesaver.readyState !== filesaver.DONE) {
        return func.apply(this, arguments);
      }
    };
  }
}
