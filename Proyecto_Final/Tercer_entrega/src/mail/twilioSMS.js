import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = "AC2e36b1b82d724be0d3abdd1733ff53fd";
const authToken = "383cc7851e0802b974ec86f4b9b5f096";

const client = twilio(accountSid, authToken);

export const sendSMS = async (from, to) => {
    try {
        const message = await client.messages.create({
            body: "Su pedido ha sido recibido.",
            from: from,
            to: to
        })
        console.log(message);
    } catch (error) {
        console.log(error);
    }
}