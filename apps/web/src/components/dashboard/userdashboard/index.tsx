"use client";

import { AccessTokenUser } from "@/interfaces/accesstokens";

export default function UserDashboard({ token }: { token: AccessTokenUser }) {
    

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 grid-rows-1">
                    <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                        Point balance: {token.pointBalance} & history
                    </div>
                    <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                        Coupons & history
                    </div>
                    <div className="col-start-3 col-end-4 row-start-1 row-end-2">
                        Referral code: {token.refCode}
                    </div>
                </div>
                <div>
                    Transaction history
                </div>
            </div>
        </div>
    );
};