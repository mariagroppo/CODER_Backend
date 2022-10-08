import { normalize, schema } from "normalizr";

export default async function normalizar (inMessages) {
    
    try {
        /* console.log(inMessages) */
        const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'id' });
        const schemaMensaje = new schema.Entity('post', { author: schemaAuthor}, { idAttribute: '_id' })
        const schemaMensajes = new schema.Entity('posts', { inMessages: [schemaMensaje] }, { idAttribute: 'id' })
        const normalizarMensajes = (mensajes) => normalize(mensajes, schemaMensajes)

        const normalizedChat = normalizarMensajes({ id: 'mensajes', inMessages })
        /* console.log("----------------------------------------------------------------------")
        console.log(normalizedChat) */
        /* console.log(normalizedChat.entities.author)
        console.log("----------------------------------------------------------------------")
        console.log(normalizedChat.entities.post);
        console.log("----------------------------------------------------------------------")
        console.log(normalizedChat.entities.posts) */
        console.log("OBJETO ORIGINAL ---------------------------------------------")
        console.log(JSON.stringify(inMessages).length)
        console.log("OBJETO NORMALIZADO ----------------------------------------------------")
        console.log(JSON.stringify(normalizedChat).length)

        
        return normalizedChat
        
    } catch (error) {
        console.log("Error al normalizar. " + error)
    }
}