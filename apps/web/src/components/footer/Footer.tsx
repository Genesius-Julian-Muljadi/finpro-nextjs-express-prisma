export const Footer = () => {
  return (
  <div className="z-[49] w-screen bg-neutral-400 mt-10 grid grid-cols-1 grid-rows-1">
    <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-4 sm:p-10 m-auto flex flex-col text-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3">
        <div>
          <a href="/login">Login</a>
        </div>
        <div>
          <a href="/events">Events Page</a>
        </div>
        <div>
          <a href="/populate">Database Population</a>
        </div>
      </div>
    </div>
  </div>);
};
