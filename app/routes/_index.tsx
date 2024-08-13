import type { MetaFunction } from "@remix-run/node";

import CodeCanvas from "~/components/CodeCanvas/CodeCanvas";
import HoverGlitch from "~/components/HoverGlitch/HoverGlitch";
import Codepen from "~/components/Icons/Codepen";
import Email from "~/components/Icons/Email";
import Linkedin from "~/components/Icons/Linkedin";
import X from "~/components/Icons/X";


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
    <main className="h-full">
      <section className="h-[calc(100svh-100px)] leading-[1] pt-40 pb-80 lg:pb-120 mt-100">
        <div className="container grid items-end sm:items-center h-full">
          <div>
            <h1 className="text-[clamp(110px,8.5vmax,160px)]">
              <span className="relative animate-reveal-1 opacity-0 translate-y-[20px] block">Josh</span>
              <span className="relative animate-reveal-1 opacity-0 translate-y-[20px] block">Sanger</span>
            </h1>
            <p className="text-16 text-teal font-sans md:text-[clamp(18px,1.5vw,22px)] mt-20 opacity-0 translate-y-[20px] animate-reveal-2">
              Senior Front End Developer
            </p>
            <p className="opacity-0 translate-y-[20px] animate-reveal-3 text-16 md:text-[clamp(18px,1.5vmax,22px)]  max-w-300 md:max-w-350 lg:max-w-425 text-balance mt-16 leading-[1.5]">
              I create beautiful online experiences with baked-in moments of awe
              and delight.
            </p>
            <p className="mt-20 flex flex-wrap gap-[clamp(10px,3%,20px)] items-center">
              <HoverGlitch>
                <a href="https://www.linkedin.com/in/jsanger" target="_blank" rel="noopener noreferrer" className="inline-grid place-items-center size-44 rounded-full bg-teal hover:bg-teal2 animate-reveal-3 opacity-0" style={{animationDelay: '0.75s'}}>
                  <Linkedin />
                </a>
              </HoverGlitch>

              <HoverGlitch count={7}>
                <a href="https://codepen.io/joshsanger-the-looper" target="_blank" rel="noopener noreferrer" className="inline-grid place-items-center size-44 rounded-full bg-teal hover:bg-teal2 animate-reveal-3 opacity-0" style={{animationDelay: '0.85s'}}>
                  <Codepen />
                </a>
              </HoverGlitch>
              <HoverGlitch count={6}>
                <a href="mailto:joshua.v.sanger@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-grid place-items-center size-44 rounded-full bg-teal hover:bg-teal2 animate-reveal-3 opacity-0" style={{animationDelay: '0.95s'}}>
                  <Email />
                </a>
              </HoverGlitch>
              <HoverGlitch count={5}>
                <a href="https://x.com/JoshSanger_eth" target="_blank" rel="noopener noreferrer" className="inline-grid place-items-center size-44 rounded-full bg-teal hover:bg-teal2 animate-reveal-3 opacity-0" style={{animationDelay: '1.05s'}}>
                  <X />
                </a>
              </HoverGlitch>
            </p>
          </div>
        </div>
        <CodeCanvas />
      </section>
    </main>
  );
}
