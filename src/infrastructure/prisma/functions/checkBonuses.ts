import {BonusesType, PrismaClient} from "@prisma/client";
import {subMonths, isSameDay} from 'date-fns';
import {Bonus} from "../../../domain/bonus/bonus";
import {BonusType} from "../../../domain/bonus/valueObjects/bonusType";

const prisma = new PrismaClient();

export async function createMinusBonuses() {
    const sixMonthsAgo = subMonths(new Date(), 6);

    const plusBonuses = await prisma.bonuses.findMany({
        where: {
            type: 'plus',
        }
    });

    for (const bonus of plusBonuses) {
        if (isSameDay(bonus.created_at, sixMonthsAgo)) {
            const newBonus = new Bonus({
                created_at: new Date(),
                type: BonusType.create(BonusType.getAvailables().minus) as BonusType,
                description: `Автосписание`,
                count: bonus.count,
                user_id: bonus.user_id
            })


            await prisma.bonuses.create({
                data: {
                    id: newBonus.getId(),
                    created_at: newBonus.getCreatedAt(),
                    type: newBonus.getType().getValue() as BonusesType,
                    description: newBonus.getDescription(),
                    count: newBonus.getCount(),
                    user_id: newBonus.getUserid()
                }
            });
        }
    }

    prisma.$disconnect()
}
