import {IOrderRepository} from "../../repositories/IOrderRepository";
import {ICertificateRepository} from "../../repositories/ICertificateRepository";


export class GetOrderStats {
    private repository: IOrderRepository;
    private certificateRepo: ICertificateRepository;

    constructor(repository: IOrderRepository, certificateRepo: ICertificateRepository) {
        this.repository = repository;
        this.certificateRepo = certificateRepo
    }

    async execute(): Promise<{count: number, countProduct: number, totalPrice: number, salesData: any}> {

        const result = await this.repository.getStats()
        const resultCert = await this.certificateRepo.getStats()

        console.log(resultCert)

        let countProduct: number = 0
        let price: number = 0

        result.items.map((item: any) => {
            item.items.map((item: any) => {
                countProduct += item.count
            })
            console.log(item)
            price += item.total_amount
        })

        price += resultCert.priceTotal


        return {
            count: result.count,
            countProduct: countProduct,
            totalPrice: price,
            salesData: result.sales
        }
    }
}