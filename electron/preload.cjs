const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lanternmere', {
  platform: 'desktop',
  storage: {
    getItem(key) {
      const reply = ipcRenderer.sendSync('storage:get', key);
      if (!reply.ok) throw new Error(reply.error);
      return reply.value;
    },
    setItem(key, value) {
      const reply = ipcRenderer.sendSync('storage:set', key, value);
      if (!reply.ok) throw new Error(reply.error);
    },
  },
});
