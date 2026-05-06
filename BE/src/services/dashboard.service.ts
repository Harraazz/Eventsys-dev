import prisma from "../lib/prisma";

export const getDashboardStats = async (userId: number) => {
    // cari organizer
    const organizer = await prisma.organizer.findFirst({
        where: { userId },
    });

    if (!organizer) throw new Error("Not organizer");

    // ambil semua event dia
    const events = await prisma.event.findMany({
        where: { organizerId: organizer.id },
    });

    const eventIds = events.map(e => e.id);

    // ambil transaksi
    const transactions = await prisma.transaction.findMany({
        where: {
            eventId: { in: eventIds },
        },
    });

    // 🔥 HITUNG DATA
    const totalEvents = events.length;
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((acc, t) => acc + t.finalPrice, 0);
    const totalAttendees = transactions.reduce((acc, t) => acc + t.quantity, 0);

    return {
        totalEvents,
        totalTransactions,
        totalRevenue,
        totalAttendees,
        transactions,
    };
};