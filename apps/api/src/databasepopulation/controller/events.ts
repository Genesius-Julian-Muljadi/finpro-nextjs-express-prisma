import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function PopulateEventsByOrganizerID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            eventDate,
            overview,
            genre,
            venue,
            eventDesc,
            maxNormals,
            maxVIPs,
            normalPrice,
            VIPPrice,
            artists,
            discountType,
            discountDesc,
            dateCreated,
        } = req.body;
        
        let newEvent;
        
        await prisma.$transaction(async (prisma) => {
            console.log("prisma transaction started: creating event data");
            newEvent = await prisma.events.create({
                data: {
                    organizerID: parseInt(id),
                    image: image,
                    title: title,
                    eventDate: new Date(eventDate),
                    overview: overview,
                    genre: genre,
                    venue: venue,
                    eventDesc: eventDesc,
                    maxNormals: maxNormals,
                    maxVIPs: maxVIPs,
                    normalPrice: normalPrice,
                    VIPPrice: VIPPrice,
                    discountType: discountType,
                    dateCreated: dateCreated,
                },
            });

            console.log("got here?");
            const a = artists as Array<string>;
            for (let k in a) {
                await prisma.event_Artists.create({
                    data: {
                        eventID: newEvent.id,
                        name: a[k],
                    },
                });
            };
            
            console.log("or here?");
            if (discountType === "Limited") {
                const d = discountDesc as Array<{breakpoint: number, discount: number}>;
                for (let k in d) {
                    await prisma.events_Discount_Limited.create({
                        data: {
                            eventID: newEvent.id,
                            breakpoint: d[k].breakpoint,
                            discount: d[k].discount
                        },
                    });
                };
            };

            console.log("maybe here?");
            if (discountType === "Deadline") {
                const d = discountDesc as {deadline: Date, discount: number};
                await prisma.events_Discount_Deadline.create({
                    data: {
                        eventID: newEvent.id,
                        deadline: d.deadline,
                        discount: d.discount,
                    },
                });
            };

            console.log("how about here?");
            if (discountType === "LimitedDeadline") {
                const d = discountDesc as {
                    limited: Array<{breakpoint: number, discount: number}>;
                    deadline: {deadline: Date, discount: number};
                };
                for (let k in d.limited) {
                    await prisma.events_Discount_Limited.create({
                        data: {
                            eventID: newEvent.id,
                            breakpoint: d.limited[k].breakpoint,
                            discount: d.limited[k].discount
                        },
                    });
                };
                await prisma.events_Discount_Deadline.create({
                    data: {
                        eventID: newEvent.id,
                        deadline: d.deadline.deadline,
                        discount: d.deadline.discount,
                    },
                });
            };

            console.log("prisma transaction concluded: event data created");
        });
    
        console.log("Event registration added to database");
        res.status(200).send({
            message: "Event creation successful!",
            data: newEvent,
        });

    } catch(err) {
        console.log(err);
        next(err);
    };
};

export async function GetAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await prisma.events.findMany({
        });
        res.status(200).send({
            message: "Events fetched",
            data: data,
        });
    } catch (err) {
        next(err);
    };
};