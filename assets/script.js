const constructorActivosv2 = async () => {
    //https://servicioexperience.zendesk.com/api/v2/search/export.json?query=status:hold%20tags:historico&page[size]=1&filter[type]=ticket
    let new_reg = []
    let search = "/api/v2/search/export.json?query=status:hold%20tags:historico&page[size]=1000&filter[type]=ticket";

    //let search = "/api/v2/search/export.json?query=status%3Ahold%20updated%3E1day&page[size]=10&filter[type]=ticket";

    //https://servicioexperience.zendesk.com/agent/search/1?type=ticket&q=status%3Ahold%20updated%3E1day
    //let registros = await client.request(search).then(async (res) => {  
    client.request(search).then(async (registros) => {  

    let i = 1  
    //console.log('Registros:' + registros);
    console.log('Paginacion '+ i);

    //new_reg = registros.results;
    new_reg = { tickets: registros.results }
    //console.log(new_reg);

    //let grupos = { groups: registros.groups }
    let paginaSig = registros.links.next
    //let results = registros.results
    let results = registros.meta.has_more

    //console.log(paginaSig)
    while (results != false) {
        //console.log('resu:' + results.length);
        await client.request(paginaSig).then((res2) => {
            i ++
            console.log('Paginacion '+ i);
            //grupos.groups = grupos.groups.concat(res2.groups)
            //new_reg.push(res2);            
            //console.log(new_reg);

            //console.log(res2.results);
            new_reg.tickets = new_reg.tickets.concat(res2.results);            
            //console.log(new_reg);
            results = res2.meta.has_more
            paginaSig = res2.links.next

            console.log(new_reg);   
            //downloadObjectAsJson(new_reg,'ticket');


        })
        //console.log();   
    }
    //setTimeout(() => { console.log("datos", JSON.stringify(new_reg)); }, 10000)
    //console.log("datos", JSON.stringify(new_reg));
    downloadObjectAsJson(new_reg,'ticket');

    })
    /*
    let new_reg = []
    for (let i = 0; i < registros.results.length; i++) {
        new_reg.push(registros.results[i]);
        
    }
    */
    //console.log(new_reg);
    
}

const downloadObjectAsJson = async (exportObj, exportName) => {
//function downloadObjectAsJson(exportObj, exportName){

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  

const constructorActivosv3 = async () => {
    //https://servicioexperience.zendesk.com/api/v2/search/export.json?query=status:hold%20tags:historico&page[size]=1&filter[type]=ticket
    let new_reg = []
    let search = "/api/v2/search/export.json?query=status:hold%20tags:historico&page[size]=1000&filter[type]=ticket";

    //let search = "/api/v2/search/export.json?query=status%3Ahold%20updated%3E1day&page[size]=10&filter[type]=ticket";

    //https://servicioexperience.zendesk.com/agent/search/1?type=ticket&q=status%3Ahold%20updated%3E1day
    //let registros = await client.request(search).then(async (res) => {  
    client.request(search).then(async (registros) => {  

    let i = 1  
    console.log('Paginacion '+ i);

    new_reg = { tickets: registros.results }

    let paginaSig = registros.links.next
    let results = registros.meta.has_more

    downloadObjectAsJson(new_reg,'ticket');
    new_reg = { tickets : [] };
    while (results != false) {
        await client.request(paginaSig).then((res2) => {
            i ++
            console.log('Paginacion '+ i);
            new_reg.tickets = new_reg.tickets.concat(res2.results);            
            results = res2.meta.has_more
            paginaSig = res2.links.next

            console.log(new_reg);   
            downloadObjectAsJson(new_reg,'ticket');
            new_reg = { tickets : [] };

        })
    }
    //downloadObjectAsJson(new_reg,'ticket');

    })
}

constructorActivosv3()