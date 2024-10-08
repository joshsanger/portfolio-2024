import {LinksFunction} from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import tailwindCss from "./tailwind.css?url";
import me from "~/images/me.jpg";
import WordScramble from "~/components/WordScramble/WordScramble";
import HoverGlitch from "~/components/HoverGlitch/HoverGlitch";
import SeaCanvas from "~/components/SeaCanvas/SeaCanvas";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: tailwindCss,
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Frank+Ruhl+Libre:wght@300..900&display=swap",
      as: "font",
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="">
        <header className="fixed top-0 left-0 w-full h-100 animate-reveal-nav opacity-0">
          <div className="h-full container flex items-center justify-end">
            <nav className="flex items-center">
              <ul className="hidden gap-10 items-center font-sans text-teal md:flex">
                <li><a href="https://shopify.com/editions/summer2024" target="_blank" rel="noopener noreferrer" className="hover:underline"><WordScramble word="Latest project" className="px-10"/></a></li>
                <li><a href="https://medium.com/@joshua.v.sanger" target="_blank" rel="noopener noreferrer" className="hover:underline"><WordScramble word="Articles" className="px-10"/></a></li>
                <li><a href="https://codepen.io/joshsanger-the-looper" target="_blank" rel="noopener noreferrer" className="hover:underline"><WordScramble word="Playground" className="px-10"/></a></li>
              </ul>
              <a href="mailto:joshua.v.sanger@gmail.com" aria-label="Contact" className="group/contact mr-30 ml-15 contact font-sans rounded-full bg-teal text-black inline-block transition-colors w-123 h-44 relative hover:bg-white/10 clip">
                <span className="pointer-events-none absolute size-full grid place-items-center group-hover/contact:ease-out ease-bounce-back duration-300 group-hover/contact:-translate-y-full transition-transform">Contact</span>
                <span className="pointer-events-none absolute size-full grid place-items-center group-hover/contact:ease-out ease-bounce-back duration-300 translate-y-full group-hover/contact:translate-y-0 transition-transform">
                  <span className="animation-paused group-hover/contact:animation-running animate-wave">👋</span>
                </span>
              </a>
              <a href="https://www.linkedin.com/in/jsanger" target="_blank" rel="noopener noreferrer" className="size-60 rounded-xl relative">
                <HoverGlitch>
                <img src={me} alt="Josh Sanger holding pineapples" className="size-full rounded-xl"/>
                </HoverGlitch>
              </a>
            </nav>
          </div>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main className="h-full">
      <section className="h-[calc(100svh-100px)] mt-50 leading-[1] grid place-items-center">
        <div className="container text-center">
          <h1 className="text-[clamp(150px,15vmax,250px)] font-bold opacity-0 animate-reveal-1">
            {error.status}
          </h1>
          <p className="text-16 md:text-[clamp(18px,1.5vmax,22px)] leading-[1.5] mb-20 animate-reveal-2 font-sans max-w-500 mx-auto text-balance opacity-0">Ye be off the map! The page ye be seekin’ be lost at sea, swallowed by the briny deep.</p>
          <p className="opacity-0 animate-reveal-3">
            <Link to="/" aria-label="Get me out of here!" className="group/contact contact font-sans rounded-full bg-teal text-black inline-block transition-colors w-220 h-44 relative hover:bg-black/80 clip">
                <span className="pointer-events-none absolute size-full grid place-items-center group-hover/contact:ease-out ease-bounce-back duration-300 group-hover/contact:-translate-y-full transition-transform">Back to the home port</span>
                <span className="pointer-events-none absolute size-full grid place-items-center group-hover/contact:ease-out ease-bounce-back duration-300 translate-y-full group-hover/contact:translate-y-0 transition-transform">
                  <span className="animation-paused group-hover/contact:animation-running animate-leave">👈</span>
                </span>
              </Link>
          </p>
        </div>
        </section>
        <SeaCanvas />
    </main>
  );
}
