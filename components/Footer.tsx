import React from "react";
import Image from "next/image";
import styles from "../styles/Common.module.scss";

const Footer: React.FC<{}> = ({}) => {
  return (
    <footer className={styles.footer}>
      <span>For Apes, By Apes</span>
      <span className={styles.logo}>
        <Image src="/cao.png" alt="Crazy Ape" width={40} height={35} />
      </span>
      <span>
        <a
          href="https://forms.gle/niF9BKaAzuamQ1iC8"
          target="_blank"
          rel="noopener noreferrer"
        >
          Feedback
        </a>
      </span>
    </footer>
  );
};

export default Footer;
