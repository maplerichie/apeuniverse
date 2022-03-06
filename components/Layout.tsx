import Head from "next/head";
import { Container } from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import Image from "next/image";
import styles from "../styles/Common.module.scss";

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <title>APE UNIVERSE | For Apes, By Apes</title>
        <meta name="description" content="We own Apes, probably nothing!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
