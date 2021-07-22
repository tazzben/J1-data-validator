// Add dataset:

window.api.send("toMain", {action: "newDataset"});

// Delete Column:

window.api.send("toMain", {action: "deleteColumn", ID: 4});

//4 <- is ID of the column

// Delete Dataset:

window.api.send("toMain", {action: "deleteDataset", ID:1});

// Delete Rule:

window.api.send("toMain", {action: "deleteRule", ID:1});

// Get Datasets:

window.api.send("toMain", {action: "getDatasets"});

// Get Data From Column:

window.api.send("toMain", {action: "getDataFromColumn", payload:{column_id:5,limit:2}});

// Limit can be omitted and you will get all data in that column

// Get Transforms:

window.api.send("toMain", {action: "getTransforms"});

// Get Columns:

window.api.send("toMain", {action: "getColumns"});

// Get Rules:

window.api.send("toMain", {action: "getRules"});

// Get Exceptions:

window.api.send("toMain", {action: "getExceptions"});

// Get Ignores:

window.api.send("toMain", {action: "getIgnores"});

// Add Ignore:

window.api.send("toMain", {action: "addIgnore", payload:{rule_id:1, id_one:"joe",id_two:"joe"}});

// “joe” in the example is the value in the identifying column for that row.

// Clear Ignores:

window.api.send("toMain", {action: "clearIgnores"});

// Insert Rule:

window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one:1, dataSource_id_two: 1, columns_id_one: 2, columns_id_two: 3, sqlrule: "=", otherrule:""}});

// sqlrule can take the values ['=', '>', '<', '>=', '<=‘], otherrule can be ['case insensitive', 'exists’] or blank.

// Update Rule:

window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one:1, dataSource_id_two: 1, columns_id_one: 2, columns_id_two: 3, sqlrule: "=", otherrule:"", ID: 1}});

// Insert Transform:

window.api.send("toMain", {action: "insertTransform", payload: {dataSource_id: 1, column_id: 4, regular_rule: "d([\\d]+)", name:"new column" }});

// Load JSON:

window.api.send("toMain", {action: "loadJSON"});

// Save JSON:

window.api.send("toMain", {action: "saveJSON"});

// Save CSV:

window.api.send("toMain", {action: "saveCSV"});
  
// Update Key Column:

window.api.send("toMain", {action: "updateKeyColumn", payload:{dataSource_id:1, column_id: 1}});

// Notes:  (1) There is no delete transform because you implicitly delete the transform when you delete the created column. (2) Rules can be updated, but because transforms create an entire vector of data, they must be deleted and recreated.
