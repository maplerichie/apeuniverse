import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { Asset, Collection } from "../models";
import styles from "../styles/Common.module.scss";

const AssetImage: React.FC<{ asset: Asset; collection: Collection }> = ({
  asset,
  collection,
}) => {
  return (
    <div key={asset.assetKey} className={styles.assetCard}>
      <div className={styles.assetInner}>
        <ImageWithFallback
          src={asset.imageURI}
          alt={collection.name + "#" + asset.tokenId}
          fallbackSrc={"./nft.png"}
          layout="fill"
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
            : asset.owner.address.slice(0, 6) +
              ".." +
              asset.owner.address.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default AssetImage;
