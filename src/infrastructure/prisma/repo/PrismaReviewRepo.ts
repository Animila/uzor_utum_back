import {PrismaClient} from "@prisma/client";
import {IReviewRepository} from "../../../repositories/IReviewRepository";
import {Review} from "../../../domain/review/review";
import {ReviewMap} from "../../../mappers/ReviewMap";

export class PrismaReviewRepo implements IReviewRepository {
    private prisma = new PrismaClient();

    async findAll(user_id?: string, product_id?: string, old?: boolean, popular?: boolean): Promise<Review[]> {
        try {
            const filters: any = {};

            if (user_id) {
                filters.order = {
                    user_id: user_id
                };
            }

            if (product_id) {
                filters.product_id = product_id;
            }

            const orderBy: any[] = [];

            if (old !== undefined) {
                orderBy.push({ created_at: old ? 'asc' : 'desc' });
            }

            if (popular !== undefined) {
                orderBy.push({ rating: popular ? 'desc' : 'asc' });
            }

            const reviews = await this.prisma.reviews.findMany({
                where: filters,
                orderBy: orderBy.length ? orderBy : undefined,
            });

            return reviews.map(review => ReviewMap.toDomain(review)).filter(review => review != null);
        } finally {
            await this.prisma.$disconnect();
        }
    }
    async findById(id: string): Promise<Review | null> {
        try {
            const review = await this.prisma.reviews.findUnique({ where: { id } });
            if (!review) return null;
            return ReviewMap.toDomain(review);
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async save(review: Review): Promise<Review | null> {
        try {
            const data = ReviewMap.toPersistence(review);
            const newReview = await this.prisma.reviews.upsert({
                where: { id: data.id },
                create: data,
                update: data
            });
            if (!newReview) return null;
            return ReviewMap.toDomain(newReview);
        } catch (error) {
            console.error(error);
            throw new Error(JSON.stringify({
                status: 500,
                message: 'Ошибка с базой данных'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.reviews.delete({ where: { id } });
            return true;
        } catch (error: any) {
            console.error(error);
            throw new Error(JSON.stringify({
                status: 404,
                message: 'Такой отзыв не найден'
            }));
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
