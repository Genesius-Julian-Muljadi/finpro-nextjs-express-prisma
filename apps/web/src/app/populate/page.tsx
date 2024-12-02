"use client";

import { AddEvents } from "@/databasepopulation/populators/addevents";
import { AddOrganizers } from "@/databasepopulation/populators/addorganizers";
import { AddTransactions } from "@/databasepopulation/populators/addtransactions";
import { AddUsers } from "@/databasepopulation/populators/addusers";

export default function PopulatePage() {
    return (
        <div className="flex flex-col gap-10">
            <div className="w-screen mx-6 grid grid-cols-3 gap-6">
                <button onClick={() => AddUsers(500)} className=" border border-black px-2">
                    Add users
                </button>
                <button onClick={() => AddOrganizers(30)} className=" border border-black px-2">
                    Add organizers
                </button>
                <button onClick={() => AddEvents(70)} className=" border border-black px-2">
                    Add events
                </button>
                <button onClick={() => AddTransactions(700)} className=" border border-black px-2">
                    Add transactions
                </button>
            </div>
        </div>
    );
};