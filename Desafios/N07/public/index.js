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
    
        document.getElementById('table-products').innerHTML = '';
        listado.forEach(product => {
            document.getElementById('table-products').innerHTML += `
                <tr class="text-center align-middle">
                    <td class="align-middle">${product.id}</td>
                    <td class="align-middle">${product.title}</td>
                    <td class="align-middle">${product.price}</td>
                    <td class="align-middle">
                        <img class="rounded mx-auto d-block imagenProducto" src="${product.ruta}" alt="${product.title}">
                    </td>
                </tr>`;
        })
    
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

/* FORMULARIO DE FILTRO DE PRODUCTO   -------------------------------------------------------------------------- */

/* function filterProduct(){
    let filterId = document.getElementById('filterId').value; 
    socket.emit('filterId', filterId);
    document.getElementById('filterId').value = ''
        
    return false;
}

socket.on('filProduct', filProduct => {
    console.log(filProduct);
    console.log("volvi");
    document.getElementById('producto_filtrado').innerHTML = '';
    filProduct.forEach(product => {
        document.getElementById('producto_filtrado').innerHTML += `
            <tr class="text-center align-middle">
                <td class="align-middle">${product.id}</td>
                <td class="align-middle">${product.title}</td>
                <td class="align-middle">${product.price}</td>
                <td class="align-middle">
                    <img class="rounded mx-auto d-block imagenProducto" src="${product.ruta}" alt="${product.title}">
                </td>
            </tr>`;
    })

}); */