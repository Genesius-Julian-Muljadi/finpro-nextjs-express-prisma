"use client";

import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const openHistory = (type: string) => {
    const button = document.getElementById(type + "historybuttondiv") as HTMLDivElement;
    const table = document.getElementById(type + "historytablediv") as HTMLDivElement;

    button.style.display = "none";
    table.style.display = "grid";
};
const closeHistory = (type: string) => {
    const button = document.getElementById(type + "historybuttondiv") as HTMLDivElement;
    const table = document.getElementById(type + "historytablediv") as HTMLDivElement;

    button.style.display = "grid";
    table.style.display = "none";
};

export function PointHistoryOpen() {
    return (
        <button className="rounded-lg"
        onClick={() => openHistory("point")}>
            <FontAwesomeIcon icon={faAngleDown} />
        </button>
    );
};

export function PointHistoryClose() {
    return (
        <button className="rounded-lg"
        onClick={() => closeHistory("point")}>
            <FontAwesomeIcon icon={faAngleUp} />
        </button>
    );
};

export function CouponHistoryOpen() {
    return (
        <button className="rounded-lg"
        onClick={() => openHistory("coupon")}>
            <FontAwesomeIcon icon={faAngleDown} />
        </button>
    );
};

export function CouponHistoryClose() {
    return (
        <button className="rounded-lg"
        onClick={() => closeHistory("coupon")}>
            <FontAwesomeIcon icon={faAngleUp} />
        </button>
    );
};