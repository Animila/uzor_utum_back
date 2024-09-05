import {IOrderRepository} from "../../repositories/IOrderRepository";
import {ICertificateRepository} from "../../repositories/ICertificateRepository";
import {IUserRepository} from "../../repositories/IUserRepository";


export class GetOrderStats {
    private repository: IOrderRepository;
    private certificateRepo: ICertificateRepository;
    private userRepo: IUserRepository;

    constructor(repository: IOrderRepository, certificateRepo: ICertificateRepository, userRepo: IUserRepository) {
        this.repository = repository;
        this.certificateRepo = certificateRepo
        this.userRepo = userRepo
    }

    async execute(): Promise<{count: number, countProduct: number, totalPrice: number, salesData: any, countWeekUser: number}> {

        const result = await this.repository.getStats()
        const resultCert = await this.certificateRepo.getStats()
        const userStat  = await this.userRepo.getStats()

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
            countWeekUser: userStat.count_week,
            totalPrice: price,
            salesData: result.sales
        }
    }
}
