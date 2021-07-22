const xlsx = require('xlsx');

/**
 * Reads an Excel or text-based file and saves it into the database as a dataset
 * @param {database} db 
 * @param {string} filename to read 
 * @param {string} keyColumn: name of column to set as key/ID for dataset 
 * @param {int} ID: id of dataset unless allowing auto assignment (0) 
 * @param {int} range: start row, entire file by default  
 * @returns false or id of new datasource 
 */

const readExcelFile = async (db, filename, keyColumn, ID = 0, range = 0) => {
    const bookData = xlsx.readFile(filename);
    let columns = {};
    if (bookData.SheetNames.length > 0) {
        const sheetRaw = bookData.Sheets[bookData.SheetNames[0]];
        const excelJson = xlsx.utils.sheet_to_json(sheetRaw, {
            blankrows: false,
            range: range,
            defval: ""
        });
        let rowTest = excelJson.length > 0 ? Object.keys(excelJson[0]) : [];
        let rowTestEmptyCount = rowTest.filter(word => word.startsWith("__EMPTY"));
        if (rowTest.length / 2 < rowTestEmptyCount.length) {
            return await readExcelFile(db, filename, keyColumn, ID, range + 1);
        }
        let keyColumnSet = false;
        const dataSourceId = excelJson.length > 0 ? db.insertDataSource(filename, ID) : false;
        for (let i = 0; i < excelJson.length; i++) {
            let row = excelJson[i];
            if (Object.keys(row).length > 0) {
                let rowId = db.insertRow(dataSourceId);
                let keyList = Object.keys(row);
                for (let j = 0; j < keyList.length; j++) {
                    let columnKeys = Object.keys(columns);
                    if (!(columnKeys.includes(keyList[j]))) {
                        let isKey = (keyList[j] === keyColumn && keyColumn?.length > 0) ? 1 : 0;
                        keyColumnSet = (isKey === 1) ? true : keyColumnSet;
                        isKey = (keyColumnSet === false && (!keyColumn) && keyList[j].length > 0) ? 1 : 0;
                        keyColumnSet = (isKey === 1) ? true : keyColumnSet;
                        let columnID = db.insertColumn(dataSourceId, keyList[j], isKey);
                        columns[keyList[j]] = columnID;
                    }
                    let cID = columns[keyList[j]];
                    let cell = row[keyList[j]];
                    let cdata = typeof cell === 'number' ? cell : cell.toString().trim();
                    db.insertData(dataSourceId, cID, rowId, cdata);
                }
            }
        }
        return dataSourceId;
    }
    return false;
};

module.exports = {
    readExcelFile: readExcelFile
};
