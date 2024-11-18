// import { BASE_API_URL } from "@/config";
import axios from "axios";
import { apiURL } from "../../../../../constants";

async function SendTokenToVerify(tkn: string) {
    try {
        const API: string = apiURL + "/auth";
        console.log(API);
        // await axios.post(BASE_API_URL + "/verify", {}, {
        const post = await axios.post(API + "/verify", {}, {
            headers: {
                "Authorization": "Bearer " + tkn,
            },
        });

        return post;
    } catch (err) {
        console.log(err);
    };
};


async function Transition(tkn: string) {
    const button = document.getElementById("verifypagebuttondiv") as HTMLDivElement;
    const message = document.getElementById("verifypagemessagediv") as HTMLDivElement;

    button.style.display = 'none';
    const verification = await SendTokenToVerify(tkn);
    console.log(verification?.data.message);
    if (verification) {
        message.style.display = 'block';
    } else {
        button.style.display = 'block';
    };
};

export {
    SendTokenToVerify,
    Transition,
};