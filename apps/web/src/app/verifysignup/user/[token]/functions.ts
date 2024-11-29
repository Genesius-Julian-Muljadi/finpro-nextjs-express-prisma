import axios from "axios";

async function SendTokenToVerify(tkn: string) {
    try {
        const API: string = process.env.NEXT_PUBLIC_BASE_API_URL + "/auth";
        const post = await axios.post(API + "/verifyuser", {}, {
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
    const button = document.getElementById("verifypageuserbuttondiv") as HTMLDivElement;
    const message = document.getElementById("verifypageusermessagediv") as HTMLDivElement;

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