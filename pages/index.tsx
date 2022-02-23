import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Common.module.scss";
import { Container } from "react-bootstrap";

const Index = (props) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>APE UNIVERSE | For Apes, By Apes</title>
      <meta name="description" content="We own Apes, probably nothing!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Container fluid className={styles.landing}>
      <div className={styles.blockquote}>
        <p>
          你以为是<strong>元宇宙</strong>
          {"，"}其实是<strong>猿宇宙</strong>
          {"！"}没有所谓BAYC大佬{"，"}
          就是几百个碰巧<strong>2021年5月</strong>上车的{"，"}并且还拿到现在的
        </p>
        <cite>@apeuniverse.eth</cite>
      </div>
      <Link href="/home">
        <a className={styles.landing_enter}>Enter the Ape Universe</a>
      </Link>
    </Container>
  </>
);

export default Index;
