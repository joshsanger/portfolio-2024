import type { MetaFunction } from "@remix-run/node";

import CodeCanvas from "~/components/CodeCanvas/CodeCanvas";


export const meta: MetaFunction = () => {
  return [
    { title: "Joshua Sanger | Senior Front End Developer" },
    {
      name: "description",
      content: "I create engaging and delightful web experiences",
    },
  ];
};

export default function Index() {
  return (
    <main className="h-full leading-[1] pt-40 pb-100">
      <div className="container grid items-center h-full">
        <div>
          <h1 className="text-[clamp(110px,8.5vmax,160px)]">
            Josh
            <br />
            Sanger
          </h1>
          <p className="text-16 text-teal font-sans md:text-[clamp(18px,1.5vw,22px)] mt-20">
            Senior Front End Developer
          </p>
          <p className="text-16 md:text-[clamp(18px,1.5vmax,22px)]  max-w-300 md:max-w-350 lg:max-w-425 text-balance mt-16 leading-[1.5]">
            I create beautiful online experiences with baked-in moments of awe
            and delight.
          </p>
        </div>
      </div>
      {/* <CodeCanvas /> */}
    </main>
  );
}
