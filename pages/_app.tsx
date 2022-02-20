import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import Head from "next/head";
import SSRProvider from "react-bootstrap/SSRProvider";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ApeUniverse.eth</title>
        <meta name="description" content="We own Apes, probably nothing!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}

export default MyApp;
