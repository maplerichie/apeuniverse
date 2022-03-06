import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";
import { ethers, providers } from "ethers";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const Test: NextPage = () => {
  const provider = new providers.AlchemyProvider(
    "homestead",
    "rFv2hc327AtkRoRLutkhxNkVE_JqINSV"
  );
  const web3 = createAlchemyWeb3(
    "https://eth-mainnet.alchemyapi.io/v2/rFv2hc327AtkRoRLutkhxNkVE_JqINSV"
  );

  const ids = [];
  let ins;

  let address = "0x32973908faee0bf825a343000fe412ebe56f802a";
  let abi =
    '{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"Transfer","type":"event"}]';

  useEffect(() => {
    const contract = new ethers.Contract(address, abi, provider);

    // contract.on("Transfer", (from, to, tokenId) => {
    //   console.log(from, "==>", to, ":", tokenId);
    // });
  });

  const get = () => {
    let tokens = [];
    if (ins) {
      clearInterval(ins);
      ins = null;
    } else {
      let i = 0;
      ins = setInterval(async () => {
        const response = await web3.alchemy.getNftMetadata({
          contractAddress: "",
          tokenId: ids[i].toString(),
        });
        tokens.push({ id: ids[i], metadata: response.metadata });
        i++;
        if (i >= ids.length) {
          await fetch("http://localhost:3000/api/write", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ from: 0, data: tokens }),
          });
          clearInterval(ins);
          ins = null;
        }
      }, 1000);
    }
  };

  return <Form>{/* <Button onClick={get}>Start interval</Button> */}</Form>;
};

export default Test;
