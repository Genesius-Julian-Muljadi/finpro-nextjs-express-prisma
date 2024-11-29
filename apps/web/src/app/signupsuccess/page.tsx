export default async function SignupSuccess() {
    return (
        <div className="grid grid-cols-1 grid-rows-1 w-screen h-screen">
            <div className="m-auto">
                <p>Thank you for signing up with ConcertHub. Your signup was successful!</p>
                <p>Please check your email to verify it before you can log in.</p>
            </div>
        </div>
    );
};