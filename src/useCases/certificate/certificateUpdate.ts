// import {ICertificateRepository} from "../../repositories/ICertificateRepository";
//
// interface UpdateCertificateInput {
//     id: string
//     certificate_type_id: string,
//     code: string,
//     activated: boolean,
//     phone?: string,
//     email?: string,
//     user_id?: string,
//     delivery_at: Date,
//     accepted: boolean
// }
//
// export class UpdateCertificate {
//     private repository: ICertificateRepository;
//
//     constructor(repository: ICertificateRepository) {
//         this.repository = repository;
//     }
//
//     async execute(input: UpdateCertificateInput): Promise<Certificate> {
//         const {
//             id,
//             type,
//             user_id,
//             entity_id,
//             entity_type
//         } = input;
//
//
//         const existingData = await this.repository.findById(id)
//         if(!existingData) {
//             throw new Error(JSON.stringify({
//                 status: 404,
//                 message: 'Лайк не найден'
//             }))
//         }
//
//         const typeOfError = type ? CertificateType.create(type) : undefined
//
//         if(typeOfError instanceof Error)
//             throw new Error(JSON.stringify({
//                 status: 400,
//                 message: [
//                     {
//                         type: 'type',
//                         message: 'Неправильный формат процентов'
//                     }
//                 ]
//             }))
//
//         const data = new Certificate({
//             entityType: entity_type || existingData.getEntityType(),
//             entityId: entity_id || existingData.getEntityId(),
//             type: typeOfError || existingData.getType(),
//             userId: user_id || existingData.getUserId(),
//             createdAt: existingData.getCreatedAt(),
//         }, existingData.getId());
//         await this.repository.save(data);
//         return data;
//
//     }
// }