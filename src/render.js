/* eslint-disable no-undef */
// What to do when data is received from the main process
window.api.receive("fromMain", (data) => {
    console.log(data);
    const reducer = (max, current) => max['ID'] > current['ID'] ? max : current;
    switch (data['action']) {

        // Receiving list of datasets, render the data sets as cards
        case 'getDatasets':
            // console.log(data);
            document.getElementById("data-cards").innerHTML="";
            testJSON = data.payload;
            for (let i=0; i<testJSON.length; i++) {
                testJSON[i]['name'] = testJSON[i]['filepath'].split("/").pop().split("\\").pop().split(".")[0];
                $("#data-cards").append(createCard(testJSON[i]['ID']));
            }
            if (document.getElementById('col-modal-main').children.length>0) {
                document.getElementById('col-modal-main').children[0].remove();
            }
            document.getElementById('add-custom-column').removeAttribute('disabled');
//            window.api.send("toMain", {action: "getTransforms"});
            break;
        
        // When receiving link rules render those link rules in the rules modal
        case 'getRules':
            // console.log(data);
            rules = data.payload;
            
            if (rules.length > 0){
                link_count = parseInt(rules.reduce(reducer)['ID']);
            } else {
                link_count = 0;
            }
            
            console.log(link_count);
            document.getElementById("columnsLink").innerHTML="";
            for (let i=0; i<rules.length; i++) {
                $("#columnsLink").append(add_link(rules[i]['ID']));
                document.getElementById(`variable${rules[i]['ID']}-left`).innerText = testJSON.find(element => element.ID == rules[i]['dataSource_id_one'])['ID'] + ' - ' + testJSON.find(element => element.ID == rules[i]['dataSource_id_one'])['columns'].find(element => element.ID == rules[i]['columns_id_one'])['name'];
                document.getElementById(`variable${rules[i]['ID']}-left`).setAttribute('data-source', testJSON.find(element => element.ID == rules[i]['dataSource_id_one'])['ID']);
                document.getElementById(`variable${rules[i]['ID']}-left`).setAttribute('data-column', testJSON.find(element => element.ID == rules[i]['dataSource_id_one'])['columns'].find(element => element.ID == rules[i]['columns_id_one'])['ID']);
                document.getElementById(`variable${rules[i]['ID']}-right`).innerText = testJSON.find(element => element.ID == rules[i]['dataSource_id_two'])['ID'] + ' - ' + testJSON.find(element => element.ID == rules[i]['dataSource_id_two'])['columns'].find(element => element.ID == rules[i]['columns_id_two'])['name'];
                document.getElementById(`variable${rules[i]['ID']}-right`).setAttribute('data-source', testJSON.find(element => element.ID == rules[i]['dataSource_id_two'])['ID']);
                document.getElementById(`variable${rules[i]['ID']}-right`).setAttribute('data-column', testJSON.find(element => element.ID == rules[i]['dataSource_id_two'])['columns'].find(element => element.ID == rules[i]['columns_id_two'])['ID']);
                if (rules[i].otherrule=='case insensitive'){
                    document.getElementById(`noCase-${rules[i]['ID']}`).checked = true;
                }
                if (rules[i].otherrule=='exists'){
                    document.getElementById(`nullRule-${rules[i]['ID']}`).checked = true;
                }
            }

            break;
        
        // When getting data from a column, store that data in the previews object,
        //    or if it already exists, then replace the existing preview for that column
        case 'getDataFromColumn':
            console.log(previews);
            if (previews.find(element=>element.column_id==data.payload.column_id)) {
                let curPreviewIndex = previews.findIndex(element=>element.column_id==data.payload.column_id);
                previews[curPreviewIndex] = data.payload;
            } else {
                previews.push(data.payload);
            }
            
            
            try {
                create_preview(data.args.column);
              } catch {
                preview_error(data.args.column);
              }
            
            break;

        // When getting the list of transforms, list them into the modal as uneditable
        //   existing transforms. They can then only be deleted.
        case 'getTransforms':
            cols_count = 0;
            document.getElementById('col-modal-priors').innerHTML = "";
            if (document.getElementById('col-modal-main').children.length>0) {
                document.getElementById('col-modal-main').children[0].remove();
            }
            document.getElementById('add-custom-column').removeAttribute('disabled');

            for (let i=0; i<data.payload.length; i++) {
                add_existing_transform(data.payload[i]);
            }

            break;

        // Getting exceptions stores those exceptions in memory in the exceptions object,
        //   and then calls for the ignores to be passed, as well
        case 'getExceptions':
            exceptions = data.payload;
            
            if (exceptions?.length==0) {
                document.getElementById('columnsMismatch').innerHTML = "<h5>No outstanding exceptions based on current rules</h5>";
            }
//            window.api.send("toMain", {action: "getIgnores"});

            break;
        
        // Getting ignores will then find the first mismatch that is not marked to be
        //   ignored, and present this mismatch as a card in the mismatch modal.
        case 'getIgnores':
            ignores = data.payload;
            
            // Create loop to find FIRST mismatch, and display it on mismatch open, or to load last viewed mismatch
            
            if (data?.args?.action == "getExceptions"){
                if (mismatch_numbers[0]===0 && mismatch_numbers[1]===0){
                    first_mismatch();
                } else {
                    if (mismatch_numbers[1]>0){
                    mismatch_numbers[1]--;
                    next_mismatch();
                    } else if (mismatch_numbers[0]>0) {
                        mismatch_numbers[0]--;
                        mismatch_numbers[1]=exceptions[mismatch_numbers[0]].exceptions.length-1;
                        next_mismatch();
                    } else {
                        first_mismatch();
                    }
                }
            }

            break;

        case 'jsonLoaded':

            $('#sourceLinkModal').modal('hide');
            $('#createColumnModal').modal('hide');
            $('#mismatchModal').modal('hide');
            mismatch_numbers = [0,0];

            break;

        case 'ignoresCleared':

            $('#sourceLinkModal').modal('hide');
            $('#createColumnModal').modal('hide');
            $('#mismatchModal').modal('hide');
            mismatch_numbers = [0,0];

            break;
                     
    }
    
    
});

// $(document).ready(function () {

// });