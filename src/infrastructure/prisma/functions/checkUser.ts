import {PrismaClient} from "@prisma/client";
import {subDays} from 'date-fns';

const prisma = new PrismaClient();

export async function deleteInactiveUsers() {
    const oneDayAgo = subDays(new Date(), 1);

    const inactiveUsers = await prisma.users.findMany({
        where: {
            //@ts-ignore
            activated_at: false,
            created_at: {
                lte: oneDayAgo
            },
            last_online_at: {
                lte: oneDayAgo
            }

        }
    });

    for (const user of inactiveUsers) {
        await prisma.users.delete({
            where: { id: user.id }
        });
    }
    prisma.$disconnect()
}
