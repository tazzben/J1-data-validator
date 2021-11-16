let settings = require('electron-settings');
const path = require('path');
const readFiles = require('./readFiles.js');
const fs = require("fs");

/** 
 * Parses a JSON string or returns an empty object when it can't be parsed
 * @param {str} JSON string
 * @return {object} JSON str parsed to object
 */

const parseJSONSafely = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.err(e);
        return {};
    }
};

/**
 * Returns a file object based on a filepath
 * @param {string} filepath 
 * @returns {file} file object of passed filepath 
 */

const readFileSafe = (filepath) => {
    try {
        return fs.readFileSync(filepath);
    } catch (e) {
        console.err(e);
        return "";
    }
};

/**
 * Writes a file to given filepath
 * @param {string} filepath 
 * @param {string} data to write
 * @returns a file or false
 */

const writeFileSafe = (filepath, data) => {
    try {
        return fs.writeFileSync(filepath, data);
    } catch (e) {
        console.err(e);
        return false;
    }
};

/**
 * Adds an ignore 
 * @param {int} rule_id 
 * @param {string} id_one 
 * @param {string} id_two 
 * @returns 
 */

const addIgnore = async (rule_id, id_one, id_two) => {
    let ignores = await settings.get('ignores');
    let ignoreArray = (ignores) ? ignores : [];
    let obj = {
        rule: rule_id,
        id_one: id_one,
        id_two: id_two
    };
    ignoreArray.push(obj);
    const rval = await settings.set('ignores', ignoreArray);
    return rval;
};

/**
 * @returns array of ignores
 */

const getIgnores = async () => {
    let ignores = await settings.get('ignores');
    let ignoreArray = (ignores) ? ignores : [];
    return ignoreArray;
};

const clearIgnores = async () => {
    await settings.set('ignores', []);
};

/**
 * Updates dataset settings to match program state
 * @param {database} db 
 */

const updateDatasetSetting = async (db) => {
    let datasets = db.exportDataSets();
    let dsArray = (datasets) ? datasets : [];
    const rval = await settings.set('datasets', dsArray);
    return rval;
};

/**
 * Update rules settings to match program state
 * @param {database} db  
 */

const updateRulesSettings = async (db) => {
    let rules = db.exportRules();
    let rArray = [];
    for (let row of rules) {
        let obj = {
            ID: row.ID,
            dataSource_id_one: row.dataSource_id_one,
            dataSource_id_two: row.dataSource_id_two,
            sqlrule: row.sqlrule,
            otherrule: row.otherrule
        };
        let colOne = db.selectColumns(row.dataSource_id_one);
        let colTwo = db.selectColumns(row.dataSource_id_two);
        let colOneFind = colOne.find(item => item.ID === row.columns_id_one);
        if (colOneFind) {
            obj.column_one = colOneFind.name;
        }
        let colTwoFind = colTwo.find(item => item.ID === row.columns_id_two);
        if (colTwoFind) {
            obj.column_two = colTwoFind.name;
        }
        if (colOneFind && colTwoFind) {
            rArray.push(obj);
        }
    }
    const rval = await settings.set('rules', rArray);
    return rval;
};

/**
 * Update transform settings to match program state
 * @param {database} db 
 */

const updateTransformsSettings = async (db) => {
    let transforms = db.exportTransforms();
    let tArray = [];
    for (let row of transforms) {
        let obj = {
            dataSource_id: row.dataSource_id,
            regular_rule: row.regular_rule, 
            truefalse: row.truefalse
        };
        let cols = db.selectColumns(row.dataSource_id);
        let cName = cols.find(item => item.ID === row.columns_id);
        if (cName) {
            obj.column = cName.name;
        }
        let target = cols.find(item => item.ID === row.target_columns_id);
        if (target) {
            obj.target_column = target.name;
        }
        if (cName && target) {
            tArray.push(obj);
        }
    }
    const rval = await settings.set('transforms', tArray);
    return rval;
};

/**
 * Update all settings to match program state
 * @param {database} db 
 */

const updateSettings = async (db) => {
    await updateDatasetSetting(db);
    await updateTransformsSettings(db);
    await updateRulesSettings(db);
    return true;
};

/**
 * Read datasets from DB and set them in the settings
 * @param {database} db 
 * @param {array} ds: datasets  
 * @param {string} fpath: file path 
 * @returns 
 */

const readDatasetSettings = async (db, ds, fpath = "", splash = false) => {
    let datasets = db.exportDataSets();
    for (let row of datasets) {
        db.deleteDataSource(row.ID);
    }
    let newds = [];
    ds = (ds) ? ds : [];
    for (let row of ds) {
        let filepath = row.filepath;
        if (fpath.length > 0) {
            filepath = path.join(fpath, path.basename(filepath));
            row.filepath = filepath;
        }
        let column = row.column_name;
        if (fs.existsSync(filepath)) {
            if (splash && !splash.isDestroyed()) {
                splash.webContents.send("fromMain", "Loading " + path.basename(filepath));
            }
            const r = await readFiles.readExcelFile(db, filepath, column, row.ID);
            if (r) {
                newds.push(row);
            }
        }
    }
    const rval = await settings.set('datasets', newds);
    return rval;
};

/**
 * Read rules and save them to settings
 * @param {database} db 
 * @param {array} array of rules 
 */

const readRulesSettings = async (db, rules) => {
    let cleanRules = [];
    rules = (rules) ? rules : [];
    for (let row of rules) {
        let colOne = db.selectColumns(row.dataSource_id_one);
        let colTwo = db.selectColumns(row.dataSource_id_two);
        let colOneFind = colOne.find(item => item.name === row.column_one);
        let colTwoFind = colTwo.find(item => item.name === row.column_two);
        if (colOneFind && colTwoFind) {
            const r = db.insertRule(row.dataSource_id_one, row.dataSource_id_two, colOneFind.ID, colTwoFind.ID, row.sqlrule, row.otherrule, row.ID);
            if (r) {
                cleanRules.push(row);
            }
        }
    }
    const rval = await settings.set('rules', cleanRules);
    return rval;
};

/**
 * Read transforms save them to the settings
 * @param {database} db 
 * @param {array} transforms 
 */

const readTransformSettings = async (db, transforms) => {
    let cleanTransforms = [];
    transforms = (transforms) ? transforms : [];
    for (let row of transforms) {
        let cols = db.selectColumns(row.dataSource_id);
        let colID = cols.find(item => item.name === row.column);
        if (colID) {
            const truefalse = (row.truefalse) ? 1 : 0;
            const r = db.insertTransform(row.dataSource_id, colID.ID, row.regular_rule, row.target_column, truefalse);
            if (r) {
                cleanTransforms.push(row);
            }
        }
    }
    const rval = await settings.set('transforms', cleanTransforms);
    return rval;
};

/**
 * Find the id column and update the database
 * @param {database} db 
 * @param {array} dataset array 
 */

const repairColumnSettings = (db, ds) => {
    ds = (ds) ? ds : [];
    for (let row of ds) {
        let cols = db.selectColumns(row.ID);
        let fCol = cols.find(item => item.name === row.column_name);
        if (fCol) {
            db.updateIDColumn(row.ID, fCol.ID);
        }
    }
};

/**
 * Import settings and return all settings an object
 * @param {database} db 
 * @param {array} datasets 
 * @param {array} rules 
 * @param {array} transforms 
 * @param {string} fpath 
 * @returns object of arrays
 */

const importSettingsHelper = async (db, datasets, rules, transforms, fpath = "", splash = false) => {
    const rds = await readDatasetSettings(db, datasets, fpath, splash);
    if (splash && !splash.isDestroyed()) {
        splash.webContents.send("fromMain", "Building transforms");
    }
    const rts = await readTransformSettings(db, transforms);
    if (splash && !splash.isDestroyed()) {
        splash.webContents.send("fromMain", "Building rules");
    }
    const rrs = await readRulesSettings(db, rules);
    repairColumnSettings(db, datasets);
    return {
        dataset: rds,
        transforms: rts,
        rules: rrs
    };
};
/**
 * Startup import settings function
 * @param {database} db 
 * @returns object of arrays
 */

const importSettings = async (db, splash = false) => {
    const datasets = await settings.get('datasets');
    const transforms = await settings.get('transforms');
    const rules = await settings.get('rules');
    repairColumnSettings(db, datasets);
    return await importSettingsHelper(db, datasets, rules, transforms, "", splash);
};

/**
 * Import settings from JSON file
 * @param {database} db 
 * @param {string} filepath 
 */

const importFromFile = async (db, filepath, splash = false) => {
    if (fs.existsSync(filepath)) {
        let rawdata = readFileSafe(filepath);
        if (rawdata.length > 0) {
            let jsonObj = parseJSONSafely(rawdata);
            if (jsonObj['datasets'] && jsonObj['transforms'] && jsonObj['rules']) {
                await clearIgnores();
                let onlyPath = path.dirname(fs.realpathSync(filepath));
                return await importSettingsHelper(db, jsonObj['datasets'], jsonObj['rules'], jsonObj['transforms'], onlyPath, splash);
            }
        }
    }
    return false;
};

/**
 * Save settings to a file
 * @param {string} filepath 
 */

const exportToFile = async (filepath) => {
    let obj = {};
    let uncleandatasets = await settings.get('datasets');
    obj['datasets'] = cleanDataSets(uncleandatasets);
    obj['transforms'] = await settings.get('transforms');
    obj['rules'] = await settings.get('rules');
    let jsonString = JSON.stringify(obj, null, 2);
    return writeFileSafe(filepath, jsonString);
};

/**
 * Cleans the dataset object of full file paths
 * @param {array} ds 
 */

const cleanDataSets = (ds) => {
    let c = [];
    for (let row of ds){
        if(row.filepath){
            row.filepath = path.basename(row.filepath); 
        }
        c.push(row);
    }
    return c;
}; 

module.exports = {
    addIgnore: addIgnore,
    getIgnores: getIgnores,
    clearIgnores: clearIgnores,
    importSettings: importSettings,
    importFromFile: importFromFile,
    exportToFile: exportToFile,
    updateSettings: updateSettings
};