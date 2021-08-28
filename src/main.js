const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell
} = require('electron');
//app.disableHardwareAcceleration();
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
const database = require('./dbo.js');
let data = new database();
const readFiles = require('./readFiles.js');
const settings = require('./settings.js');
const exportToFile = require('./export.js');
let mainWindow;

/**
 * Create main window 
 */

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 750,
    minWidth: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });
  
  if (!app.isPackaged) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
};

let splashScreen;

/**
 * Create splash window
 */

const createSplash = (firstRun = true) => {
  if (!splashScreen || splashScreen.isDestroyed() || firstRun === false) {
    splashScreen = new BrowserWindow({
      show: false,
      width: 342,
      height: 170,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        worldSafeExecuteJavaScript: true,        
      }
    });
    splashScreen.loadFile(path.join(__dirname, 'splash.html'), {
      query: {
        "firstRun": (firstRun ? 'true' : 'false')
      }
    });
    splashScreen.on('ready-to-show', () => {
      splashScreen.show();
    });
  }
};

/**
 * Send object interface
 * @param {object} messageObj 
 */

const sendMessage = (messageObj) => {
  if (!mainWindow.isDestroyed()) {
    mainWindow.webContents.send("fromMain", messageObj);
  }
};

/**
 * Get data sets from database 
 * @param {database} data 
 * @returns array
 */

const getDatasets = (data) => {
  let datasets = data.exportDataSets();
  for (let i = 0; i < datasets.length; i++) {
    let dataset_id = datasets[i].ID;
    datasets[i].columns = data.selectColumns(dataset_id);
    datasets[i].records = data.countRecords(dataset_id);
    datasets[i].name = path.basename(datasets[i].filepath, path.extname(datasets[i].filepath));
  }
  return datasets;
};

/**
 * Load dataset async call
 * @param {database} data 
 * @parm {args} arguments from interface
 * @returns promise
 */

const loadDatasetHelper = async (data, args = {}) => {
  sendMessage({
    action: 'newDataset',
    payload: await loadDataset(data),
    args: args
  });
  updateSettings(data, args);
};

/**
 * Load dataset from file
 * @param {database} data 
 * @returns false or outcome of load
 */

const loadDataset = async (data) => {
  const datasetFile = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{
        name: 'All Supported Formats',
        extensions: ['XLSX', 'XLS', 'XLSM', 'XLSB', 'CSV', 'TXT', 'ODS', 'FODS']
      },
      {
        name: 'Excel',
        extensions: ['XLSX', 'XLS', 'XLSM', 'XLSB']
      },
      {
        name: 'Delimiter-Separated Values',
        extensions: ['CSV', 'TXT']
      },
      {
        name: 'OpenDocument Spreadsheet',
        extensions: ['ODS', 'FODS']
      }
    ]
  });
  if (datasetFile && datasetFile.toString().length > 0) {
    return await readFiles.readExcelFile(data, datasetFile.toString());
  }
  return false;
};

/**
 * Load settings from JSON file
 * @param {database} data 
 */

const loadJSON = async (data, args = {}) => {
  const jsonFile = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{
      name: 'JSON',
      extensions: ['JSON']
    }]
  });
  if (jsonFile && jsonFile.toString().length > 0) {
    createSplash(false);
    splashScreen.webContents.once('dom-ready', async () => {
      await settings.importFromFile(data, jsonFile.toString(), splashScreen);
      sendMessage({
        action: 'getDatasets',
        payload: getDatasets(data),
        args: args
      });
      sendMessage({
        action: 'getTransforms',
        payload: data.exportTransforms(),
        args: args
      });
      sendMessage({
        action: 'getRules',
        payload: data.exportRules(),
        args: args
      });
      sendMessage({
        action: 'jsonLoaded',
        args: args
      });
      getIgnores(args);
      if (splashScreen && !splashScreen.isDestroyed()) {
        splashScreen.destroy();
      }
    });
  }
};
/**
 * Save settings to file
 */

const saveJSON = async () => {
  const settingsFile = dialog.showSaveDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{
      name: 'JSON',
      extensions: ['JSON']
    }]
  });
  if (settingsFile && settingsFile.toString().length > 0) {
    await settings.exportToFile(settingsFile);
  }
};

/**
 * Save exceptions to CSV
 * @param {database} data 
 */

const writeCSV = async (data) => {
  const exportFile = dialog.showSaveDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [{
      name: 'CSV',
      extensions: ['CSV']
    }]
  });
  if (exportFile && exportFile.toString().length > 0) {
    await exportToFile.writeExceptions(data, exportFile);
  }
};

/**
 * Get exceptions async
 * @param {database} database reference 
 * @param {object} args sent from UI 
 */

const getExceptionsHelper = async (data, args = {}) => {
  sendMessage({
    action: 'getExceptions',
    payload: getExceptions(data),
    args: args
  });
  getIgnores(args);
};


/**
 * Get exceptions from database
 * @param {database} data 
 * @returns array
 */
const getExceptions = (data) => {
  let newRules = [];
  let rules = data.exportRules();
  for (let rule of rules) {
    let exceptions = data.applyRule(rule.ID);
    if (exceptions?.length > 0) {
      rule.exceptions = exceptions;
      newRules.push(rule);
    }
  }
  return newRules;
};

/**
 * Add ignore and send ignores to interface
 * @param {int} rule_id 
 * @param {string} id_one 
 * @param {string} id_two 
 */

const addIgnore = async (rule_id, id_one, id_two, args = {}) => {
  await settings.addIgnore(rule_id, id_one, id_two);
  await getIgnores(args);
};

/**
 * Delete all ignores
 */

const clearIgnores = async (args = {}) => {
  await settings.clearIgnores();
  await getIgnores(args);
  sendMessage({
    action: 'ignoresCleared',
    args: args
  });
};

/**
 * Send ignores to interface
 */

const getIgnores = async (args = {}) => {
  let ignores = await settings.getIgnores();
  sendMessage({
    action: 'getIgnores',
    payload: ignores,
    args: args
  });
};

/**
 * Get data from column and send it to the interface
 * @param {database} data 
 * @param {int} columnId 
 * @param {int} limit 
 */

const getDataFromColumn = (data, columnId, limit = 0, args = {}) => {
  let rows = data.selectDataFromColumn(columnId, limit, true);
  let obj = {
    rows: rows,
    column_id: columnId
  };
  sendMessage({
    action: 'getDataFromColumn',
    payload: obj,
    args: args
  });
};

/**
 * Update settings to application state and send data sets to interface
 * @param {database} data 
 */

const updateSettings = async (data, args = {}) => {
  await settings.updateSettings(data);
  sendMessage({
    action: 'getDatasets',
    payload: getDatasets(data),
    args: args
  });
};


const transformHelper = async (data, args = {}) => {
  await updateSettings(data, args);
  sendMessage({
    action: 'getTransforms',
    payload: data.exportTransforms(),
    args: args
  });
};

/**
 * Repair id column for data set
 * @param {database} data 
 * @param {int} dsid: dataset id 
 */

const repairColumn = (data, dsid) => {
  let columns = data.selectColumns(dsid);
  let columnID = 0;
  for (let row of columns) {
    if (row.id_field == 1) return;
    if (columnID == 0) columnID = row.ID;
  }
  if (columnID > 0) data.updateIDColumn(dsid, columnID);
};

ipcMain.on("toMain", (event, args) => {
  if (!app.isPackaged) {
    console.log(args);
  }
  if (args.action == 'loadJSON') {
    loadJSON(data, args);
  }
  if (args.action == 'saveJSON') {
    saveJSON();
  }
  if (args.action == 'saveCSV') {
    writeCSV(data);
  }
  if (args.action == 'newDataset') {
    loadDatasetHelper(data, args);
  }
  if (args.action == 'getDatasets') {
    sendMessage({
      action: 'getDatasets',
      payload: getDatasets(data),
      args: args
    });
    sendMessage({
      action: 'getTransforms',
      payload: data.exportTransforms(),
      args: args
    });
  }
  if (args.action == 'getExceptions') {
    getExceptionsHelper(data, args);
  }
  if (args.action == 'deleteRule') {
    sendMessage({
      action: 'deleteRule',
      payload: data.deleteRule(args.ID),
      args: args
    });
    updateSettings(data, args);
  }
  if (args.action == 'deleteDataset') {
    sendMessage({
      action: 'deleteDataset',
      payload: data.deleteDataSource(args.ID),
      args: args
    });
    updateSettings(data, args);
  }
  if (args.action == 'deleteColumn') {
    let cols = data.selectColumnsByID(args.ID);
    sendMessage({
      action: 'deleteColumn',
      payload: data.deleteColumn(args.ID),
      args: args
    });
    for (let row of cols) {
      repairColumn(data, row.dataSource_id);
    }
    updateSettings(data, args);
  }
  if (args.action == 'getRules') {
    sendMessage({
      action: 'getRules',
      payload: data.exportRules(),
      args: args
    });
  }
  if (args.action == 'getTransforms') {
    sendMessage({
      action: 'getTransforms',
      payload: data.exportTransforms(),
      args: args
    });
  }
  if (args.action == 'getColumns') {
    sendMessage({
      action: 'getColumns',
      payload: data.allColumns(),
      args: args
    });
  }
  if (args.action == 'getDataFromColumn') {
    let pl = args.payload;
    getDataFromColumn(data, pl.column_id, pl.limit, args);
  }
  if (args.action == 'insertRule') {
    let pl = args.payload;
    sendMessage({
      action: 'insertRule',
      payload: data.insertRule(pl.dataSource_id_one, pl.dataSource_id_two, pl.columns_id_one, pl.columns_id_two, pl.sqlrule, pl.otherrule),
      args: args
    });
    updateSettings(data, args);
    sendMessage({
      action: 'getRules',
      payload: data.exportRules(),
      args: args
    });
  }
  if (args.action == 'updateRule') {
    let pl = args.payload;
    sendMessage({
      action: 'updateRule',
      payload: data.updateRule(pl.dataSource_id_one, pl.dataSource_id_two, pl.columns_id_one, pl.columns_id_two, pl.sqlrule, pl.otherrule, pl.ID),
      args: args
    });
    updateSettings(data, args);
    sendMessage({
      action: 'getRules',
      payload: data.exportRules(),
      args: args
    });
  }
  if (args.action == 'insertTransform') {
    let pl = args.payload;
    sendMessage({
      action: 'insertTransform',
      payload: data.insertTransform(pl.dataSource_id, pl.column_id, pl.regular_rule, pl.name),
      args: args
    });
    transformHelper(data, args);
  }
  if (args.action == 'updateKeyColumn') {
    let pl = args.payload;
    sendMessage({
      action: 'updateKeyColumn',
      payload: data.updateIDColumn(pl.dataSource_id, pl.column_id),
      args: args
    });
    updateSettings(data, args);
  }
  if (args.action == 'addIgnore') {
    let pl = args.payload;
    addIgnore(pl.rule_id, pl.id_one, pl.id_two, args);
  }
  if (args.action == 'getIgnores') {
    getIgnores(args);
  }
  if (args.action == 'clearIgnores') {
    clearIgnores(args);
  }
  if (args.action == "loadStartupSettings") {
    startUpSettings(data, args);
  }
});
/**
 * Creates menu structure on main window
 */
const createMenu = () => {
  const isMac = process.platform === 'darwin';
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [{
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: '&File',
      submenu: [{
          label: 'Save Exceptions',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            writeCSV(data);
          }
        },
        {
          label: 'Add Data Source',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            loadDatasetHelper(data);
          }
        },
        isMac ? {
          role: 'close'
        } : {
          role: 'quit'
        }
      ]
    },
    {
      label: '&Edit',
      submenu: [{
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        }
      ]
    },
    {
      label: '&Settings',
      submenu: [{
          label: 'Load JSON',
          accelerator: 'CmdOrCtrl+J',
          click: () => {
            loadJSON(data);
          }
        },
        {
          label: 'Save JSON',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            saveJSON();
          }
        },
        {
          label: 'Clear Ignores',
          click: () => {
            clearIgnores();
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [{
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://forms.gle/sHuCSpDh39gShYH97');
          }
        },
        {
          label: 'Online Docs',
          click: async () => {
            await shell.openExternal('https://j1-data-validator.gitbook.io/');
          }
        },
        {
          label: 'Version',
          click: async () => {
            await dialog.showMessageBox(null, {
              message: 'Version Number',
              detail: 'Version: ' + app.getVersion()
            });
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const startUpSettings = async (data, args = {}) => {
  await settings.importSettings(data, splashScreen);
  sendMessage({
    action: 'getDatasets',
    payload: getDatasets(data),
    args: args
  });
  sendMessage({
    action: 'getTransforms',
    payload: data.exportTransforms(),
    args: args
  });
  sendMessage({
    action: 'getRules',
    payload: data.exportRules(),
    args: args
  });
  if (splashScreen && !splashScreen.isDestroyed()) {
    splashScreen.destroy();
  }
};

const startUp = () => {
  createWindow();
  createMenu();
  mainWindow.webContents.once('dom-ready', () => {
    createSplash();
  });
};

app.whenReady().then(() => {
  startUp();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      mainWindow.webContents.once('dom-ready', () => {
        sendMessage({
          action: 'getDatasets',
          payload: getDatasets(data)
        });
        sendMessage({
          action: 'getTransforms',
          payload: data.exportTransforms()
        });
        sendMessage({
          action: 'getRules',
          payload: data.exportRules()
        });
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});