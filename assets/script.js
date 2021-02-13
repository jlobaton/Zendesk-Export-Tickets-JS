/*
client.request("/api/v2/ticket_fields.json").then((res) => {
    console.log("custom fields", res);
})*/
const llenarData = async () => {
    let res = await client.request("/api/v2/ticket_forms.json")
    let ticket_forms = res.ticket_forms
    console.log(res);
    for (let i = 0; i < ticket_forms.length; i++) {
        let ticket_fields = []
        let form = ticket_forms[i]
        let campo_de_ticket = {}
        for (let j = 0; j < form.ticket_field_ids.length; j++) {
            let id = form.ticket_field_ids[j]
            let ticketField = await client.request(`/api/v2/ticket_fields/${id}.json`)
            let ticket_field = ticketField.ticket_field
            let opciones = []
            let opcion = {}
            campo_de_ticket.id_campo = ticket_field.id
            campo_de_ticket.nombre_campo = ticket_field.title
            campo_de_ticket.tipo = ticket_field.type
            if (ticket_field.type == "tagger") {

                ticket_field.custom_field_options.map((campo) => {
                    opcion = {}
                    opcion.id_opcion = campo.id
                    opcion.etiqueta_opcion = campo.raw_name
                    opcion.valor_opcion = campo.value
                    opciones.push(opcion)
                })
                campo_de_ticket.desplegable = opciones

            }
            ticket_fields.push(campo_de_ticket)
        }
        json.data.formularios.push({
            if_form: form.id,
            nombre_form: form.raw_name,
            ticket_fields: ticket_fields
        })
    }

}

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
/*
   Posteada originalmente aquí:
    https://stackoverflow.com/a/30800715/5587982
 */

const constructorActivos = async () => {
    let forms = await client.request("/api/v2/ticket_forms.json")
    forms = forms.ticket_forms
    let ticket_fields = await client.request("/api/v2/ticket_fields.json")
    ticket_fields = ticket_fields.ticket_fields
    let id, custom_field, form
    let campo = {}
    let campos = []
    let id_padre
    let desplegable_opciones = []
    let desplegable_arreglo = []
    let parent_ids = []
    let desplegable_opcion = {}
    for (let i = 0; i < forms.length; i++) {
        campos = []
        parent_ids = []
        form = forms[i]
        console.log("está activo ", form.active);
        if (form.active) {

            let { ticket_field_ids, agent_conditions } = form
            agent_conditions.map((value) => {
                value.child_fields.map((hijo) => {
                    parent_ids.push({
                        id: value.parent_field_id,
                        id_child: hijo.id
                    })
                })
            })
            for (let j = 0; j < ticket_field_ids.length; j++) {
                campo = {}
                desplegable_arreglo = []
                id = ticket_field_ids[j]
                custom_field = ticket_fields.find(custom_field => custom_field.id == id)
                campo.id_campo = custom_field.id
                id_padre = parent_ids.find(e => e.id_child == custom_field.id)
                if (id_padre != undefined) {
                    id_padre = id_padre.id
                    campo.id_padre = id_padre

                }
                campo.nombre_campo = custom_field.raw_title
                campo.tipo = custom_field.type
                if (custom_field.type == "tagger") {
                    desplegable_opciones = custom_field.custom_field_options
                    for (let k = 0; k < desplegable_opciones.length; k++) {
                        desplegable_opcion = {}
                        desplegable_opcion.id_opcion = desplegable_opciones[k].id
                        desplegable_opcion.etiqueta_opcion = desplegable_opciones[k].raw_name
                        desplegable_opcion.valor_opcion = desplegable_opciones[k].value
                        desplegable_arreglo.push(desplegable_opcion)
                    }
                    campo.desplegable = desplegable_arreglo
                } else {
                    campo.desplegable = []
                }
                campos.push(campo)


            }

            console.log("campos", campos);
            json.data.formularios.push({
                id_form: form.id,
                nombre_form: form.raw_name,
                ticket_fields: campos
            })
        }

    }
}

constructorActivosv3()