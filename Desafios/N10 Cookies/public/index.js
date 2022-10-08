/* Desde el cliente */
import { desnormalizar } from "../database/mongoDB/denormalize";

/* CHAT ------------------------------------------------------------------------------------------- */
const socket = io.connect();
const inputText = document.getElementById('inputText');
const buttonSend = document.getElementById('buttonSend');

const clientMail = document.getElementById('clientMail');
const clientName = document.getElementById('clientName');
const clientSurname = document.getElementById('clientSurname');
const clientAge = document.getElementById('clientAge');
const clientAlias = document.getElementById('clientAlias');
/* const clientAvatar = faker.image.avatar() */

buttonSend.addEventListener('click', () => {
    let registroFecha = new Date().toLocaleDateString('en-US');
    let registroHora = new Date().toLocaleTimeString('en-US');
    let registro = registroFecha + " " + registroHora;
    socket.emit('saveMessage', {
        author: {id: clientMail.value, clientName: clientName.value, clientSurname: clientSurname.value, clientAge: clientAge.value, clientAlias: clientAlias.value},
        text: inputText.value,
        dateText: registro
    });
    /* inputText.value="";
    clientMail.value="";
    clientName.value="";
    clientSurname.value="";
    clientAge.value="";
    clientAlias.value=""; */
    
})

socket.on('currentChat', mess2 => {
    
    console.log("NORMALIZADO")
    let mensajesDesnormalizados = desnormalizar(mess2);
    console.log("DESNORMALIZADO: " + mensajesDesnormalizados);
    realTimeText.innerText="";
    mensajesDesnormalizados.forEach(message => {
        realTimeText.innerHTML += 
        `<div class="container-fluid">
            <div class="row">
                <div class="col-3">
                    <span class="fw-bold text-primary">${message.author.clientAlias}</span> <span class="text-brown">[${message.dateText}]</span>
                </div>
                <div class="col">
                    <span class="fst-italic text-success">${message.text}</span>
                </div>
            </div>
        </div>`
    });
})


/* FORMULARIO DE PRODUCTO NUEVO  -------------------------------------------------------------------------- */

function addProduct(){
    let product = {
        title: document.getElementById('title').value, 
        price: document.getElementById('price').value,
        ruta: document.getElementById('ruta').value
    }
    socket.emit('newProduct', product)
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('ruta').value = ''
    
    return false;
}

socket.on('listado', listado => {
    redirect = '/api/productos';
});

/* FORMULARIO DE ELIMINAR PRODUCTO   -------------------------------------------------------------------------- */

function deleteProduct(){
    let deleteId = document.getElementById('deleteId').value; 
    socket.emit('deleteId', deleteId);
    document.getElementById('deleteId').value = ''
        
    return false;
}

/* FORMULARIO DE ACTUALIZACIÒN DE PRODUCTO   -------------------------------------------------------------------------- */

function updateProduct(){
    let productUpdated = {
        id: document.getElementById('updateId').value,
        title: document.getElementById('newTitle').value,
        ruta: document.getElementById('newRuta').value,
        price: document.getElementById('newPrice').value
    }
    socket.emit('productUpdated', productUpdated);
    document.getElementById('updateId').value = '';
    document.getElementById('newTitle').value = '';
    document.getElementById('newRuta').value = '';
    document.getElementById('newPrice').value = '';
        
    return false;
}
