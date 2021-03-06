import React from "react";
import { User } from "../models/User";
import styles from "../styles/Common.module.scss";
import Link from "next/link";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";

const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const maxSize = 128;
  return (
    <div className={styles.avatarCard}>
      <Image
        src={user.avatarURI || "/user.png"}
        placeholder="blur"
        blurDataURL={"/user.png"}
        height={maxSize}
        width={maxSize}
        objectFit="cover"
        className={styles.avatarImage}
      />
      <div className={styles.avatarInfo}>
        {user.ens ? (
          <div style={{ textTransform: "lowercase" }}>{user.ens}</div>
        ) : user.name ? (
          <div style={{ textTransform: "capitalize" }}>{user.name}</div>
        ) : (
          <></>
        )}
        <div className={styles.avatarSocial}>
          <Link href={"https://rainbow.me/" + user.address}>
            <a target="_blank" rel="noopener noreferrer">
              🌈
            </a>
          </Link>
          {user.twitter ? (
            <Link href={"https://twitter.com/" + user.twitter}>
              <a target="_blank" rel="noopener noreferrer">
                <BsTwitter />
              </a>
            </Link>
          ) : (
            <></>
          )}
          {user.website ? (
            <Link href={user.website}>
              <a target="_blank" rel="noopener noreferrer">
                🌐
              </a>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <div className={styles.avatarInner}>
          {user.message ? (
            <p className={styles.userMessage}>{user.message}</p>
          ) : (
            <></>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Avatar;
