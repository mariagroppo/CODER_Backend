/* Desde el cliente */

/* CHAT ------------------------------------------------------------------------------------------- */
const socket = io.connect();
const inputText = document.getElementById('inputText');
const buttonSend = document.getElementById('buttonSend');

buttonSend.addEventListener('click', () => {
    let registroFecha = new Date().toLocaleDateString('en-US');
    let registroHora = new Date().toLocaleTimeString('en-US');
    let registro = registroFecha + " " + registroHora;
    socket.emit('saveMessage', {
        userMail: clientMail.value, mensaje: inputText.value, fecha: registro
    });
    inputText.value="";
    clientMail.value="";
})

socket.on('currentChat', messages => {
    realTimeText.innerText="";
    messages.forEach(message => {
        realTimeText.innerHTML += 
        `<div class="container-fluid">
            <div class="row">
                <div class="col-3">
                    <span class="fw-bold text-primary">${message.userMail}</span> <span class="text-brown">[${message.fecha}]</span>
                </div>
                <div class="col">
                    <span class="fst-italic text-success">${message.mensaje}</span>
                </div>
            </div>
        </div>`
    });
})


/* FORMULARIO DE PRODUCTO NUEVO  -------------------------------------------------------------------------- */

function addProduct(){
    console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
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
    
        console.log("aca");
        document.getElementById('table-products').innerHTML = '';
        listado.forEach(product => {
            document.getElementById('table-products').innerHTML += `
                <tr class="text-center align-middle">
                    <td class="align-middle">${product.id}</td>
                    <td class="align-middle">${product.title}</td>
                    <td class="align-middle">${product.price}</td>
                    <td class="align-middle">
                        <img class="rounded mx-auto d-block img-thumbnail" src="${product.ruta}" alt="${product.title}">
                    </td>
                </tr>`;
        })
    
    /* redirect = '/api/productos'; */
});

/* FORMULARIO DE ELIMINACION DE PRODUCTO POR ID ----------------------------------------------- */
/* const deleteId = document.getElementById('idDelete');
const formDelete = document.getElementById('formDeleteProduct');

formDelete.addEventListener('submit', (e) => {
    e.preventDefault;
    socket.emit('deleteId', deleteId);
    e.target.reset();
    location.href = '/';

}) */