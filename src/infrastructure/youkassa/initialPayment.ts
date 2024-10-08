import {randomUUID} from "node:crypto";
import axios from "axios";

export async function initialPayment(
    entity_type: string,
    entity_id: string,
    msg: string,
    id: string,
    price: string
): Promise<{
    success: boolean;
    message?: string;
    data?: {
        payment_id: string,
        payment_url: string
    };
}> {
    try {
        const url = "https://api.yookassa.ru/v3/payments";

        let auth = "Basic " + btoa(process.env.YOUKASSA_ID + ':' + process.env.YOUKASSA_SECRET)
        let headers = {
            "Authorization": auth,
            "Idempotence-Key": randomUUID().toString(),
            "Content-Type": "application/json"
        };

        const now = new Date();
        const minutesToAdd = 1;
        now.setMinutes(now.getMinutes() + minutesToAdd);
        const futureTimeUTC = now.toUTCString();


        const idl = id.split('-');



        let params = {
            amount: {
                value: price,
                currency: "RUB",
            },
            description: msg,
            expires_at: futureTimeUTC,
            metadata: {
                entity_type: entity_type,
                entity_id: entity_id
            },
            capture: false,
            confirmation: {
                type: "redirect",
                return_url: (process.env.THANKS || 'https://uzorutum.ru/thanks') + '?id=' + idl[idl.length - 1]
            },
            save_method_method: false
        }
        console.log(params)
        console.log(headers)

        const response = await axios.post(url, params, { headers });
        const res = response.data;

        console.log(res)

        return {
            success: true,
            data: {
                payment_id: res.id,
                payment_url: res.confirmation.confirmation_url
            }
        }

    } catch (e: any) {
        console.log('EEEEERRRRRROR: ',e)
        return {
            success: false,
            message: e.message,
        }
    }
}

export async function getDataPayment(payment_id: string): Promise<{success: boolean, data?: any, message?: string}> {
    try {
        const url = `https://api.yookassa.ru/v3/payments/${payment_id}`;

        let auth = "Basic " + btoa(process.env.YOUKASSA_ID + ':' + process.env.YOUKASSA_SECRET)
        let headers = {
            "Authorization": auth,
            "Idempotence-Key": randomUUID().toString(),
            "Content-Type": "application/json"
        };

        const response = await axios.get(url, { headers });
        const res = response.data;

        console.log(res)

        return {
            success: true,
            data: res
        }

    } catch (e: any) {
        console.log('EEEEERRRRRROR: ',e)
        return {
            success: false,
            message: e.message,
        }
    }
}
