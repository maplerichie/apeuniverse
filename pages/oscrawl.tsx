import React, { useState } from "react";
import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";
import { ethers } from "ethers";

declare let window: any;

const Test: NextPage = () => {
  const openseaAssetsApi = "https://api.opensea.io/api/v1/assets";

  const [state, setState] = useState({
    address: "",
    max: 0,
  });
  let count = 0;
  const increaseBy = 30;
  let start = null;
  const toGet = [18, 24, 27, 30, 4, 7];

  const startGet = async () => {
    count = 0;
    for (let i = count; count < state.max / increaseBy; i++) {
      // if (toGet.includes(count)) {
      let tokenIds = [];
      let from = count * increaseBy;
      let to = from + increaseBy > state.max ? state.max : from + increaseBy;
      console.log("Crawling ", from, "-", to);

      if (to === state.max) {
        console.log("Hit max stop");
        clearInterval(start);
      }

      for (let i = from; i < to; i++) {
        tokenIds.push(i);
      }
      let requestUrl =
        openseaAssetsApi +
        "?limit=50&asset_contract_address=" +
        state.address +
        "&token_ids=" +
        tokenIds.join("&token_ids=");

      let res = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());

      await fetch("http://localhost:3000/api/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: count, data: res }),
      }).then(() => count++);

      setTimeout(() => {}, 1200);
    }
  };
  const erc20 = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const erc20Abi = [
    "function decimals() external view returns (uint8)",
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function allowance(address, address) external view returns (uint256)",
    "function balanceOf(address, address) external view returns (uint256)",
    "function approve(address, uint256) external returns (bool)",
    "function increaseAllowance(address, uint256) external returns (bool)",
  ];
  const marketAbi =
    '[{"inputs":[{"internalType":"address","name":"_vault","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"BoxIdUsed","type":"error"},{"inputs":[],"name":"InvalidBoxQuantity","type":"error"},{"inputs":[],"name":"InvalidCustomAddress","type":"error"},{"inputs":[],"name":"InvalidMerkleProof","type":"error"},{"inputs":[],"name":"InvalidPayment","type":"error"},{"inputs":[],"name":"InvalidPaymentMethod","type":"error"},{"inputs":[],"name":"InvalidPrice","type":"error"},{"inputs":[],"name":"InvalidPurchase","type":"error"},{"inputs":[],"name":"InvalidQuantity","type":"error"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"NotOperator","type":"error"},{"inputs":[],"name":"PaymentFailed","type":"error"},{"inputs":[],"name":"PurchaseFailed","type":"error"},{"inputs":[],"name":"SalesNotAvailable","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"purchaser","type":"address"},{"indexed":false,"internalType":"bytes","name":"boxId","type":"bytes"},{"indexed":false,"internalType":"uint32","name":"quantity","type":"uint32"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"MarketTransferBoxes","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"purchaser","type":"address"},{"indexed":false,"internalType":"bytes","name":"boxId","type":"bytes"},{"indexed":false,"internalType":"address","name":"paymentToken","type":"address"},{"indexed":false,"internalType":"uint32","name":"quantity","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"paid","type":"uint256"}],"name":"PurchasedBoxes","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"addOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"boxIds","type":"bytes[]"},{"internalType":"address[]","name":"paymentTokens","type":"address[]"},{"internalType":"uint256[]","name":"retailPrices","type":"uint256[]"},{"internalType":"uint256[]","name":"specialPrices","type":"uint256[]"},{"internalType":"uint256[]","name":"bulkDiscounts","type":"uint256[]"},{"internalType":"bool","name":"update","type":"bool"}],"name":"batchAddOrUpdateBox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"address","name":"who","type":"address"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"canPurchase","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bool","name":"can","type":"bool"},{"internalType":"uint32","name":"max","type":"uint32"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"}],"name":"getBoxInfo","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint8","name":"","type":"uint8"},{"internalType":"uint8","name":"","type":"uint8"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address","name":"paymentToken","type":"address"}],"name":"getBoxPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address","name":"who","type":"address"}],"name":"getBoxSales","outputs":[{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operatorList","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint32","name":"quantity","type":"uint32"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"purchaseBoxes","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address","name":"who","type":"address"},{"internalType":"uint32","name":"quantity","type":"uint32"},{"internalType":"string","name":"reason","type":"string"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"address[]","name":"members","type":"address[]"},{"internalType":"uint32[]","name":"max","type":"uint32[]"},{"internalType":"address[]","name":"paymentToken","type":"address[]"},{"internalType":"uint256[]","name":"price","type":"uint256[]"}],"name":"updateCustom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"boxId","type":"bytes"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"end","type":"uint256"},{"internalType":"uint32","name":"supply","type":"uint32"},{"internalType":"uint8","name":"mode","type":"uint8"},{"internalType":"uint8","name":"target","type":"uint8"},{"internalType":"uint32","name":"max","type":"uint32"},{"internalType":"uint32","name":"bulk","type":"uint32"},{"internalType":"bytes32","name":"merkleRoot","type":"bytes32"}],"name":"updateSales","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vault","type":"address"}],"name":"updateVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]';
  const market = "0xBEAb57DcF7EDC611549f7B71748f300dFee22eFf";

  const test = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/ByecBSseX0OO5spynqDX9dpE1iNjAsT5"
    );
    await _provider.send("eth_requestAccounts", []);
    const network = await _provider.getNetwork();
    // if (network.chainId !== 137) {
    //   alert("Please connect to Ethereum Mainnet");
    //   return;
    // }
    // setProvider(_provider);
    let signer = _provider.getSigner();
    // setSigner(_signer);
    // let address = await signer.getAddress();
    // const erc20Contract = new ethers.Contract(erc20, erc20Abi, signer);
    const marketContract = new ethers.Contract(market, marketAbi, signer);

    let feeData = await provider.getFeeData();
    console.log("gasPrice", ethers.utils.formatUnits(feeData.gasPrice, "gwei"));
    console.log(
      "maxFeePerGas",
      ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei")
    );
    console.log(
      "maxPriorityFeePerGas",
      ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei")
    );

    await marketContract.purchaseBoxes(
      "0x0000000000000000000000004fd32af0c0264a27bfca6fe7dd1b9c8d73dd699e00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000004e2100000000000000000000000000000000000000000000000000000000000000257472616e73666572546f5573657228616464726573732c75696e7433322c75696e74333229000000000000000000000000000000000000000000000000000000",
      erc20,
      1,
      [],
      {
        maxFeePerGas: feeData.gasPrice.add(feeData.maxFeePerGas.mul(10)),
        maxPriorityFeePerGas: feeData.gasPrice.add(
          feeData.maxPriorityFeePerGas.mul(10)
        ),
      }
    );

    // const allowance = await erc20Contract.allowance(
    //   await signer.getAddress(),
    //   market
    // );
    // const decimals = await erc20Contract.decimals();
    // console.log("Allowance:", allowance);
    // console.log("Decimals:", decimals);
    // const approveTx = await erc20Contract.approve(market, 0);
    // if (allowance.lt(ethers.utils.parseUnits("100", decimals))) {
    //   const approveTx = await erc20Contract.approve(
    //     market,
    //     ethers.constants.MaxUint256
    //   );
    //   let readyToPay = (await approveTx.wait()).status === 1;
    //   console.log("Approval status:", readyToPay);
    // }
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formAddress">
        <Form.Label>Contract address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          onChange={(e) => setState({ ...state, address: e.target.value })}
          value={state.address}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formMax">
        <Form.Label>Max supply</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter max"
          onChange={(e) =>
            setState({ ...state, max: parseInt(e.target.value) })
          }
          value={state.max}
        />
      </Form.Group>

      {/* <Button onClick={startGet}>Start interval</Button>

      <Button onClick={test}>approve</Button> */}
    </Form>
  );
};

export default Test;
