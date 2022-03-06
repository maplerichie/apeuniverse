import React from "react";
import Image from "next/image";
import styles from "../styles/Common.module.scss";

const Footer: React.FC<{}> = ({}) => {
  return (
    <footer className={styles.footer}>
      <a>
        <span>For Apes, By Apes</span>{" "}
        <span className={styles.logo}>
          <Image src="/cao.png" alt="Crazy Ape" width={40} height={35} />
        </span>
      </a>
    </footer>
  );
};

export default Footer;
