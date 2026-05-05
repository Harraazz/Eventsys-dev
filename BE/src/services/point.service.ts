import prisma from "../lib/prisma";

export const getPoint = async (userId: number) => {
    return await prisma.point.findMany({
        where: {
            userId: userId,
        },
    });
}