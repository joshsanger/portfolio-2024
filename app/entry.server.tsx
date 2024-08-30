/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from "node:stream";

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {

  if (request.headers.get('user-agent')?.startsWith("curl")) {

    const whiteColorCode = "\x1b[38;2;255;255;255m";
    const tealColorCode = "\x1b[38;2;118;205;188m";
    const pinkColorCode = "\x1b[38;2;208;3;208m";
    const resetCode = "\x1b[0m";
    const linkedinLinkStart = "\x1b]8;;https://www.linkedin.com/in/jsanger\x1b\\";
    const codepenLinkStart = "\x1b]8;;https://codepen.io/joshsanger-the-looper\x1b\\";
    const githubLinkStart = "\x1b]8;;https://github.com/joshsanger\x1b\\";
    const portfolioLinkStart = "\x1b]8;;https://joshsanger.ca\x1b\\";
    const articlesLinkStart = "\x1b]8;;https://medium.com/@joshua.v.sanger\x1b\\";
    const projectLinkStart = "\x1b]8;;https://shopify.com/editions/summer2024\x1b\\";
    const hyperlinkEnd = "\x1b]8;;\x1b\\";
    const linebreak = "\x1b[0m";

    const art = `
    ${whiteColorCode}
          JJJJJJJJJJJ                               hhhhhhh
          J:::::::::J                               h:::::h
          J:::::::::J                               h:::::h
          JJ:::::::JJ                               h:::::h
            J:::::J   ooooooooooo       ssssssssss   h::::h hhhhh
            J:::::J oo:::::::::::oo   ss::::::::::s  h::::hh:::::hhh
            J:::::Jo:::::::::::::::oss:::::::::::::s h::::::::::::::hh
            J:::::jo:::::ooooo:::::os::::::ssss:::::sh:::::::hhh::::::h
            J:::::Jo::::o     o::::o s:::::s  ssssss h::::::h   h::::::h
JJJJJJJ     J:::::Jo::::o     o::::o   s::::::s      h:::::h     h:::::h
J:::::J     J:::::Jo::::o     o::::o      s::::::s   h:::::h     h:::::h
J::::::J   J::::::Jo::::o     o::::ossssss   s:::::s h:::::h     h:::::h
J:::::::JJJ:::::::Jo:::::ooooo:::::os:::::ssss::::::sh:::::h     h:::::h
 JJ:::::::::::::JJ o:::::::::::::::os::::::::::::::s h:::::h     h:::::h
   JJ:::::::::JJ    oo:::::::::::oo  s:::::::::::ss  h:::::h     h:::::h
     JJJJJJJJJ        ooooooooooo     sssssssssss    hhhhhhh     hhhhhhh

`;

      const message = `
  ${resetCode}
  ${tealColorCode}Senior Front End Developer${resetCode}
  ${linebreak}
  ${whiteColorCode}I create beautiful online experiences with baked-in moments of awe and delight.${resetCode}
  ${linebreak}
  -------------------
  ${linebreak}
  ${pinkColorCode}*${resetCode} ${portfolioLinkStart}Portfolio${hyperlinkEnd}
  ${pinkColorCode}*${resetCode} ${linkedinLinkStart}LinkedIn${hyperlinkEnd}
  ${pinkColorCode}*${resetCode} ${codepenLinkStart}Playground (Codepen)${hyperlinkEnd}
  ${pinkColorCode}*${resetCode} ${githubLinkStart}Github${hyperlinkEnd}
  ${pinkColorCode}*${resetCode} ${articlesLinkStart}Articles${hyperlinkEnd}
  ${pinkColorCode}*${resetCode} ${projectLinkStart}Latest project${hyperlinkEnd}
      `;

      return new Response(`${art}${message}`, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }


  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
