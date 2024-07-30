// import { orders as PersistenceData } from "@prisma/client";
// import { Order } from "../domain/order/order";
// import { Sex } from "../domain/products/valueObjects/sex";
// import { Items, iItems } from "../domain/order/valueObjects/items";
// import {Phone} from "../domain/order/valueObjects/phone";
// import {Email} from "../domain/order/valueObjects/email";
//
// export class OrderMap {
//     public static toDomain(raw: PersistenceData): Order | null {
//         const attributes = Items.create(raw.items as iItems);
//         const phoneOrError = Phone.create(raw.phone)
//         const emailOrError = Email.create(raw.email)
//         if(phoneOrError instanceof Error || emailOrError instanceof Error) return null
//
//         const result = new Order({
//
//         }, raw.id)
//
//         if(!result) return null
//         return result
//     }
//
//     public static toPersistence(data: Order): {
//         id: string
//         title: string
//         article: string
//         price: number
//         path_images: string[]
//         sex: string
//         description: string
//         details: string
//         delivery: string
//         attributes: JSON;
//         available: number
//         categoryId: string
//         materialId: string
//         discount?: any
//         createdAt: Date
//         updatedAt: Date
//     } {
//         return {
//             id: data.getId(),
//             title: data.getTitle(),
//             article: data.getArticle(),
//             price: data.getPrice(),
//             path_images: data.getPathImages(),
//             sex: data.getSex().getValue(),
//             description: data.getDescription(),
//             details: data.getDetails(),
//             delivery: data.getDelivery(),
//             attributes: data.getAttributes().getAttributes() as JSON,
//             available: data.getAvailable(),
//             categoryId: data.getCategory(),
//             materialId: data.getMaterial(),
//             createdAt: data.getCreatedAt(),
//             updatedAt: data.getUpdatedAt(),
//         }
//     }
// }