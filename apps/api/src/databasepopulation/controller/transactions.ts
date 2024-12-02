import { Point_Balance, PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export async function PopulateTransactionsByUserID(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const {
            eventID,
            ticketCount,
            VIPs,
            normalPrice,
            VIPPrice,
            discount,
            couponCode,
            pointDiscount,
            total,
            dateCreated,
        } = req.body;
        
        let newTransaction;
        
        await prisma.$transaction(async (prisma) => {
            // console.log("prisma transaction started: creating transaction data");
            newTransaction = await prisma.transactions.create({
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

            const event = await prisma.events.findUnique({
                where: {
                    id: eventID,
                },
            });
            await prisma.events.update({
                where: {
                    id: eventID,
                },
                data: {
                    normalsSold: event!.normalsSold + (ticketCount - VIPs),
                    VIPsSold: event!.VIPsSold + VIPs,
                    revenue: event!.revenue + (newTransaction.total / 1000),
                },
            });

            await prisma.history.create({
                data: {
                    userID: parseInt(id),
                    transactionID: newTransaction.id,
                },
            });

            if (couponCode) {
                const coupons = await prisma.coupons.findMany({
                    where: {
                        userID: parseInt(id),
                        code: couponCode,
                    },
                });
                if (coupons.length > 1) {
                    throw new Error("Duplicate code + userID detected! " + couponCode + " " + id);
                };
                const coupon = coupons[0];
                if (!coupon.active) {
                    throw new Error("Coupon already used!");
                };
                await prisma.coupons.update({
                    where: {
                        id: coupon.id,
                    },
                    data: {
                        active: false,
                    },
                });
            };

            if (pointDiscount > 0) {
                let points: number = pointDiscount;
                const pointDataRaw = await prisma.point_Balance.findMany({
                    where: {
                        user1ID: parseInt(id),
                    },
                });
                console.log(pointDataRaw);
                pointDataRaw.sort((a, b) => {
                    return new Date(a.expiryDate).valueOf() - new Date(b.expiryDate).valueOf();
                });
                let iter: number = 0;
                while (points > 0) {
                    const pb = pointDataRaw[iter];
                    console.log(pointDataRaw[0]);
                    console.log(pb);
                    const bal = await prisma.point_Balance.findUnique({
                        where: {
                            id: pb.id,
                        },
                    });
                    await prisma.point_Balance.update({
                        where: {
                            id: pb.id,
                        },
                        data: {
                            nominal: bal!.nominal > points ? bal!.nominal - points : 0,
                        },
                    });
                    points -= bal!.nominal;
                    iter++;
                };
            };

            if (Math.random() * 5 < 1) {
                const rating: number = Math.ceil(Math.random() * 5);
                await prisma.event_Ratings.create({
                    data: {
                        eventID: eventID,
                        rating: rating,
                    },
                });
            };

            // console.log("prisma transaction concluded: transaction data created");
        });
    
        // console.log("Transaction registration added to database");
        res.status(200).send({
            message: "Transaction creation successful!",
            data: newTransaction,
        });

    } catch(err) {
        console.log(err);
        console.log(req.body);
        next(err);
    };
};