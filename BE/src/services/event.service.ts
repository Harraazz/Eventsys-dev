import prisma from "../lib/prisma";

export const createEvent = async (
    title: string,
    description: string,
    price: number,
    date: Date,
    totalSeats: number,
    organizerId: number,
    location: string,
    category: string
) => {
    const event = await prisma.event.create({
        data: {
            title,
            description,
            price,
            date: new Date(date),
            totalSeats,
            availableSeats: totalSeats,
            organizerId,
            location,   
            category,   
        },
    });

    return event;
};

export const getListEvent = async (userId: number, role: string) => {

    // ✅ ADMIN & CUSTOMER → lihat semua event
    if (role === "ADMIN" || role === "CUSTOMER") {
        return await prisma.event.findMany({
            include: {
                organizer: true,
            },
        });
    }

    // ✅ ORGANIZER → hanya event miliknya
    if (role === "ORGANIZER") {
        return await prisma.event.findMany({
            where: {
                organizer: {
                    userId,
                },
            },
            include: {
                organizer: true,
            },
        });
    }

    // fallback (optional safety)
    return [];
};
export const updateEvent = async (
    title: string,
    description: string,
    price: number,
    date: Date,
    totalSeats: number,
    eventId: number,
    userId: number
) => {
    // 1. cari organizer dari user
    const organizer = await prisma.organizer.findFirst({
        where: { userId },
    });

    if (!organizer) {
        throw new Error("You are not an organizer");
    }

    // 2. cari event + cek milik dia
    const existingEvent = await prisma.event.findFirst({
        where: {
            id: eventId,
            organizerId: organizer.id, // 🔥 INI YANG PENTING
        },
    });

    if (!existingEvent) {
        throw new Error("Event not found or not yours");
    }

    // 3. validasi seat
    const soldTickets =
        existingEvent.totalSeats - existingEvent.availableSeats;

    if (totalSeats < soldTickets) {
        throw new Error("Total seats cannot be less than sold tickets");
    }

    // 4. update
    const event = await prisma.event.update({
        where: { id: eventId },
        data: {
            title,
            description,
            price,
            date: new Date(date),
            totalSeats,
            availableSeats: totalSeats - soldTickets, // 🔥 biar konsisten
        },
    });

    return event;
};

export const deleteEvent = async (eventId: number) => {

    await prisma.transaction.deleteMany({
        where: { eventId },
    });

    await prisma.review.deleteMany({
        where: { eventId },
    });

    const event = await prisma.event.delete({
        where: { id: eventId },
    });

    return event;
}

export const getOrganizerByUserId = async (userId: number) => {
  return await prisma.organizer.findFirst({
    where: { userId },
  });
};

export const getEventById = async (eventId: number) => {
  return await prisma.event.findUnique({
    where: { id: eventId },
  });
};