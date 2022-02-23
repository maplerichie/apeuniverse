import Head from "next/head";
import { Container } from "react-bootstrap";
import Appbar from "./Appbar";
import Image from "next/image";
import styles from "../styles/Common.module.scss";

const Layout: React.FC = (props) => {
  return (
    <div className="Layout">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>APE UNIVERSE | For Apes, By Apes</title>
        <meta name="description" content="We own Apes, probably nothing!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Appbar />
      <Container fluid>{props.children}</Container>

      <footer className={styles.footer}>
        {/* <a href="#" target="_blank" rel="noopener noreferrer">
         */}
        <a>
          <span>For Apes, By Apes</span>{" "}
          <span className={styles.logo}>
            <Image src="/cao.png" alt="Crazy Ape" width={40} height={35} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Layout;
