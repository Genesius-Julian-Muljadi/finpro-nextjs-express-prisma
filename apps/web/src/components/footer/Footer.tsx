export const Footer = () => {
  return (
  <div className="z-[49] w-screen bg-neutral-400 mt-10 grid grid-cols-1 grid-rows-1">
    <div className="col-start-1 col-end-2 row-start-1 row-end-2 mt-auto mr-auto flex flex-col gap-0 text-xs">
    <p>Online database: Supabase | <a href="https://i.imgur.com/n9W6mhx.png" className="text-blue-600 hover:text-blue-800 active:text-blue-900 after:text-purple-600">Database screenshot</a></p>
      <p>Missing features: Search, Event pages, creation, transactions, & ratings</p>
      <p>Current features: Login & Authentication, Referral codes & discounts, Dashboards & statistics</p>
      <p>Second project using back-end & front-end, using Next.js, Tailwind CSS, React, Redux, Node.js, Express, Prisma, JSON Web Tokens</p>
    </div>
    <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-4 sm:p-10 m-auto flex flex-col text-sm">
      <div>
        Additional credit to: mal3diction
      </div>
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
