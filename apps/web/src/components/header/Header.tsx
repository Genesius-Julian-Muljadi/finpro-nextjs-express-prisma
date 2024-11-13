import LoginMenu from "./subcomponents/loginmenu/loginmenu";

export function Header() {
  return (
    <div className="grid grid-cols-1 grid-rows-1 mb-20">
      <div className="fixed h-9 w-screen px-4 sm:h-12 col-start-1 row-start-1 grid grid-cols-12 grid-rows-1 *:border *:border-black *:my-auto *:text-center">
        <div className="col-start-1 col-end-3 row-start-1 row-end-2" aria-label="Concert Hub Logo">
          ConcertHub logo
        </div>
        <div className="col-start-3 col-end-10 row-start-1 row-end-2">
          Search bar with filters
        </div>
        <div className="col-start-12 col-end-13 row-start-1 row-end-2" aria-label="Login button">
          Login
        </div>
      </div>
      <div className="col-start-1 row-start-1">
        <LoginMenu />
      </div>
    </div>
  );
};
