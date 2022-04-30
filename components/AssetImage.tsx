import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { Asset, Collection } from "../models";
import styles from "../styles/Common.module.scss";
import Image from "next/image";

const AssetImage: React.FC<{
  asset: Asset;
  collection: Collection;
}> = ({ asset, collection }) => {
  const maxSize = 168;
  return (
    <div className={styles.assetCard}>
      <div className={styles.assetInner}>
        {/* <ImageWithFallback
          src={asset.imageURI + "=w" + maxSize}
          alt={collection.name + "#" + asset.tokenId}
          fallbackSrc={"/nft.png"}
          // layout="fill"
          width={maxSize}
          height={maxSize}
          objectFit="cover"
          className={styles.assetImage}
        /> */}
        <Image
          src={asset.imageURI + "=w" + maxSize}
          alt={collection.name + "#" + asset.tokenId}
          // layout="fill"
          width={maxSize}
          height={maxSize}
          objectFit="cover"
          className={styles.assetImage}
        />
        <div className={styles.assetInfo}>
          #{asset.tokenId}
          <br />
          {asset.owner.ens
            ? asset.owner.ens
            : asset.owner.name
            ? asset.owner.name
            : asset.owner.address.slice(0, 4) +
              ".." +
              asset.owner.address.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default AssetImage;
