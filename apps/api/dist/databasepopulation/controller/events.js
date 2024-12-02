"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopulateEventsByOrganizerID = PopulateEventsByOrganizerID;
exports.GetAllEvents = GetAllEvents;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function PopulateEventsByOrganizerID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { image, title, eventDate, overview, genre, venue, eventDesc, maxNormals, maxVIPs, normalPrice, VIPPrice, artists, discountType, discountDesc, dateCreated, } = req.body;
            let newEvent;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                console.log("prisma transaction started: creating event data");
                newEvent = yield prisma.events.create({
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
                const a = artists;
                for (let k in a) {
                    yield prisma.event_Artists.create({
                        data: {
                            eventID: newEvent.id,
                            name: a[k],
                        },
                    });
                }
                ;
                console.log("or here?");
                if (discountType === "Limited") {
                    const d = discountDesc;
                    for (let k in d) {
                        yield prisma.events_Discount_Limited.create({
                            data: {
                                eventID: newEvent.id,
                                breakpoint: d[k].breakpoint,
                                discount: d[k].discount
                            },
                        });
                    }
                    ;
                }
                ;
                console.log("maybe here?");
                if (discountType === "Deadline") {
                    const d = discountDesc;
                    yield prisma.events_Discount_Deadline.create({
                        data: {
                            eventID: newEvent.id,
                            deadline: d.deadline,
                            discount: d.discount,
                        },
                    });
                }
                ;
                console.log("how about here?");
                if (discountType === "LimitedDeadline") {
                    const d = discountDesc;
                    for (let k in d.limited) {
                        yield prisma.events_Discount_Limited.create({
                            data: {
                                eventID: newEvent.id,
                                breakpoint: d.limited[k].breakpoint,
                                discount: d.limited[k].discount
                            },
                        });
                    }
                    ;
                    yield prisma.events_Discount_Deadline.create({
                        data: {
                            eventID: newEvent.id,
                            deadline: d.deadline.deadline,
                            discount: d.deadline.discount,
                        },
                    });
                }
                ;
                console.log("prisma transaction concluded: event data created");
            }));
            console.log("Event registration added to database");
            res.status(200).send({
                message: "Event creation successful!",
                data: newEvent,
            });
        }
        catch (err) {
            console.log(err);
            next(err);
        }
        ;
    });
}
;
function GetAllEvents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prisma.events.findMany({});
            res.status(200).send({
                message: "Events fetched",
                data: data,
            });
        }
        catch (err) {
            next(err);
        }
        ;
    });
}
;
