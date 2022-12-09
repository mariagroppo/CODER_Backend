import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/* Creo una cuenta falsa en:
https://ethereal.email/create
 */

const name = process.env.name;
const surname = process.env.surname;
const TEST_MAIL = process.env.TEST_MAIL;
const TEST_PWD = process.env.TEST_PWD;
/* const TEST_MAIL = "alysa.rau55@ethereal.email";
const TEST_PWD = "mrmC4CY8Yd3Q3CyeCQ"; */

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: TEST_PWD
    }
});

export async function mailNewRegister(mailTo, subject, html) {
    try {
        const mailOptions = {
            from: process.env.TEST_MAIL,
            to: mailTo,
            subject: subject,
            html: html
        }
        const info = await transporter.sendMail(mailOptions)
        /* console.log(info) */
        console.log("Correo enviado.")
    } catch (error) {
       console.log(error)
    }
}


export async function mailProducts(productos, userName, userMail) {
    try {
        let detallePedido = ``;
        productos.cartToBeListed.products.forEach(element => {
            detallePedido += `
            <tr class="text-center align-middle">
                <td>
                    ${element.id}
                </td>
                <td>
                    ${element.title}
                </td>
                <td>
                    ${element.description}
                </td>
                <td>
                    ${element.code}
                </td>
                <td>
                    <img class="rounded mx-auto d-block imagenProducto" src=${element.thumbnail}>
                </td>
                <td>
                    $ ${element.price}
                </td>
            </tr>
        `;
        });
            
        let html = `
            <h3>Detalles de compra</h3>
            <p>Nombre: ${userName}</p>
            <table class="table filaDeTabla">
                <thead class="encabezadoDeTabla">
                    <tr class="text-center">
                        <th>ID</th>
                        <th>Nombre del producto</th>
                        <th>Descripción</th>
                        <th>Código</th>
                        <th>Imagen</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                ${detallePedido}
                </tbody>
            </table>                
            `
        let mailTo = "mariagroppo86@gmail.com";
        let subject= 'Nuevo pedido de ' + userName;
        mailNewRegister(mailTo, subject, html);
        subject = 'Detalle de su pedido de compra';
        mailNewRegister(userMail, subject, html);
        
    } catch (error) {
       console.log(error)
    }
    
}
