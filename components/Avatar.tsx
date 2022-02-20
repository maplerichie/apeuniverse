import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { User } from "../models/User";

const Avatar: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div
      style={{
        borderRadius: 64,
        overflow: "hidden",
        height: 128,
        width: 128,
        position: "relative",
        margin: "0.5rem",
      }}
    >
      <ImageWithFallback
        src={user.avatarURI || "/user.png"}
        fallbackSrc={`nft.png`}
        placeholder="blur"
        blurDataURL={user.avatarURI || "/user.png"}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default Avatar;
