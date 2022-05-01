import React from "react";
import Link from "next/link";
import Image from "next/image";
import AssetImage from "./AssetImage";
import styles from "../styles/Common.module.scss";

export const Collection: React.FC<{
  collection: any;
}> = ({ collection }) => {
  return (
    <div>
      <div className={styles.collectionInfo}>
        <h4 className={styles.collectionTitle}>
          {collection.name}&nbsp;&nbsp;&nbsp;({collection.assets.length})
        </h4>
        <div className={styles.collectionLinks}>
          {collection.website ? (
            <Link href={collection.website}>
              <a target="_blank" rel="noopener noreferrer">
                <Image
                  src="/website.png"
                  alt="Official website"
                  width="24"
                  height="24"
                />
              </a>
            </Link>
          ) : (
            <></>
          )}
          {collection.twitter ? (
            <Link href={"https://twitter.com/" + collection.twitter}>
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
          {collection.discord ? (
            <Link href={collection.discord}>
              <a target="_blank" rel="noopener noreferrer">
                <Image
                  src="/discord.png"
                  alt="Discord"
                  width="24"
                  height="24"
                />
              </a>
            </Link>
          ) : (
            <></>
          )}
          {collection.opensea ? (
            <Link href={"https://opensea.io/collection/" + collection.opensea}>
              <a target="_blank" rel="noopener noreferrer">
                <Image
                  src="/opensea.png"
                  alt="Opensea"
                  width="24"
                  height="24"
                />
              </a>
            </Link>
          ) : (
            <></>
          )}
          {collection.looksrare ? (
            <Link
              href={"https://looksrare.org/collections/" + collection.looksrare}
            >
              <a target="_blank" rel="noopener noreferrer">
                <Image
                  src="/looksrare.png"
                  alt="Looksrare"
                  width="24"
                  height="24"
                />
              </a>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {collection.assets.map((asset: any, i) => (
          <AssetImage
            key={i.toString()}
            asset={asset}
            collection={collection}
          />
        ))}
      </div>
    </div>
  );
};
