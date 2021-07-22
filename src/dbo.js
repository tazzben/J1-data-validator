let dS = class dataStorage {
  constructor() {
    const Database = require('better-sqlite3');
    let db = new Database(':memory:');
//    let db = new Database('test.db');
    const creationList = ['create table if not exists dataSource (ID INTEGER PRIMARY KEY AUTOINCREMENT, filepath text);',
      'create table if not exists columns (ID INTEGER PRIMARY KEY AUTOINCREMENT, dataSource_id int, name text, id_field int);',
      'create table if not exists row (ID INTEGER PRIMARY KEY AUTOINCREMENT, dataSource_id int);',
      'create table if not exists data (ID INTEGER PRIMARY KEY AUTOINCREMENT, dataSource_id int, columns_id int, row_id int, data_num real, data_string text);',
      'create table if not exists rule (ID INTEGER PRIMARY KEY AUTOINCREMENT, dataSource_id_one int, columns_id_one int, dataSource_id_two int, columns_id_two int, sqlrule text, otherrule text);',
      'create table if not exists transforms (ID INTEGER PRIMARY KEY AUTOINCREMENT, dataSource_id int, columns_id int, regular_rule text, target_columns_id int);'
    ];
    for (let value of creationList) {
      db.prepare(value).run();
    }
    this.db = db;
  }

  /**
   * Add data source
   * @param {string} filepath 
   * @param {int} ID 
   * @returns ID of data source  
   */
  
  insertDataSource(filepath, ID = 0) {
    let result = ID == 0 ? this.db.prepare('INSERT INTO dataSource (filepath) VALUES(?)').run([filepath, ]) : this.db.prepare('INSERT INTO dataSource (filepath, ID) VALUES(?, ?)').run([filepath, ID]);
    return result.lastInsertRowid;
  }
  
  /**
   * Add column to data source 
   * @param {int} dataSource_id 
   * @param {string} name 
   * @param {int} id_field 
   * @returns int of new column
   */
  
  insertColumn(dataSource_id, name, id_field) {
    let result = this.db.prepare('INSERT INTO columns (dataSource_id, name, id_field) VALUES(?,?,?)').run([dataSource_id, name, id_field]);
    return result.lastInsertRowid;
  }
  
  /**
   * Add row to data source
   * @param {int} dataSource_id 
   * @returns int of new row
   */
  
  insertRow(dataSource_id) {
    let result = this.db.prepare('INSERT INTO row (dataSource_id) VALUES(?)').run([dataSource_id, ]);
    return result.lastInsertRowid;
  }
  
  /**
   * Add data to data source, column, row
   * @param {int} dataSource_id 
   * @param {int} columns_id 
   * @param {int} row_id 
   * @param {number or string} data 
   * @returns int of data
   */
  
  insertData(dataSource_id, columns_id, row_id, data) {
    if (typeof data === 'number') {
      let result = this.db.prepare('INSERT INTO data (dataSource_id, columns_id, row_id, data_num, data_string) VALUES(?,?,?,?,?)').run([dataSource_id, columns_id, row_id, data, data.toString()]);
      return result.lastInsertRowid;
    } else if (data.length > 0 && !isNaN(Number(data)) && isFinite(data)){
      let result = this.db.prepare('INSERT INTO data (dataSource_id, columns_id, row_id, data_num, data_string) VALUES(?,?,?,?,?)').run([dataSource_id, columns_id, row_id, Number(data), data]);
      return result.lastInsertRowid;
    } else {
      let result = this.db.prepare('INSERT INTO data (dataSource_id, columns_id, row_id, data_string) VALUES(?,?,?,?)').run([dataSource_id, columns_id, row_id, data]);
      return result.lastInsertRowid;
    }
  }
  
  /**
   * Insert rule 
   * @param {int} dataSource_id_one 
   * @param {int} dataSource_id_two 
   * @param {int} columns_id_one 
   * @param {int} columns_id_two 
   * @param {string} sqlrule: ['=', '>', '<', '>=', '<='] 
   * @param {string} otherrule: ['case insensitive', 'exists']
   * @param {int} ID of rule or auto assignment when zero 
   * @returns outcome of insert or false
   */
  
  insertRule(dataSource_id_one, dataSource_id_two, columns_id_one, columns_id_two, sqlrule, otherrule, ID = 0) {
    const sqlrules = ['=', '>', '<', '>=', '<='];
    const otherrules = ['case insensitive', 'exists'];
    const srule = sqlrules.includes(sqlrule) ? sqlrule : null;
    const orule = otherrules.includes(otherrule) ? otherrule : null;
    if (Number.isInteger(dataSource_id_one) && Number.isInteger(columns_id_one) && Number.isInteger(dataSource_id_two) && Number.isInteger(columns_id_two)) {
      return ID == 0 ? this.db.prepare('INSERT INTO rule (dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, sqlrule, otherrule) VALUES (?,?,?,?,?,?)').run([dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, srule, orule]) : this.db.prepare('INSERT INTO rule (dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, sqlrule, otherrule, ID) VALUES (?,?,?,?,?,?,?)').run([dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, srule, orule, ID]);
    }
    return false;
  }
  
  /**
   * Update rule
   * @param {int} dataSource_id_one 
   * @param {int} dataSource_id_two 
   * @param {int} columns_id_one 
   * @param {int} columns_id_two 
   * @param {string} sqlrule: ['=', '>', '<', '>=', '<='] 
   * @param {string} otherrule: ['case insensitive', 'exists']
   * @param {int} ID of rule 
   * @returns 
   */
  
  updateRule(dataSource_id_one, dataSource_id_two, columns_id_one, columns_id_two, sqlrule, otherrule, ID) {
    const sqlrules = ['=', '>', '<', '>=', '<='];
    const otherrules = ['case insensitive', 'exists'];
    const srule = sqlrules.includes(sqlrule) ? sqlrule : null;
    const orule = otherrules.includes(otherrule) ? otherrule : null;
    if (Number.isInteger(dataSource_id_one) && Number.isInteger(columns_id_one) && Number.isInteger(dataSource_id_two) && Number.isInteger(columns_id_two)) {
      return this.db.prepare('UPDATE rule SET dataSource_id_one=?, columns_id_one=?, dataSource_id_two=?, columns_id_two=?, sqlrule=?, otherrule=? WHERE ID=?').run([dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, srule, orule, ID]);
    }
    return false;
  }
  
  /**
   * Insert transform record 
   * @param {int} dataSource_id 
   * @param {int} column_id 
   * @param {string} regular_rule: regex string 
   * @param {int} target_columns_id: new column id 
   * @returns result of insert
   */
  
  insertTransformRecord(dataSource_id, column_id, regular_rule, target_columns_id) {
    return this.db.prepare('INSERT INTO transforms (dataSource_id, columns_id, regular_rule, target_columns_id) VALUES(?,?,?,?)').run([dataSource_id, column_id, regular_rule, target_columns_id]);
  }
  
  /**
   * Insert transform
   * @param {int} dataSource_id 
   * @param {int} column_id 
   * @param {string} regular_rule: regex string 
   * @param {string} name of new column
   * @returns true or false
   */
  
  insertTransform(dataSource_id, column_id, regular_rule, name) {
    let isValid = true;
    try {
      new RegExp(regular_rule, 'ig');
    } catch (e) {
      isValid = false;
    }
    if (isValid) {
      let target_columns_id = this.insertColumn(dataSource_id, name, 0);
      this.insertTransformRecord(dataSource_id, column_id, regular_rule, target_columns_id);
      let rows = this.selectDataFromColumn(column_id);
      for (let row of rows) {
        let regularExpressionSearch = new RegExp(regular_rule, 'ig');
        let matches = regularExpressionSearch.exec(row.data_string);
        let dataString = "";
        if (matches && typeof matches[1] === 'string') {
          dataString = matches[1].trim();
        }
        let row_id = row.row_id;
        this.insertData(dataSource_id, target_columns_id, row_id, dataString);
      }
      return true;
    }
    return false;
  }
  
  /**
   * Update the key column for a data source
   * @param {int} dataSource_id 
   * @param {int} column_id of new key
   * @returns result of insert
   */
  
  updateIDColumn(dataSource_id, column_id) {
    this.db.prepare('UPDATE columns SET id_field = 0 WHERE dataSource_id=?').run([dataSource_id, ]);
    return this.db.prepare('UPDATE columns SET id_field = 1 WHERE dataSource_id=? AND ID=?').run([dataSource_id, column_id]);
  }
  
  /**
   * Delete data
   * @param {int} data_id 
   * @returns result of deletion
   */
  
  deleteData(data_id) {
    return this.db.prepare('DELETE FROM data WHERE ID=?').run([data_id, ]);
  }
  
  /**
   * Delete row
   * @param {int} row_id 
   * @returns true
   */
  
  deleteRow(row_id) {
    let transaction = [
      'DELETE FROM data WHERE row_id=?',
      'DELETE FROM row WHERE ID=?'
    ];
    for (let value of transaction) {
      this.db.prepare(value).run([row_id, ]);
    }
    return true;
  }
  
  /**
   * Delete rule
   * @param {int} id of rule 
   */
  
  deleteRule(id) {
    this.db.prepare('DELETE FROM rule WHERE ID=?').run([id, ]);
  }
  
  /**
   * Delete column
   * @param {int} column_id 
   * @returns true
   */
  
  deleteColumn(column_id) {
    let transaction = [
      'DELETE FROM data WHERE columns_id=?',
      'DELETE FROM columns WHERE ID=?',
      'DELETE FROM rule WHERE columns_id_one=?',
      'DELETE FROM rule WHERE columns_id_two=?',
      'DELETE FROM transforms WHERE columns_id=?',
      'DELETE FROM transforms WHERE target_columns_id=?'
    ];
    for (let value of transaction) {
      this.db.prepare(value).run([column_id, ]);
    }
    return true;
  }
  
  /**
   * Delete data source
   * @param {int} dataSource_id 
   * @returns true
   */
  
  deleteDataSource(dataSource_id) {
    let transaction = [
      'DELETE FROM data WHERE dataSource_id=?',
      'DELETE FROM row WHERE dataSource_id=?',
      'DELETE FROM columns WHERE dataSource_id=?',
      'DELETE FROM dataSource WHERE ID=?',
      'DELETE FROM rule WHERE dataSource_id_one=?',
      'DELETE FROM rule WHERE dataSource_id_two=?',
      'DELETE FROM transforms WHERE dataSource_id=?'
    ];
    for (let value of transaction) {
      this.db.prepare(value).run([dataSource_id, ]);
    }
    return true;
  }
  
  /**
   * Exports rules to array
   * @returns array 
   */
  
  exportRules() {
    return this.db.prepare('SELECT ID, dataSource_id_one, columns_id_one, dataSource_id_two, columns_id_two, sqlrule, otherrule FROM rule ORDER BY ID ASC').all();
  }
  
  /**
   * Exports transforms to array
   * @returns array
   */
  
  exportTransforms() {
    return this.db.prepare('SELECT dataSource_id, columns_id, regular_rule, target_columns_id FROM transforms ORDER BY ID ASC').all();
  }
  
  /**
   * Exports data sets to array
   * @returns array
   */
  
  exportDataSets() {
    return this.db.prepare('SELECT dataSource.ID AS ID, dataSource.filepath AS filepath, columns.name AS column_name, columns.ID AS column_id FROM dataSource LEFT JOIN columns ON dataSource.ID = columns.dataSource_id AND columns.id_field = 1 ORDER BY dataSource.ID ASC').all();
  }
  
  /**
   * Returns number of records in a data set
   * @param {int} datasetId 
   * @returns int
   */
  
  countRecords(datasetId) {
    const r = this.db.prepare('SELECT COUNT(*) AS totalrows FROM row WHERE dataSource_id=?').get([datasetId, ]);
    if (r.totalrows) {
      return r.totalrows;
    }
    return 0;
  }
  
  /**
   * Lists all columns
   * @returns array
   */
  
  allColumns() {
    return this.db.prepare('SELECT ID, name, id_field, dataSource_id FROM columns ORDER BY ID ASC').all();
  }
  
  /**
   * List all columns for a data set
   * @param {int} datasetId 
   * @returns array
   */
  
  selectColumns(datasetId) {
    return this.db.prepare('SELECT ID, name, id_field, dataSource_id FROM columns WHERE dataSource_id=? ORDER BY ID ASC').all([datasetId, ]);
  }
  
  /**
   * Lists column info
   * @param {id} ID of column
   * @returns array
   */
  
  selectColumnsByID(ID) {
    return this.db.prepare('SELECT ID, name, id_field, dataSource_id FROM columns WHERE ID=? ORDER BY ID ASC').all([ID, ]);
  }
  
  /**
   * List data in column
   * @param {int} column_id 
   * @param {int} limit: number of rows to return 
   * @returns array
   */
  
  selectDataFromColumn(column_id, limit = 0, filter = false) {
    let filterq = (filter) ? ` AND LENGTH(data_string) > 0 ` : "";
    let limitq = (limit > 0) ? ` LIMIT ${limit}` : " ";
    return this.db.prepare(`SELECT row_id, data_num, data_string FROM data WHERE columns_id=? ${filterq} ORDER BY ID ASC ${limitq}`).all([column_id, ]);
  }
  
  /**
   * Apply a rule to the dataset
   * @param {int} rule_id 
   * @returns array
   */
  
  applyRule(rule_id) {
    const r = this.db.prepare('SELECT data.data_string AS dstring, data.data_num AS dnum, rule.sqlrule AS matchrule, rule.otherrule AS orule FROM data JOIN rule WHERE (data.columns_id=rule.columns_id_one OR data.columns_id=rule.columns_id_two) AND rule.ID=? LIMIT 1').get(rule_id);
    if (r.matchrule && r.orule !== 'exists') {
      const stringM = r.orule === 'case insensitive' ? `(LOWER(one_string) ${r.matchrule} LOWER(two_string))` : `(one_string ${r.matchrule} two_string)`;
      const numericM = `(one_num ${r.matchrule} two_num AND one_num IS NOT NULL AND two_num IS NOT NULL)`;
      const query = "(" + stringM + " OR " + numericM + ")";
      return this.db.prepare(`
            SELECT 
              one_string,
              one_num,
              two_string,
              two_num,
              row_id,
              key_string,
              columnOneName,
              columnTwoName,
              filepathOne,
              filepathTwo,
              sqlrule,
              otherrule
            FROM (
              SELECT 
                dataOne.data_string AS one_string, 
                dataOne.data_num AS one_num,
                dataTwo.data_string AS two_string,
                dataTwo.data_num AS two_num,
                dataOne.row_id AS row_id,
                dataOneKey.data_string AS key_string,
                columnsNameOne.name AS columnOneName,
                columnsNameTwo.name AS columnTwoName,
                dataSourceOne.filepath AS filepathOne,
                dataSourceTwo.filepath AS filepathTwo,
                rule.sqlrule AS sqlrule,
                rule.otherrule AS otherrule
              FROM rule 
              JOIN data AS dataOne ON rule.columns_id_one = dataOne.columns_id
              JOIN columns AS columnsNameOne ON dataOne.columns_id = columnsNameOne.ID
              JOIN columns AS columnsOne ON dataOne.dataSource_id = columnsOne.dataSource_id AND columnsOne.id_field = 1
              JOIN dataSource AS dataSourceOne ON dataOne.dataSource_id = dataSourceOne.ID
              JOIN data AS dataOneKey ON dataOne.row_id = dataOneKey.row_id AND dataOneKey.columns_id = columnsOne.ID AND LENGTH(dataOneKey.data_string) > 0
              JOIN data AS dataTwo ON rule.columns_id_two = dataTwo.columns_id 
              JOIN columns AS columnsNameTwo ON dataTwo.columns_id = columnsNameTwo.ID
              JOIN columns AS columnsTwo ON dataTwo.dataSource_id = columnsTwo.dataSource_id AND columnsTwo.id_field = 1
              JOIN dataSource AS dataSourceTwo ON dataTwo.dataSource_id = dataSourceTwo.ID
              JOIN data AS dataTwoKey ON dataTwo.row_id = dataTwoKey.row_id AND dataTwoKey.columns_id = columnsTwo.ID AND dataTwoKey.data_string = dataOneKey.data_string
              WHERE rule.ID=?
            ) AS dataMatches
            WHERE NOT ${query}
            `).all([rule_id, ]);
    } else if (r.matchrule) {
      return this.db.prepare(`
          SELECT 
            dataOne.data_string AS key_string,
            dataOne.row_id AS row_id,
            dataSourceOne.filepath AS filepathOne,
            dataSourceTwo.filepath AS filepathTwo,
            ruleone.sqlrule AS sqlrule,
            ruleone.otherrule AS otherrule
          FROM rule AS ruleone
          JOIN data AS dataOne ON dataOne.dataSource_id = ruleone.dataSource_id_one AND LENGTH(dataOne.data_string) > 0
          JOIN columns AS columnsOne ON dataOne.columns_id = columnsOne.ID AND columnsOne.id_field = 1
          JOIN dataSource AS dataSourceOne ON ruleone.dataSource_id_one = dataSourceOne.ID
          JOIN dataSource AS dataSourceTwo ON ruleone.dataSource_id_two = dataSourceTwo.ID
          JOIN columns AS columnsTwo ON columnsTwo.id_field = 1 AND columnsTwo.dataSource_id = dataSourceTwo.ID
          LEFT JOIN data AS dataTwo ON dataTwo.columns_id = columnsTwo.ID AND dataTwo.dataSource_id = dataSourceTwo.ID AND dataOne.data_string = dataTwo.data_string
          WHERE 
          dataTwo.ID IS NULL
          AND ruleone.ID=?
          `).all([rule_id, ]);
    }
    return undefined;
  }
}
module.exports = dS;