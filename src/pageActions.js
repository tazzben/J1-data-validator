// Function to create the data source cards for front page UI
// Activates via render.js, when receiving the 'getDatasets' message

function createCard(id){
  // let name = testJSON.find(element => element.ID == id)['name'];
  let data = testJSON.find(element => element.ID == id);
  let card = document.createElement('div');
  card.className = `card`;
  card.setAttribute('id', `data-${id}`);
  card.setAttribute("style","width: 18rem;");
  let card_b = document.createElement('div');
  card_b.className = "card-body";
  let card_title = document.createElement('h5');
  card_title.className = "card-title";
  card_title.innerText = `Source ID ${data['ID']} - ${data['name']}`;
  let p1 = document.createElement('p');
  p1.className = "card-text";
  let p2 = document.createElement('p');
  p2.className = "card-text";
  p1.innerText = `Number of records: ${data['records']}`;
  p2.innerText = `Identifying Variable`;
  let drop = document.createElement('div');
  drop.className = "dropdown";
  let button = document.createElement('button');
  button.className = "btn btn-secondary dropdown-toggle";
  button.setAttribute("type","button");
  button.setAttribute("id", `columns-${id}`);
  button.setAttribute("data-toggle", "dropdown");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-expanded", "false");
  if (data['column_name']) {
    button.innerText = data['column_name'];
  } else {
    button.innerText = "Select ID Variable";
  }
  let items = list_columns(id);
  let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-danger";
  btn_r.onclick = function() {remove(id)};
  btn_r.innerText = "Remove";

  drop.appendChild(button);
  drop.appendChild(items);
  card_b.appendChild(card_title);
  card_b.appendChild(p1);
  card_b.appendChild(p2);
  card_b.appendChild(drop);
  card_b.appendChild(btn_r);
  card.appendChild(card_b);
  return card;
}

// Function to remove a data source via the remove button on screen,
//   also removes the associated card in the UI
function remove(id) {
  if (confirm(`Do you really want to remove the Source ID ${id} data source?`)) {
    $(`#data-${id}`).remove();
    window.api.send('toMain', {'action':'deleteDataset', 'ID':id});
}}

// Function to remove a data link between two sources via the remove button on screen,
//   also removes the associated card in the pop-up UI card for links
function remove_link(card) {
  if (confirm(`Do you really want to remove the ${card} data link?\nThis cannot be undone.`)) {
    $( `#${card}`).remove();
    let link = card.split("-")[1];
    // Delete Rule:
    window.api.send("toMain", {action: "deleteRule", ID:link});
    window.api.send("toMain", {action: "getRules"});
    link_count-=1;
}}

// Function to remove a custom column via the remove button on screen,
//   also removes the associated card in the pop-up UI card for custom columns
function remove_column(card) {
  // COME BACK AND ADD CODE TO REMOVE LINK RULE FROM RULE SET
  if (confirm(`Do you really want to remove the ${card} data link?\nThis cannot be undone.`)) {
    $( `#${card}`).remove();
    // let link = card.split("-")[1];
    // Delete Custom Column Rule:
}}

// Function to create a new linking card, which will contain the functionality
//   to pass that rule to the backend
function add_link(ruleNo) {
  let link_name;
  if (ruleNo) {
    link_name = ruleNo;
  // eslint-disable-next-line no-empty
  } else {
    link_name = link_count+1;
  }
  let card = document.createElement('div');
  card.className = `card`;
  card.setAttribute("style","width: 18*3rem;");
  card.setAttribute("id",`link-${link_name}`);
  let card_b = document.createElement('div');
  card_b.className = "card-body";
  let card_title = document.createElement('h5');
  card_title.className = "card-title";
  card_title.innerText = `Link Rule ${link_name}`;
  let row = document.createElement('div');
  row.className = "row";
  let row2 = document.createElement('div');
  row2.className = "row";
  //Left Column
  let col1 = document.createElement('div');
  col1.className = "col-md-6";
  col1.setAttribute('id','column1');
  let center1 = document.createElement('center');
  let drop1 = document.createElement('div');
  drop1.className = "dropdown";
  let button1 = document.createElement('button');
  button1.className = "btn btn-secondary dropdown-toggle";
  button1.setAttribute('type', 'button');
  button1.setAttribute('id', `variable${link_name}-left`);
  button1.setAttribute('data-toggle', 'dropdown');
  button1.setAttribute('aria-haspopup', 'true');
  button1.setAttribute('aria-expanded', 'false');
  button1.innerText = "Select First Variable";

  
  // Add to list_data_sources function
  // let items1 = document.createElement('div');
  // items1.className = "dropdown-menu";
  // items1.setAttribute('aria-labelledby','dropdownMenuButton');

  // Middle Column
  let col2 = document.createElement('div');
  col2.className = 'col-md-2';
  // let center2 = document.createElement('center');
  let fig = document.createElement('img');
  fig.setAttribute('src','icons/double_arrows.png');
  fig.setAttribute('height','50px');
  fig.setAttribute('style','opacity:45%');


  //Right Column
  let col3 = document.createElement('div');
  col3.className = "col-md-6";
  col3.setAttribute('id','column2');
  let center3 = document.createElement('center');
  let drop3 = document.createElement('div');
  drop3.className = "dropdown";
  let button3 = document.createElement('button');
  button3.className = "btn btn-secondary dropdown-toggle";
  button3.setAttribute('type', 'button');
  button3.setAttribute('id', `variable${link_name}-right`);
  button3.setAttribute('data-toggle', 'dropdown');
  button3.setAttribute('aria-haspopup', 'true');
  button3.setAttribute('aria-expanded', 'false');
  button3.innerText = "Select Second Variable";

  // Checkboxes
  let col12 = document.createElement('div');
  col12.className = "col-md-6";
  let checkbox = document.createElement('div');
  checkbox.className = "form-check";
  let checkin = document.createElement('input');
  checkin.className = "form-check-input";
  checkin.setAttribute('id', `noCase-${link_name}`);
  checkin.setAttribute('type', 'checkbox');
  let check_l = document.createElement('label');
  check_l.className = "form-check-label";
  check_l.setAttribute('for', `noCase-${link_name}`);
  check_l.innerText = "Not Case Sensistive";

  let checkbox2 = document.createElement('div');
  checkbox2.className = "form-check";
  let checkin2 = document.createElement('input');
  checkin2.className = "form-check-input";
  checkin2.setAttribute('id', `nullRule-${link_name}`);
  checkin2.setAttribute('type', 'checkbox');
  let check_l2 = document.createElement('label');
  check_l2.className = "form-check-label";
  check_l2.setAttribute('for', `nullRule-${link_name}`);
  check_l2.innerText = "Null Value Check";


  checkbox.appendChild(checkin);
  checkbox.appendChild(check_l);

  checkbox2.appendChild(checkin2);
  checkbox2.appendChild(check_l2);

  let col22 = document.createElement('div');
  col22.className = "col-md-6";
  let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-danger";
  btn_r.onclick = function() {remove_link(`link-${link_name}`)};
  btn_r.innerText = "Remove Link";

  // Build out the card
  drop1.appendChild(button1);
  drop1.appendChild(list_data_sources(1, link_name));
  center1.appendChild(drop1);
  col1.appendChild(center1);
  // center2.appendChild(fig);
  // col2.appendChild(center2);
  drop3.appendChild(button3);
  drop3.appendChild(list_data_sources(2, link_name));
  center3.appendChild(drop3);
  col3.appendChild(center3);
  row.appendChild(col1);
  // row.appendChild(col2);
  row.appendChild(col3);
  card_b.appendChild(card_title);
  card_b.appendChild(row);
  col12.appendChild(btn_r);
  col22.appendChild(checkbox);
  col22.appendChild(checkbox2);
  row2.appendChild(col12);
  row2.appendChild(col22);
  card_b.appendChild(row2);
  card.appendChild(card_b);
  if (link_name>link_count) {
    link_count++;
  }
  return card;
}


// Function to create the custom column card, which also contains some functionality
//   to preview the contents of the custom column based on the regex provided by the user
function add_custom_column() {
  let col_name = cols_count+1;
  let card = document.createElement('div');
  card.className = `card`;
  card.setAttribute("style","width: 18*3rem;");
  card.setAttribute("id",`column-${col_name}-card`);
  card.onfocus = function () {create_preview(col_name)};
  let card_b = document.createElement('div');
  card_b.className = "card-body";
  let card_title = document.createElement('h5');
  card_title.className = "card-title";
  card_title.innerText = `Custom Column ${col_name}`;
  card_title.setAttribute("contenteditable", "true");
  card_title.onkeyup = function () {
    let columnFilter = testJSON.filter(ds => ds.columns?.filter(col => col?.name == card_title.innerText).length > 0);
    if( !(columnFilter?.length > 0) ) {
      document.getElementById('saveColumns').removeAttribute('disabled');
    } else {
      document.getElementById('saveColumns').setAttribute('disabled', 'true');
    }
  };
  // let glyph = document.createElement('img');
  // glyph.setAttribute('src', 'icons/pencil.svg');
  // glyph.setAttribute('width','16');
  // glyph.onclick = function() {
  //   card_title.setAttribute("contenteditable", "true");
  //   // card_title.
  // };
  let row = document.createElement('div');
  row.className = "row";
  //Left Column
  let col1 = document.createElement('div');
  col1.className = "col-md-6";
  col1.setAttribute('id','column1');
  let center1 = document.createElement('center');
  let drop1 = document.createElement('div');
  drop1.className = "dropdown";
  let button1 = document.createElement('button');
  button1.className = "btn btn-secondary dropdown-toggle";
  button1.setAttribute('type', 'button');
  button1.setAttribute('id', `column-${col_name}`);
  button1.setAttribute('data-toggle', 'dropdown');
  button1.setAttribute('aria-haspopup', 'true');
  button1.setAttribute('aria-expanded', 'false');
  button1.setAttribute('style', 'margin-top:7px');
  button1.onclick = function(){
    fetch_preview(col_name);
    try {
    create_preview(col_name);
  } catch {
    preview_error(col_name);
  }};
  button1.innerText = "Select Source Column";

  // Right Column
  let col2 = document.createElement('div');
  col2.className = "col-md-6";
  col2.setAttribute('id','column2');
  let label = document.createElement('label');
  label.setAttribute("for", `rule-${col_name}`);
  let text_in = document.createElement('input');
  text_in.className = "form-control";
  text_in.setAttribute("type","text");
  text_in.setAttribute('id', `rule-${col_name}`);
  text_in.setAttribute('placeholder', 'Enter regex rule for new column');
  text_in.onkeyup = function(){
    try {
      create_preview(col_name);
    } catch {
      preview_error(col_name);
    }
    };

  //Button row

  let row2 = document.createElement('div');
  row2.className = "row";
  //Left Column
  let col12 = document.createElement('div');
  col12.className = "col-md-4";
  let col22 = document.createElement('div');
  col22.className = "col-md-5";

  let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-danger";
  btn_r.onclick = function() {
    remove_column(`column-${col_name}-card`);
    document.getElementById('saveColumns').setAttribute('disabled','true');
    document.getElementById('add-custom-column').removeAttribute("disabled");}
  btn_r.innerText = "Remove Column";

  let btn_p = document.createElement('a');
  btn_p.setAttribute('role','button');
  btn_p.setAttribute('data-toggle','collapse');
  btn_p.setAttribute('href',`#sample${col_name}`);
  btn_p.setAttribute('aria-expanded','false');
  btn_p.setAttribute('aria-controls',`sample${col_name}`);
  btn_p.className = "btn btn-info";
  // btn_p.onclick = function() {preview_column(`column-${col_name}-card`)};
  btn_p.onclick = function () {
    fetch_preview(col_name);
  }
  btn_p.innerText = "Preview Custom Column";

  let row3 = document.createElement('div');
  row3.className = "collapse";
  row3.setAttribute('id',`sample${col_name}`);
  let sample_card = document.createElement('div');
  sample_card.className = "card card-body";
  sample_card.innerText = "Nothing to see yet...";
  row3.appendChild(sample_card);

  // Build the card
  drop1.appendChild(button1);
  drop1.appendChild(list_data_sources_col(col_name));
  center1.appendChild(drop1);
  col1.appendChild(center1);
  col2.appendChild(label);
  col2.appendChild(text_in);
  row.appendChild(col1);
  row.appendChild(col2);
  // card_b.appendChild(glyph);
  card_b.appendChild(card_title);
  card_b.appendChild(row);
  col12.appendChild(btn_r);
  col22.appendChild(btn_p);
  row2.appendChild(col12);
  row2.appendChild(col22);
  card_b.appendChild(row2);
  card_b.appendChild(row3);
  card.appendChild(card_b);
  cols_count++;
  return card;
}

// Function to retrieve data from original column in order to generate the preview
//   based on the regex that the user provides
function fetch_preview(column) {
  // let data = parseInt(document.getElementById(`column-${column}-card`).querySelector(`#column-${column}`).dataset.source);
  let columnN = parseInt(document.getElementById(`column-${column}-card`).querySelector(`#column-${column}`).dataset.column);
  // if (testJSON.find(element => element.ID == data)) {
  //   let colID = testJSON.find(element => element.ID == data)['columns'].find(element => element.name==columnN)['ID'];

  window.api.send("toMain", {action: "getDataFromColumn", payload:{column_id:columnN,limit:5}, column:column});
  // }
  
}

// Function to render a preview of the custom column based on the data fetched in fetch_preview,
//   will notify user when regex is not valid
function create_preview(column) {
  let columnName = document.getElementById(`column-${column}-card`).querySelector(`h5`).innerText;
  let columnFilter = testJSON.filter(ds => ds.columns?.filter(col => col?.name == columnName).length > 0);
  if( !(columnFilter?.length > 0) ) {
    document.getElementById('saveColumns').removeAttribute('disabled');
    if (document.getElementById('alert')) {
      document.getElementById('alert').remove();
    }
  } else {
    document.getElementById('saveColumns').setAttribute('disabled', 'true');
    if (!document.getElementById('alert')) {
      let alert = document.createElement('h6');
      alert.setAttribute('id', 'alert');
      alert.innerText = "Column name already taken. Please update and try again.";
      document.getElementById(`column-${column}-card`).appendChild(alert);
      document.getElementById(`column-${column}-card`).querySelector(`h5`).focus();      
    }
}

  let columnN = parseInt(document.getElementById(`column-${column}-card`).querySelector(`#column-${column}`).dataset.column);

  let this_card = previews.find(element => element.column_id == columnN)['rows'];
  let current = [];
  for (let i=0; i < this_card.length; i++) {
    current.push(this_card[i]['data_string']);
  }

  let exp = new RegExp(document.getElementById(`column-${column}-card`).querySelector(`#rule-${column}`).value);

  let preview = [];
  for (let i=0; i < current.length; i++) {
    try {
    preview.push([i, exp.exec(current[i])[1]]);
    } catch {
      preview.push([i, "*No match*"]);
    }
  }

  let preview_table = document.createElement('table');
  preview_table.className = 'table';
  let table_b = document.createElement('tbody');
  let table_h = document.createElement('thead');
  let th1 = document.createElement('th');
  let th2 = document.createElement('th');
  th1.setAttribute('scope', 'col');
  th1.appendChild(document.createTextNode('Row'));
  th2.setAttribute('scope', 'col');
  th2.appendChild(document.createTextNode('New Value'));
  table_h.appendChild(th1);
  table_h.appendChild(th2);
  table_b.appendChild(table_h);
  for (let i=0; i < preview.length; i++) {
    let cell1_text = preview[i][0];
    let cell2_text = preview[i][1];
    let row = document.createElement('tr');
    let cell1 = document.createElement('th');
    cell1.setAttribute('scope', 'row');
    let cell2 = document.createElement('td');
    cell1.appendChild(document.createTextNode(cell1_text));
    cell2.appendChild(document.createTextNode(cell2_text));

    row.appendChild(cell1);
    row.appendChild(cell2);
  
    table_b.appendChild(row);
  }

  removeAllChildNodes(preview_table);
  preview_table.appendChild(table_b);

  document.getElementById(`sample${column}`).querySelector('table').remove();
  document.getElementById(`sample${column}`).appendChild(preview_table);

  if (document.getElementById('sample2')) {
    if (document.getElementById('sample2').querySelector('td').innerText=='undefined') {
      if (document.getElementById('saveColumns')) {
        document.getElementById('saveColumns').setAttribute("disabled", "true");
  }}}
}

// Function to notify the user that regex provided is invalid, and therefore cannot
//   be previewed in the custom column card's preview area
function preview_error(column) {
  document.getElementById('saveColumns').setAttribute("disabled", "disabled");
  // let source = document.getElementById(`column-${column}-card`).querySelector(`#column-${column}`).innerText;
  // let data = source.split(" - ")[0];
  // let columnN = source.split(" - ")[1];
  // let colID = testJSON.find(element => element.ID == data)['columns'].find(element => element.name==columnN)['ID'];

  let preview_table = document.createElement('table');
  preview_table.className = 'table';
  let table_b = document.createElement('tbody');
  let table_h = document.createElement('thead');
  let th1 = document.createElement('th');
  let th2 = document.createElement('th');
  th1.setAttribute('scope', 'col');
  th1.appendChild(document.createTextNode('Row'));
  th2.setAttribute('scope', 'col');
  th2.appendChild(document.createTextNode('New Value'));
  table_h.appendChild(th1);
  table_h.appendChild(th2);
  table_b.appendChild(table_h);
  

  for (let i=0; i < 5; i++) {
    let cell1_text = `${i}`;
    let cell2_text = "Invalid RegEx for this context.";
    let row = document.createElement('tr');
    let cell1 = document.createElement('th');
    cell1.setAttribute('scope', 'row');
    let cell2 = document.createElement('td');
    cell1.appendChild(document.createTextNode(cell1_text));
    cell2.appendChild(document.createTextNode(cell2_text));

    row.appendChild(cell1);
    row.appendChild(cell2);

    table_b.appendChild(row);
  }

  preview_table.appendChild(table_b);

  document.getElementById(`sample${column}`).innerHTML = "<br><br>";
  document.getElementById(`sample${column}`).append(preview_table);
}

// function save_link(link) {
//   if (document.getElementById(`variable${link}-left`).innerText=="Select First Variable " | document.getElementById(`variable${link}-right`).innerText=="Select Second Variable ") {
//     alert("Please choose two valid columns before saving");
//   } else {
//   links[link] = {
//   'columns' : [
//     document.getElementById(`variable${link}-left`).innerText.split(" - "),
//     document.getElementById(`variable${link}-right`).innerText.split(" - ")
//   ]
//   };
//   }
// }

// Helper function to put new custom column card in the correct place
//   on the page
function add_column_card() {
  $("#col-modal-main").append(add_custom_column());
}

// Helper function to put new link card in the correct place
//   on the page
function add_link_card() {
  $("#columnsLink").append(add_link(null));
}

// function add_link_card_null() {
//   $("#columnsLink").append(add_link_null());
// }


// Function to list all columns (with names) for all loaded data sources
//   used to generate dropdowns for column selection within the rule creation
//   interface
function list_data_sources(side, link) {
  let dropdown = document.createElement('div');
  dropdown.className = "dropdown-menu pre-scrollable";
  dropdown.setAttribute('aria-labelledby','dropdownMenuButton');
  for (let i=0; i<testJSON.length; i++) {
    for (let j=0; j<testJSON[i]['columns'].length; j++) {
      let el = document.createElement('a');
      el.className = "dropdown-item";
      el.setAttribute("href","#");
      el.setAttribute('id', `dropdown-${side}-${link}`);
      el.setAttribute('data-source', testJSON[i]['ID']);
      el.setAttribute('data-column', testJSON[i]['columns'][j]['ID']);
      el.addEventListener('click', function() { button_update(side, i, j, link)});
      el.innerText = `${testJSON[i]['ID']} - ${testJSON[i]['columns'][j]['name']}`;
      dropdown.append(el);
  }}
  return dropdown;
}


// Function to list all columns (with names) for all loaded data sources
//   where there are not two columns with identical dropdowns
function list_data_sources_col(link) {
  let dropdown = document.createElement('div');
  dropdown.className = "dropdown-menu pre-scrollable";
  dropdown.setAttribute('aria-labelledby','dropdownMenuButton');
  for (let i=0; i<testJSON.length; i++) {
    for (let j=0; j<testJSON[i]['columns'].length; j++) {
      let el = document.createElement('a');
      el.className = "dropdown-item";
      el.setAttribute("href","#");
      el.setAttribute('id', `dropdown-${link}`);
      el.setAttribute('data-source', testJSON[i]['ID']);
      el.setAttribute('data-column', testJSON[i]['columns'][j]['ID']);
      el.addEventListener('click', function() { 
        button_update_column(i, j, link); 
        fetch_preview(link); });
      el.innerText = `${testJSON[i]['ID']} - ${testJSON[i]['columns'][j]['name']}`;
      dropdown.append(el);
  }}
  return dropdown;
}

// function list_data_sources_null(link) {
//   let dropdown = document.createElement('div');
//   dropdown.className = "dropdown-menu";
//   dropdown.setAttribute('aria-labelledby','dropdownMenuButton');
//   for (let i=0; i<testJSON.length; i++) {
//     for (let j=0; j<testJSON[i]['columns'].length; j++) {
//       let el = document.createElement('a');
//       el.className = "dropdown-item";
//       el.setAttribute("href","#");
//       el.setAttribute('id', `dropdown-1-${link}`);
//       el.addEventListener('click', function() { button_update_null(i, j, link)});
//       el.innerText = `${testJSON[i]['ID']} - ${testJSON[i]['columns'][j]['name']}`;
//       dropdown.append(el);
//   }}
//   return dropdown;
// }

// Function to create the dropdown of column names for a single
//   data source in order to select the key column for matching
//   across data sources
function list_columns(id) {
  let dropdown = document.createElement('div');
  dropdown.className = "dropdown-menu pre-scrollable";
  dropdown.setAttribute("aria-labelledby", "dropdownMenuButton");
  let columns = testJSON.find(element => element.ID == id)['columns'];
  for (let i=0; i<columns.length; i++) {
    let el = document.createElement('a');
    el.className = "dropdown-item";
    el.setAttribute("href","#");
    el.onclick = function() {id_update(id, i)};
    el.innerText = `${columns[i]['name']}`;
    // dropdown += `<a class="dropdown-item" href="#" onclick="id_update('${name}', ${i});">${columns[i]}</a>`;
    dropdown.appendChild(el);
  }
  return dropdown;
}

// Function to update the text on buttons when a data source/column combination is
//   selected from a dropdown, indicating that the change has been registered
//   This version is for two-column contexts
function button_update_column(data_id, column_id, link) {
    document.getElementById(`column-${link}`).innerText = testJSON[data_id]['ID'] + " - " + testJSON[data_id]['columns'][column_id]['name'];
    document.getElementById(`column-${link}`).setAttribute('data-source', testJSON[data_id]['ID']);
    document.getElementById(`column-${link}`).setAttribute('data-column', testJSON[data_id]['columns'][column_id]['ID']);
}

// Function to update the text on buttons indicating the key column id, as well
//   as to pass the key column id to the backend
function id_update(id, column_id) {
  // console.log(side, storage, data_id, column_id, link)
  let data = testJSON.find(element => element.ID == id);
  let columns = data['columns']
  document.getElementById(`columns-${id}`).innerText = columns[column_id]['name'];
  window.api.send("toMain", {action: "updateKeyColumn", payload:{dataSource_id:data['ID'], column_id: columns[column_id]['ID']}});
}

// Function to update the text on buttons when a data source/column combination is
//   selected from a dropdown, indicating that the change has been registered
function button_update(side, data_id, column_id, link) {
  if (side==1) {
    console.log(side, data_id, column_id, link)
    document.getElementById(`variable${link}-left`).innerText = testJSON[data_id]['ID'] + " - " + testJSON[data_id]['columns'][column_id]['name'];
    document.getElementById(`variable${link}-left`).setAttribute('data-source', testJSON[data_id]['ID']);
    document.getElementById(`variable${link}-left`).setAttribute('data-column', testJSON[data_id]['columns'][column_id]['ID']);
  } else {
    console.log(side, data_id, column_id, link)
    document.getElementById(`variable${link}-right`).innerText = testJSON[data_id]['ID'] + " - " + testJSON[data_id]['columns'][column_id]['name'];
    document.getElementById(`variable${link}-right`).setAttribute('data-source', testJSON[data_id]['ID']);
    document.getElementById(`variable${link}-right`).setAttribute('data-column', testJSON[data_id]['columns'][column_id]['ID']);
  }
}

// function button_update_null(data_id, column_id, link) {
//     console.log(data_id, column_id, link)
//     document.getElementById(`variable${link}-left`).innerText = testJSON[data_id]['ID'] + " - " + testJSON[data_id]['columns'][column_id]['name'];
// }

// Function to find and pass all link rules from the UI to the backend
//   If a link rule exists but has been modified, it will be updated
//   If a link did not exist before, then it will be created
function send_links(all_rules) {
  for (let i =0; i<all_rules.length; i++) {
    let data1 = parseInt(all_rules[i]['data1']);
    let data2 = parseInt(all_rules[i]['data2']);
    let colID1 = all_rules[i]['colID1'];
    let colID2 = all_rules[i]['colID2'];
    let lowerCase = all_rules[i]['lowerCase'];
    let ruleNo = parseInt(all_rules[i]['ID']);
    let nullRule = all_rules[i]['nullRule'];

    if (rules.find(element => element.ID == ruleNo)) {
      if (nullRule) {
        console.log(`window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:"exists", ID: ${ruleNo}}});`);
        window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:"exists", ID: ruleNo}});
      } else if (lowerCase) {
        console.log(`window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:"case insensitive", ID: ${ruleNo}}});`);
        window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:"case insensitive", ID: ruleNo}});
      } else { 
        console.log(`window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:"", ID: ${ruleNo}}});`);
        window.api.send("toMain", {action: "updateRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:"", ID: ruleNo}}); 
      }
  
      
  
    } else {
      if (nullRule) {
        console.log(`window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:"exists"}});`);
        window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:"exists"}});
      } else if (lowerCase) {
        console.log(`window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:"case insensitive"}});`);
        window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:"case insensitive"}});
      } else {
        console.log(`window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: ${data1}, dataSource_id_two: ${data2}, columns_id_one: ${colID1}, columns_id_two: ${colID2}, sqlrule: "=", otherrule:""}});`);
        window.api.send("toMain", {action: "insertRule", payload:{dataSource_id_one: data1, dataSource_id_two: data2, columns_id_one: colID1, columns_id_two: colID2, sqlrule: "=", otherrule:""}});
      }
  
      
    }
  }
  alert("Saved!");
}

// Takes an element from the payload 'getTransforms' and renders a blob about that rule (not editable)
// Transformed columns that have been saved cannot be edited, only deleted
function add_existing_transform(rule) {
  let card = document.createElement('div');
  card.className = `card`;
  card.setAttribute("style","width: 18*3rem;");
  card.setAttribute("id",`custom-${rule.target_columns_id}`);
  let card_b = document.createElement('div');
  card_b.className = "card-body";
  let card_title = document.createElement('h5');
  card_title.className = "card-title";
  console.log(rule);
  let index1 = testJSON.findIndex(element=>element.ID==rule.dataSource_id);
  console.log(testJSON[index1]);
  let index2 = testJSON[index1]['columns'].findIndex(element=>element.ID==rule.target_columns_id);
  console.log(index2);
  let title = rule.dataSource_id + ' - ' + testJSON[index1]['columns'][index2]['name'];
  card_title.innerText = `Previously Saved: ${title}`;
  let row = document.createElement('div');
  row.className = "row";
  //Left Column
  let col1 = document.createElement('div');
  col1.className = "col-md-6";
  col1.innerText = `Regex: ${rule.regular_rule}`
  //Empy Middle Column
  let col2 = document.createElement('div');
  col2.className = "col-md-3";
  //Empy Middle Column
  let col3 = document.createElement('div');
  col3.className = "col-md-3";

  let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-danger";
  btn_r.onclick = function() {delete_transform(rule.target_columns_id)};
  btn_r.innerText = "Delete";

  col3.appendChild(btn_r);
  row.appendChild(col1);
  row.appendChild(col2);
  row.appendChild(col3);
  card_b.appendChild(card_title);
  card_b.appendChild(row);
  card.appendChild(card_b);

  document.getElementById('col-modal-priors').appendChild(card);
  cols_count+=1;

}

// Function to delete custom columns, both from UI as well
//   as from the backend
function delete_transform(column) {
  let card = document.getElementById(`custom-${column}`)
  card.remove();

  window.api.send("toMain", {action: "deleteColumn", ID: column});
  window.api.send("toMain", {'action': "getTransforms"});
}

// Function to create cards for mismatch data
// Contains information on the source data files, as well as information
//   about the key ID in the primary (left) data source, and the values for
//   the two data sets in the mismatched records
//   Will pass record to function create_null_mismatch_card in the case that
//   the mismatch is created by a null rule violation
function create_mismatch_card(card_data, source1, source2) {
  if (card_data.otherrule=='exists') {
     return create_null_mismatch_card(card_data, source1, source2);
  } else {
    let card = document.createElement('div');
    card.className = `card`;
    card.setAttribute("style","width: 18*3rem;");
    card.setAttribute("id",`mismatch`);
    let card_b = document.createElement('div');
    card_b.className = "card-body";
    let card_title = document.createElement('h5');
    card_title.className = "card-title";
    card_title.innerText = `Mismatch found between ${source1} - ` + card_data.columnOneName + ` and ${source2} - ` + card_data.columnTwoName;

    let card_title2 = document.createElement('h5');
    card_title2.className = "card-title";
    card_title2.innerText = `Key Column Value: ${card_data.key_string}`;
    
    // Data row
    let row = document.createElement('div');
    row.className = "row";
    row.style.marginBottom = "50px";
    row.style.marginTop = "50px";
    // Left Column
    let col1 = document.createElement('div');
    col1.className = "col-md-4";
    if (card_data.one_string) {
      col1.innerHTML = `${source1} - ${card_data.columnOneName} value:<br> ${card_data.one_string}`;
    } else if (card_data.one_string=="") {
      col1.innerHTML = `${source1} - ${card_data.columnOneName} value:<br> *Empty Cell*`;
    } else {
      col1.innerHTML = `${source1} - ${card_data.columnOneName} value:<br> ${toString(card_data.one_num)}`;
    }
    
    // Middle Column
    let col2 = document.createElement('div');
    col2.className = "col-md-4";
    if (card_data.two_string) {
      col2.innerHTML = `${source2} - ${card_data.columnTwoName} value:<br> ${card_data.two_string}`;
    } else if (card_data.two_string=="") {
      col2.innerHTML = `${source2} - ${card_data.columnTwoName} value:<br> *Empty Cell*`;
    } else {
      col2.innerHTML = `${source2} - ${card_data.columnTwoName} value:<br> ${toString(card_data.two_num)}`;
    }

    // Right Column
    let col3 = document.createElement('div');
    col3.className = "col-md-4";
    col3.innerHTML = `True Value: ${card_data.key_string}`;

    // Button row
    let row2 = document.createElement('div');
    row2.className = "row";
    row2.style.marginBottom = "50px";
    //Left Column
    let col12 = document.createElement('div');
    col12.className = "col-md-3";
    // Middle Column
    let col22 = document.createElement('div');
    col22.className = "col-md-3";
    // Middle Column 2
    let col32 = document.createElement('div');
    col32.className = "col-md-3";
    // Right Column
    let col42 = document.createElement('div');
    col42.className = "col-md-3";

    let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-success";
  btn_r.onclick = function() {
    let a = mismatch_numbers[0];
    let b = mismatch_numbers[1];
    mark_fixed(a, b);
  };
  btn_r.innerText = "Mark Fixed";

    let btn_g = document.createElement('a');
    btn_g.setAttribute('href','#');
    btn_g.className = "btn btn-warning";
    btn_g.onclick = function() {
      if (mismatch_numbers[0]===exceptions.length-1) {
        first_mismatch();
      } else {
        mismatch_numbers[0]+=1;
        mismatch_numbers[1]=0;
        skip_mismatch();
      }
    };
    btn_g.innerText = "Skip Rule";

    // let btn_a = document.createElement('a');
    // btn_a.setAttribute('href','#');
    // btn_a.className = "btn btn-danger";
    // btn_a.onclick = function() {};
    // btn_a.innerText = "Mark ALL Fixed";

    // // Next/Previous row
    // let row3 = document.createElement('div');
    // row3.className = "row";
    // //Left Column
    // let col13 = document.createElement('div');
    // col13.className = "col-md-10";
    // // Right Column
    // let col23 = document.createElement('div');
    // col23.className = "col-md-2";

    let button1 = document.createElement('button');
    button1.className = "btn btn-primary";
    button1.setAttribute('type', 'button');
    button1.onclick = function() {previous_mismatch();};
    button1.innerText = "Previous";

    let button2 = document.createElement('button');
    button2.className = "btn btn-primary";
    button2.setAttribute('type', 'button');
    // button2.onclick = function() {if (mismatch_numbers[1]===exceptions[mismatch_numbers[0]].exceptions.length-1) {
    //   if (mismatch_numbers[0]===exceptions.length-1) {
    //     first_mismatch();
    //   } else {
    //     mismatch_numbers[0]++;
    //     mismatch_numbers[1]=0;
    //     next_mismatch();
    //   }
    // } else {
    //   mismatch_numbers[1]++;
    //   next_mismatch()
    // }
    button2.onclick = function() {next_mismatch();};
    button2.innerText = "Next";

    // col13.appendChild(button1);
    // col23.appendChild(button2);

    // row3.appendChild(col13);
    // row3.appendChild(col23);

    col12.appendChild(btn_r);
    col22.appendChild(btn_g);
    // col32.appendChild(btn_a);
    col32.appendChild(button1);
    col42.appendChild(button2);

    row2.appendChild(col12);
    row2.appendChild(col22);
    row2.appendChild(col32);
    row2.appendChild(col42);

    row.appendChild(col1);
    row.appendChild(col2);
    card_b.appendChild(card_title);
    card_b.appendChild(card_title2);
    card_b.appendChild(row);
    card_b.appendChild(row2);
    // card_b.appendChild(row3);
    card.appendChild(card_b);

    return card;
  }
}

// Function to create cards for mismatch data from null rules
// Contains information on the source data files, as well as information
//   about the key ID in the primary (left) data source
function create_null_mismatch_card(card_data, source1, source2) {
  let card = document.createElement('div');
  card.className = `card`;
  card.setAttribute("style","width: 18*3rem;");
  card.setAttribute("id",`mismatch`);
  let card_b = document.createElement('div');
  card_b.className = "card-body";
  let card_title = document.createElement('h5');
  card_title.className = "card-title";
  card_title.innerText = `Mismatch found between Data Source ${source1} and Data Source ${source2}`;

  let card_title2 = document.createElement('h5');
  card_title2.className = "card-title";
  card_title2.innerText = `Key Column Value: ${card_data.key_string}`;
  
  // Data row
  let row = document.createElement('div');
  row.className = "row";
  row.style.marginBottom = "50px";
  row.style.marginTop = "50px";
  // Left Column
  let col1 = document.createElement('div');
  col1.className = "col-md-12";
  let data_name = testJSON.find(element => element.ID==source2)['name'];
  col1.innerHTML = `No row found in Data Source "${data_name}" with a key column value equal to ${card_data.key_string}`;

  // Button row
  let row2 = document.createElement('div');
  row2.className = "row";
  row2.style.marginBottom = "50px";
  //Left Column
  let col12 = document.createElement('div');
  col12.className = "col-md-3";
  // Middle Column
  let col22 = document.createElement('div');
  col22.className = "col-md-3";
  // Middle Column 2
  let col32 = document.createElement('div');
  col32.className = "col-md-3";
  // Right Column
  let col42 = document.createElement('div');
  col42.className = "col-md-3";

  let btn_r = document.createElement('a');
  btn_r.setAttribute('href','#');
  btn_r.className = "btn btn-success";
  btn_r.onclick = function() {
    let a = mismatch_numbers[0];
    let b = mismatch_numbers[1];
    mark_fixed(a, b);
  };
  btn_r.innerText = "Mark Fixed";

  let btn_g = document.createElement('a');
  btn_g.setAttribute('href','#');
  btn_g.className = "btn btn-warning";
  btn_g.onclick = function() {
    if (mismatch_numbers[0]===exceptions.length) {
      first_mismatch();
    } else {
      mismatch_numbers[0]+=1;
      mismatch_numbers[1]=0;
      skip_mismatch();
    }
  };
  btn_g.innerText = "Skip Rule";

  // let btn_a = document.createElement('a');
  // btn_a.setAttribute('href','#');
  // btn_a.className = "btn btn-danger";
  // btn_a.onclick = function() {};
  // btn_a.innerText = "Mark ALL Fixed";

  // // Next/Previous row
  // let row3 = document.createElement('div');
  // row3.className = "row";
  // //Left Column
  // let col13 = document.createElement('div');
  // col13.className = "col-md-10";
  // // Right Column
  // let col23 = document.createElement('div');
  // col23.className = "col-md-2";

  let button1 = document.createElement('button');
  button1.className = "btn btn-primary";
  button1.setAttribute('type', 'button');
  button1.onclick = function() {previous_mismatch();};
  button1.innerText = "Previous";

  let button2 = document.createElement('button');
  button2.className = "btn btn-primary";
  button2.setAttribute('type', 'button');
  // button2.onclick = function() {if (mismatch_numbers[1]===exceptions[mismatch_numbers[0]].exceptions.length-1) {
  //   if (mismatch_numbers[0]===exceptions.length-1) {
  //     first_mismatch();
  //   } else {
  //     mismatch_numbers[0]++;
  //     mismatch_numbers[1]=0;
  //     next_mismatch();
  //   }
  // } else {
  //   mismatch_numbers[1]++;
  //   next_mismatch()
  // }
  button2.onclick = function() {next_mismatch();};
  button2.innerText = "Next";

  // col13.appendChild(button1);
  // col23.appendChild(button2);

  // row3.appendChild(col13);
  // row3.appendChild(col23);

  col12.appendChild(btn_r);
  col22.appendChild(btn_g);
  // col32.appendChild(btn_a);
  col32.appendChild(button1);
  col42.appendChild(button2);

  row2.appendChild(col12);
  row2.appendChild(col22);
  row2.appendChild(col32);
  row2.appendChild(col42);

  row.appendChild(col1);
  card_b.appendChild(card_title);
  card_b.appendChild(card_title2);
  card_b.appendChild(row);
  card_b.appendChild(row2);
  // card_b.appendChild(row3);
  card.appendChild(card_b);

  return card;
}

function mark_fixed(mismatch1, mismatch2) {
  console.log('mark_fixed');
  ignores.push({rule : exceptions[mismatch1].ID, id_one : exceptions[mismatch1].exceptions[mismatch2].key_string, id_two : exceptions[mismatch1].exceptions[mismatch2].key_string});
  next_mismatch();
  window.api.send("toMain", {action: "addIgnore", payload:{rule_id:exceptions[mismatch1].ID, id_one:exceptions[mismatch1].exceptions[mismatch2].key_string,id_two:exceptions[mismatch1].exceptions[mismatch2].key_string}});
}

// Function to seek out the first mismatch, so that the next and previous buttons
//   are able to cycle past start/endpoints
function first_mismatch() {
  let mismatch_counter = 0;
  let search_counter = 0;
  for (let i=0; i<exceptions.length; i++) {
    mismatch_counter+=exceptions[i].exceptions.length;
   }
  mismatch_numbers = [0,0];
  // let check;
  for (let i=0; i<exceptions.length; i++) {
    for (let j=0; j<exceptions[i].exceptions.length; j++) {
      search_counter++;
      if (search_counter==mismatch_counter) {
        document.getElementById('columnsMismatch').innerHTML = "<h5>No outstanding exceptions based on current rules</h5>";
        return null;
      }
      console.log(`FIRST MISMATCH i: ${i}, j: ${j}`);
      let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
      if (!check) {
        mismatch_numbers = [i, j];
        document.getElementById("columnsMismatch").innerHTML = "";
        document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
        return "matched!";
      }
  }

}
}

// Function to seek out the last mismatch, so that the next and previous buttons
//   are able to cycle past start/endpoints
function last_mismatch() {
  let mismatch_counter = 0;
  let search_counter = 0;
  for (let i=0; i<exceptions.length; i++) {
    mismatch_counter+=exceptions[i].exceptions.length;
   }
  mismatch_numbers = [0,0];
  // let check;
  for (let i=exceptions.length-1; i>=0; i--) {
    for (let j=exceptions[i].exceptions.length-1; j>=0; j--) {
      search_counter++;
      if (search_counter==mismatch_counter) {
        document.getElementById('columnsMismatch').innerHTML = "<h5>No outstanding exceptions based on current rules</h5>";
        return null;
      }
      console.log(`LAST MISMATCH i: ${i}, j: ${j}`);
      let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
      if (!check) {
        mismatch_numbers = [i, j];
        document.getElementById("columnsMismatch").innerHTML = "";
        document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
        return "matched!";
      }
  }

}
}

// Function to advance the mismatch card to the next mismatch in the exceptions list
function skip_mismatch() {
  if (!mismatch_numbers[1]<exceptions[mismatch_numbers[0]].exceptions.length) {
    if (mismatch_numbers[0]<exceptions.length) {
      mismatch_numbers[1]=0;
    } else {
      first_mismatch();
    }
  }
  // let check;
  for (let i=mismatch_numbers[0]; i<exceptions.length; i++) {
    for (let j=mismatch_numbers[1]; j<exceptions[i].exceptions.length; j++) {
      console.log(`i: ${i}, j: ${j}`);
      let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
      if (!check) {
        mismatch_numbers = [i, j];
        document.getElementById("columnsMismatch").innerHTML = "";
        document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
        return "matched!";
      }
  }

}
  first_mismatch();
}

// Function to advance the mismatch card to the next mismatch in the exceptions list
function next_mismatch() {
  mismatch_last = mismatch_numbers;
  if (mismatch_numbers[1]<exceptions[mismatch_numbers[0]].exceptions.length-1) {
    mismatch_numbers[1]++;
  } else {
    if (mismatch_numbers[0]<exceptions.length) {
      mismatch_numbers[1]=0;
      mismatch_numbers[0]++;
    } else {
      first_mismatch();
    }
  }
  // let check;
  for (let i=mismatch_numbers[0]; i<exceptions.length; i++) {
    for (let j=mismatch_numbers[1]; j<exceptions[i].exceptions.length; j++) {
      console.log(`i: ${i}, j: ${j}`);
      let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
      if (!check) {
        mismatch_numbers = [i, j];
        document.getElementById("columnsMismatch").innerHTML = "";
        document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
        return "matched!";
      }
  }

}
  first_mismatch();
}

// Function to step backwards to the prior mismatch card in the exceptions list
function previous_mismatch() {
  mismatch_last = mismatch_numbers;
  if (mismatch_numbers[1]>0) {
    mismatch_numbers[1]--;
  } else if (mismatch_numbers[1]===0) {
    if (mismatch_numbers[0]>0) {
      mismatch_numbers[1]=exceptions[mismatch_numbers[0]-1].exceptions.length-1;
      mismatch_numbers[0]--;
    } else if (mismatch_numbers[0]===0) {
      last_mismatch();
    }
  }
  // let check;
  for (let i=mismatch_numbers[0]; i>=0; i--) {
    if (i==mismatch_numbers[0]) {
      for (let j=mismatch_numbers[1]; j>=0; j--) {
        console.log(`i: ${i}, j: ${j}`);
        let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
        if (!check) {
          mismatch_numbers = [i, j];
          document.getElementById("columnsMismatch").innerHTML = "";
          document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
          return "matched!";
        }
    }} else {
    for (let j=exceptions[i].exceptions.length-1; j>=0; j--) {
      console.log(`i: ${i}, j: ${j}`);
      let check = ignores.find(element => element.rule == exceptions[i].ID && element.id_one == exceptions[i].exceptions[j].key_string);
      if (!check) {
        mismatch_numbers = [i, j];
        document.getElementById("columnsMismatch").innerHTML = "";
        document.getElementById("columnsMismatch").appendChild(create_mismatch_card(exceptions[i].exceptions[j], exceptions[i].dataSource_id_one, exceptions[i].dataSource_id_two));
        return "matched!";
      }
    }
  }

}
  last_mismatch();
}


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

// Declare global variables
var link_count = 0;
var cols_count = 0;
var mismatch_numbers = [0,0];
var testJSON, rules, exceptions, ignores;
var previews = [];

// var test;


// On-click functionality for the add-link-card button
$( "#add-link-card" ).click(function() {
  add_link_card();
});

// $( "#add-null-card" ).click(function() {
//   add_link_card_null();
// });

// On-click functionality for the saveLinks button
// Contains failsafes for when one of the two columns has not yet been selected
$("#saveLinks").click(function() {
  let all_rules = [];
  for (let i =0; i<document.getElementById('columnsLink').children.length; i++) {
    let ruleNo = document.getElementById('columnsLink').children[i].querySelector('[class=card-title]').innerText.split(" ").pop()
    let lowerCase = $(`#noCase-${ruleNo}`)[0].checked
    let nullRule = $(`#nullRule-${ruleNo}`)[0].checked
    let col1 = document.getElementById('columnsLink').children[i].querySelector('[id=column1]');
    let col2 = document.getElementById('columnsLink').children[i].querySelector('[id=column2]');
    if (col1.innerText.split(" ")[0]=="Select") {
      alert(`Rule ${ruleNo} not saved because the first variable was not selected.`);
    } else if (col2.innerText.split(" ")[0]=="Select") {
      alert(`Rule ${ruleNo} not saved because the second variable was not selected.`);
    } else {
      // SEND MESSAGE TO MAIN HERE

      let data1 = parseInt(document.getElementById('columnsLink').children[i].querySelector('[id=column1]').querySelector('button').dataset.source);
      let colID1 = parseInt(document.getElementById('columnsLink').children[i].querySelector('[id=column1]').querySelector('button').dataset.column);

      let data2 = parseInt(document.getElementById('columnsLink').children[i].querySelector('[id=column2]').querySelector('button').dataset.source);
      let colID2 = parseInt(document.getElementById('columnsLink').children[i].querySelector('[id=column2]').querySelector('button').dataset.column);

      let this_record = {
        'ID' : ruleNo,
        'data1': data1,
        'data2': data2,
        'colID1': colID1,
        'colID2' : colID2,
        'lowerCase': lowerCase,
        'nullRule' : nullRule
        }

      all_rules.push(this_record);
      
    }
  }
  console.log(all_rules);
  send_links(all_rules);

});

// On-click functionality for the add-custom-column button
$( "#add-custom-column" ).click(function() {
  add_column_card();
  document.getElementById('add-custom-column').setAttribute('disabled', 'true');
  document.getElementById('saveColumns').setAttribute('disabled', 'true');
});

// On-click functionality for the saveColumns button
// sends all new transforms for creation on the backend
$("#saveColumns").click(function() {

  for (let i=0; i<document.getElementById('col-modal-main').children.length; i++) {
    let data = parseInt(document.getElementById('col-modal-main').children[i].querySelector('button').dataset.source);
    let columnN = parseInt(document.getElementById('col-modal-main').children[i].querySelector('button').dataset.column);
    let columnTitle = document.getElementById('col-modal-main').children[i].querySelector('h5').innerText;

    let rule = document.getElementById('col-modal-main').children[i].querySelector('input').value

    // Insert Transform:
    window.api.send("toMain", {action: "insertTransform", payload: {dataSource_id: parseInt(data), column_id: parseInt(columnN), regular_rule: rule, name:columnTitle}});
    document.getElementById('add-custom-column').removeAttribute('disabled');
  }

});

// On-click functionality to add new data sources using the addSourceButton button
$( "#addSourceButton" ).click(function() {
  window.api.send("toMain", {action: "newDataset"});
});

// On-click functionality to fetch the linking rules for the rule cards
$( "#dataRules" ).click(function() {
  window.api.send("toMain", {action: "getRules"});
});

// On-click functionality to retrieve and render mismatches in the UI, elements
//   will be rendered by the render.js calls
$("#mismatchViewer").click(function() {
  document.getElementById('columnsMismatch').innerHTML = "<h5>Loading...</h5>";
  window.api.send("toMain", {action: "getExceptions"});

})