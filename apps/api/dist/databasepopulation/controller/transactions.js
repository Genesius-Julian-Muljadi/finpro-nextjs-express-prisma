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
exports.PopulateTransactionsByUserID = PopulateTransactionsByUserID;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function PopulateTransactionsByUserID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { eventID, ticketCount, VIPs, normalPrice, VIPPrice, discount, couponCode, pointDiscount, total, dateCreated, } = req.body;
            let newTransaction;
            yield prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                // console.log("prisma transaction started: creating transaction data");
                newTransaction = yield prisma.transactions.create({
                    data: {
                        userID: parseInt(id),
                        eventID: eventID,
                        ticketCount: ticketCount,
                        VIPs: VIPs,
                        normalPrice: normalPrice,
                        VIPPrice: VIPPrice,
                        discount: discount,
                        discountDesc: discount ? (couponCode + ":" + id) : null,
                        pointDiscount: pointDiscount,
                        total: total,
                        dateCreated: dateCreated,
                    },
                });
                const event = yield prisma.events.findUnique({
                    where: {
                        id: eventID,
                    },
                });
                yield prisma.events.update({
                    where: {
                        id: eventID,
                    },
                    data: {
                        normalsSold: event.normalsSold + (ticketCount - VIPs),
                        VIPsSold: event.VIPsSold + VIPs,
                        revenue: event.revenue + (newTransaction.total / 1000),
                    },
                });
                yield prisma.history.create({
                    data: {
                        userID: parseInt(id),
                        transactionID: newTransaction.id,
                    },
                });
                if (couponCode) {
                    const coupons = yield prisma.coupons.findMany({
                        where: {
                            userID: parseInt(id),
                            code: couponCode,
                        },
                    });
                    if (coupons.length > 1) {
                        throw new Error("Duplicate code + userID detected! " + couponCode + " " + id);
                    }
                    ;
                    const coupon = coupons[0];
                    if (!coupon.active) {
                        throw new Error("Coupon already used!");
                    }
                    ;
                    yield prisma.coupons.update({
                        where: {
                            id: coupon.id,
                        },
                        data: {
                            active: false,
                        },
                    });
                }
                ;
                if (pointDiscount > 0) {
                    let points = pointDiscount;
                    const pointDataRaw = yield prisma.point_Balance.findMany({
                        where: {
                            user1ID: parseInt(id),
                        },
                    });
                    console.log(pointDataRaw);
                    pointDataRaw.sort((a, b) => {
                        return new Date(a.expiryDate).valueOf() - new Date(b.expiryDate).valueOf();
                    });
                    let iter = 0;
                    while (points > 0) {
                        const pb = pointDataRaw[iter];
                        console.log(pointDataRaw[0]);
                        console.log(pb);
                        const bal = yield prisma.point_Balance.findUnique({
                            where: {
                                id: pb.id,
                            },
                        });
                        yield prisma.point_Balance.update({
                            where: {
                                id: pb.id,
                            },
                            data: {
                                nominal: bal.nominal > points ? bal.nominal - points : 0,
                            },
                        });
                        points -= bal.nominal;
                        iter++;
                    }
                    ;
                }
                ;
                if (Math.random() * 5 < 1) {
                    const rating = Math.ceil(Math.random() * 5);
                    yield prisma.event_Ratings.create({
                        data: {
                            eventID: eventID,
                            rating: rating,
                        },
                    });
                }
                ;
                // console.log("prisma transaction concluded: transaction data created");
            }));
            // console.log("Transaction registration added to database");
            res.status(200).send({
                message: "Transaction creation successful!",
                data: newTransaction,
            });
        }
        catch (err) {
            console.log(err);
            console.log(req.body);
            next(err);
        }
        ;
    });
}
;
