import prisma from "../lib/prisma";

export const createOrganizer = async (userId: number, name: string) => {
    const existing = await prisma.organizer.findUnique({
        where: { userId },
    });

    if (existing) {
        throw new Error("Already an organizer");
    }

    const organizer = await prisma.$transaction(async (tx) => {
        // 1. buat organizer
        const newOrganizer = await tx.organizer.create({
            data: {
                userId,
                name,
            },
        });

        // 2. update role 🔥
        await tx.user.update({
            where: { id: userId },
            data: {
                role: "ORGANIZER",
            },
        });

        return newOrganizer;
    });

    return organizer;
};