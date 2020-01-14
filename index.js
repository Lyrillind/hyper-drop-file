SESSION_USER_DATA = "SESSION_USER_DATA"

let _store

function sendSessionData(uid, data, escaped) {
  return ((dispatch, getState) => {
    dispatch({
      type: SESSION_USER_DATA,
      data,
      effect() {
        // If no uid is passed, data is sent to the active session.
        const targetUid = uid || getState().sessions.activeUid;
        rpc.emit('data', {uid: targetUid, data, escaped});
      }
    });
  })(_store.dispatch, _store.getState);
}

function getCurrentWindow(){
  return window.require('electron').remote.getCurrentWindow()
}



exports.onRendererWindow = (window) => {
  window.document.addEventListener('DOMContentLoaded', () => {

    window.document.querySelector("#hyper").addEventListener("dragover", (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  //
    window.document.querySelector("#hyper").addEventListener("drop", (e) => {
      // e.preventDefault()
      // e.stopPropagation()
      for (let file of e.dataTransfer.files) {
        const pathname = /\s/.test(file.path) ? '"' + file.path + '"' : file.path;
        sendSessionData(null, pathname)
        break
      }

      getCurrentWindow().focus()
    })
  })

}



exports.middleware = store => next => action => {
  if (!_store) {
    _store = store
  }
  next(action)
}
