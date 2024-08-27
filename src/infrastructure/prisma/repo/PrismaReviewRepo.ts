import {PrismaClient} from "@prisma/client";
import {IReviewRepository} from "../../../repositories/IReviewRepository";
import {Review} from "../../../domain/review/review";
import {ReviewMap} from "../../../mappers/ReviewMap";

export class PrismaReviewRepo implements IReviewRepository {
    private prisma = new PrismaClient();

    async findAll(limit: number, offset: number, user_id?: string, product_id?: string, old?: boolean, popular?: boolean): Promise<{data: Review[], count: number}> {
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

            const countData = await this.prisma.reviews.count({where: filters})
            const reviews = await this.prisma.reviews.findMany({
                where: filters,
                orderBy: orderBy.length ? orderBy : undefined,
                take: limit,
                skip: limit * offset
            });

            const result = reviews.map(review => ReviewMap.toDomain(review)).filter(review => review != null);
            return {
                data: result,
                count: countData
            }
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

    async getReviewStats(productId: string) {
        try {
            const allReviewsCount = await this.prisma.reviews.count({
                where: { product_id: productId },
            });

            const ratingsCount = await this.prisma.reviews.groupBy({
                by: ['rating'],
                where: { product_id: productId },
                _count: { rating: true },
            });

            const totalRatingSum = await this.prisma.reviews.aggregate({
                where: { product_id: productId },
                _sum: { rating: true },
            });

            // Организуем количество по рейтингу (1-5)
            const ratings = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            ratingsCount.forEach((group) => {
                //@ts-ignore
                ratings[group.rating] = group._count.rating;
            });

            // Рассчитываем общий рейтинг (округляем до целого числа)
            const averageRating = allReviewsCount > 0
                //@ts-ignore
                ? Math.round(totalRatingSum._sum.rating / allReviewsCount)
                : 0;

            return {
                totalReviews: allReviewsCount,
                ratings,
                averageRating,
            };
        } finally {
            await this.prisma.$disconnect();
        }
    }
}
