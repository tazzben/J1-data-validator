const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const settings = require('./settings.js');
const path = require('path');

/**
 * Writes all exceptions to a CSV file 
 * @param {database} db 
 * @param {string} filename 
 */

const writeExceptions = async (db, filename) => {
    let rules = db.exportRules();
    let exportArray = [];
    let ignores = await settings.getIgnores();
    for (let i = 0; i < rules.length; i++) {
        let rows = db.applyRule(rules[i].ID) ?? [];
        for (let row of rows) {
            let isIgnored = ignores.find(item => (item.rule === rules[i].ID && row.key_string == item.id_one));
            let ignore = (isIgnored) ? 1 : 0;
            let obj = {
                key_string: row.key_string,
                one_string: row.one_string,
                two_string: row.two_string,
                columnOneName: row.columnOneName,
                columnTwoName: row.columnTwoName,
                filepathOne: path.basename(row.filepathOne),
                filepathTwo: path.basename(row.filepathTwo),
                sqlrule: row.sqlrule,
                otherrule: row.otherrule,
                ignored: ignore
            };
            exportArray.push(obj);
        }
    }
    const csvWriter = createCsvWriter({
        path: filename,
        header: [{
                id: 'key_string',
                title: 'Key'
            },
            {
                id: 'one_string',
                title: 'Field One Data'
            },
            {
                id: 'two_string',
                title: 'Field Two Data'
            },
            {
                id: 'columnOneName',
                title: 'Name of Field One'
            },
            {
                id: 'columnTwoName',
                title: 'Name of Field Two'
            },
            {
                id: 'filepathOne',
                title: 'Data Source One'
            },
            {
                id: 'filepathTwo',
                title: 'Data Source Two'
            },
            {
                id: 'sqlrule',
                title: 'Matching Condition'
            },
            {
                id: 'otherrule',
                title: 'Other Condition'
            },
            {
                id: 'ignored',
                title: 'Marked as Fixed/Ignore'
            }
        ]
    });
    csvWriter.writeRecords(exportArray).then(() => {
        console.log('...Done');
    });
};

module.exports = {
    writeExceptions: writeExceptions
};