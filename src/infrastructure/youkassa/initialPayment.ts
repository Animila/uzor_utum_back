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

        console.log(auth)
        console.log(headers)

        const now = new Date();
        const minutesToAdd = 1;
        now.setMinutes(now.getMinutes() + minutesToAdd);
        const futureTimeUTC = now.toUTCString();


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
                return_url: (process.env.WEBSITE || 'https://uzorutum.ru/thanks') + '?id=' + id
            },
            save_method_method: false
        }

        const response = await axios.post(url, params, { headers });
        const res = response.data;
        if (res.status === "pending") {
            console.log("ожидание");
        }
        console.log(res)
        console.log({
            success: true,
            data: {
                payment_id: res.id,
                payment_url: res.confirmation.confirmation_url
            }
        })

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
