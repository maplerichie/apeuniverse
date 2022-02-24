import React, { useState } from "react";
import type { NextPage } from "next";
import { Button, Form } from "react-bootstrap";

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

      <Button onClick={startGet}>Start interval</Button>
    </Form>
  );
};

export default Test;
