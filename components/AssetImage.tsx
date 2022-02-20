import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { Asset, Collection } from "../models";

const AssetImage: React.FC<{ asset: Asset; collection: Collection }> = ({
  asset,
  collection,
}) => {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        height: 256,
        width: 256,
        position: "relative",
        margin: "0.25rem",
      }}
    >
      <ImageWithFallback
        src={asset.imageURI}
        alt={collection.name + "#" + asset.tokenId}
        fallbackSrc={`nft.png`}
        placeholder="blur"
        blurDataURL={asset.imageURI}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default AssetImage;
