import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { User } from "../models/User";
import styles from "../styles/Common.module.scss";
import Link from "next/link";
import Image from "next/image";

const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const maxSize = 128;
  return (
    <div className={styles.avatarCard}>
      <ImageWithFallback
        src={user.avatarURI || "/user.png"}
        fallbackSrc={`nft.png`}
        placeholder="blur"
        blurDataURL={"/user.png"}
        // layout="fill"
        height={maxSize}
        width={maxSize}
        // objectFit="cover"
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
                <Image
                  src="/twitter.png"
                  alt="Twitter"
                  width="24"
                  height="24"
                />
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
        <ImageWithFallback
          src={user.avatarURI || "/user.png"}
          fallbackSrc={`nft.png`}
          placeholder="blur"
          blurDataURL={user.avatarURI || "/user.png"}
          layout="fill"
          objectFit="cover"
          className={styles.avatarImage}
        />
        <div className={styles.avatarInfo}>
          {user.name ? (
            <div style={{ textTransform: "capitalize" }}>{user.name}</div>
          ) : (
            <></>
          )}
          {user.ens ? (
            <div style={{ textTransform: "lowercase" }}>{user.ens}</div>
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
                  <Image
                    src="/twitter.png"
                    alt="Twitter"
                    width="24"
                    height="24"
                  />
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
