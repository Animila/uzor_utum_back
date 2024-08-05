import {FastifyInstance} from "fastify";
import {registerAuthRoutes} from "./routing/authRouting";
import {registerUserRoutes} from "./routing/userRouting";
import {registerCategoryRouting} from "./routing/categoryRouting";
import {registerMaterialRouting} from "./routing/materialRouting";
import {registerProductRouting} from "./routing/productRouting";
import {registerDiscountRouting} from "./routing/discountRouting";
import {registerJournalRouting} from "./routing/journalRouting";
import {registerNewsRouting} from "./routing/newsRouting";
import {registerLikeRouting} from "./routing/likeRouting";
import {registerPromoCodeRouting} from "./routing/promocodeRouting";
import {registerBonusRouting} from "./routing/bonusRouting";
import {registerCartRouting} from "./routing/cartRouting";
import {registerOrderRouting} from "./routing/ordersRouting";
import {registerCertificateRouting} from "./routing/certificateRouting";
import {registerCertificateTypeRouting} from "./routing/certificateTypeRouting";
import {registerYookassaRouting} from "./routing/yookassaRouting";
import {registerShopRouting} from "./routing/shopRouting";
import {registerReceiverRouting} from "./routing/receiverRouting";
import {registerSendTypeRouting} from "./routing/sendTypeRouting";
import {registerDecorateRouting} from "./routing/decorateRouting";
import {registerProbRouting} from "./routing/prodRouting";
import {registerSizeRouting} from "./routing/sizeRouting";
import {registerFileRouting} from "./routing/fileRouting";

export default function registerRoutes(fastify: FastifyInstance) {
    registerAuthRoutes(fastify)
    registerUserRoutes(fastify)
    registerLikeRouting(fastify)
    registerFileRouting(fastify)

    registerCategoryRouting(fastify)
    registerMaterialRouting(fastify)
    registerProductRouting(fastify)
    registerSizeRouting(fastify)
    registerDecorateRouting(fastify)
    registerProbRouting(fastify)

    registerCartRouting(fastify)
    registerOrderRouting(fastify)
    registerReceiverRouting(fastify)
    registerSendTypeRouting(fastify)

    registerPromoCodeRouting(fastify)
    registerDiscountRouting(fastify)
    registerBonusRouting(fastify)
    registerCertificateRouting(fastify)
    registerCertificateTypeRouting(fastify)

    registerJournalRouting(fastify)
    registerNewsRouting(fastify)


    registerShopRouting(fastify)

    registerYookassaRouting(fastify)
}

