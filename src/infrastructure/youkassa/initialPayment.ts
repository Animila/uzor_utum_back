import {randomUUID} from "node:crypto";
import axios from "axios";

export async function initialPayment(
    msg: string,
    urlRedirect: string,
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

        let params = {
            amount: {
                value: price,
                currency: "RUB",
            },
            description: msg,
            capture: true,
            confirmation: {
                type: "redirect",
                return_url: urlRedirect
            },
            // receipt: {
            //     customer: {
            //         full_name: dataUser.full_name,
            //         email: dataUser.email,
            //         phone: dataUser.phone,
            //     }
            // }
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