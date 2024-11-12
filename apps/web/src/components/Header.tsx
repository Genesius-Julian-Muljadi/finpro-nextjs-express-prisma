export function Header() {
  return (
    <div>
      <div className="grid grid-cols-12 grid-rows-1 *:border *:border-black px-4 h-12 *:my-auto *:text-center">
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
    </div>
  )
};
