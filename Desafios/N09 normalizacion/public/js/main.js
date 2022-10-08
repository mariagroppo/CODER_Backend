const socket = io.connect();

//------------------------------------------------------------------------------------

const formNewProduct = document.getElementById('formNewProduct')
formNewProduct.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formNewProduct[0].value,
        price: formNewProduct[1].value,
        thumbnail: formNewProduct[2].value
    }
    console.log(producto);
    socket.emit('update', producto);
    formNewProduct.reset()
})

socket.on('productos', listado => {
    if (listado.length > 0) {
        document.getElementById('table-products').innerHTML = '';
            listado.forEach(product => {
                document.getElementById('table-products').innerHTML += `
                    <tr class="text-center align-middle">
                        <td class="align-middle">${product.id}</td>
                        <td class="align-middle">${product.title}</td>
                        <td class="align-middle">
                            <img class="rounded mx-auto d-block imagenProducto" src="${product.thumbnail}" alt="${product.title}">
                        </td>
                        <td class="align-middle">${product.price}</td>
                    </tr>`;
            })
   /*  redirect = '/api/productos'; */
    
    }
});


//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
/* const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' });
const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: '_id' })
const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' }) */
/* export const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
export const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })
export const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' }) */
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('clientMail')
const inputMensaje = document.getElementById('inputText')
const btnEnviar = document.getElementById('btnEnviar')

const formChat = document.getElementById('formChat');

formChat.addEventListener('submit', e => {
    e.preventDefault()
    let registroFecha = new Date().toLocaleDateString('en-US');
    let registroHora = new Date().toLocaleTimeString('en-US');
    let dateText = registroFecha + " " + registroHora;

    const mensaje = {
        author: {
            clientMail: document.getElementById('clientMail').value,
            clientName: document.getElementById('clientName').value,
            clientSurname: document.getElementById('clientSurname').value,
            clientAge: document.getElementById('clientAge').value,
            clientAlias: document.getElementById('clientAlias').value,
            clientAvatar: document.getElementById('clientAvatar').value
        },
        text: inputMensaje.value,
        dateText: dateText
    }

    socket.emit('nuevoMensaje', mensaje);
    formChat.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajesN => {
    console.log("NORMALIZADOS --------------------------------------------");
    console.log(mensajesN);
    /* let mensajesNsize = JSON.stringify(mensajesN).length
    console.log(mensajesN, mensajesNsize); */
    
    let mensajesD = desnormalizarMensajes(mensajesN);
    console.log("DESNORMALIZADOS --------------------------------------------");
    console.log(mensajesD);
    /* let mensajesDsize = JSON.stringify(mensajesD).length
    console.log(mensajesD, mensajesDsize);

    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de compresión ${porcentajeC}%`) */
    /* document.getElementById('compresion-info').innerText = porcentajeC */

    /* console.log(mensajesD.mensajes); */
    
    mensajesD.mensajes.forEach(message => {
        message = `
        <li>
            <b style="color:blue;">${message.author.clientMail}</b>
            [<span style="color:brown;">${message.dateText}</span>] :
            <i style="color:green;">${message.text}</i>
            <img width="50" src="${message.author.avatar}" alt=" ">
        </li>
        `;
        /* messagesContainer.innerHTML += message; */
        document.getElementById('realTimeText').innerHTML+= message;
    })
    
})


function desnormalizarMensajes(mensajesN) {
    const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'clientMail' });
    const schemaMensaje = new schema.Entity('mensajes', { author: schemaAuthor }, { idAttribute: '_id' })
    
    let mesajesD = denormalize(mensajesN.result, [schemaMensaje], mensajesN.entities)
    return mesajesD
    
}