import twilio from "twilio";

const accountSid = "AC2e36b1b82d724be0d3abdd1733ff53fd";
const authToken = "383cc7851e0802b974ec86f4b9b5f096";
/* const PHONE_NUMBER_WHATSAPP = `whatsapp:+14155238886`; */

const client = twilio(accountSid, authToken);

export const sendWhatsApp = async (options) => {
    try {
        const message = await client.messages.create({
            body: options.body,
            from: options.from,
            to: options.to
            //`whatsapp:+59894057052`
        })
        
        /* console.log(message);
 */
    } catch (e) {
        console.error(e.message);
    }

}

