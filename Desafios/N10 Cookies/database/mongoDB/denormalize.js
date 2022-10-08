import { denormalize, schema } from "normalizr";

export default function desnormalizar (normalizedMessages) {
    console.log(normalizedMessages);
    const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'id' });
    const schemaMensaje = new schema.Entity('post', { author: schemaAuthor}, { idAttribute: '_id' })
    const schemaMensajes = new schema.Entity('posts', { normalizedMessages: [schemaMensaje] }, { idAttribute: 'id' })
    const denormalizedMessages = denormalize(normalizedMessages.result, schemaMensajes, normalizedMessages.entities);
    console.log(denormalizedMessages)

    return denormalizedMessages
}

