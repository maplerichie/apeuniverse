import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Navbar,
  Container,
  Button,
  Dropdown,
  ButtonGroup,
  NavDropdown,
} from "react-bootstrap";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";

declare let window: any;

const Appbar: React.FC<{}> = ({}) => {
  //   const [isConnected, setConnected] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  //   const [provider, setProvider] = useState(null);
  //   const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAddress(localStorage.getItem("address"));
      setAuthenticated(true);
    }
  });

  const connect = async () => {
    // const url =
    //   "https://api.opensea.io/api/v1/assets?asset_contract_address=0x60E4d786628Fea6478F785A6d7e704777c86a7c6&token_ids=6289";
    // fetch(url, {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    let _signer;
    let _address;
    // if (!isConnected) {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const network = await _provider.getNetwork();
    if (network.chainId !== 1) {
      alert("Please connect to Ethereum Mainnet");
      return;
    }
    // setProvider(_provider);
    _signer = _provider.getSigner();
    // setSigner(_signer);
    _address = await _signer.getAddress();
    if (ethers.utils.isAddress(_address)) {
      //   setConnected(true);
      login(_signer, _address);
    } else {
      alert("Something strange occured. Please contact admin.");
    }
    // }
  };

  const login = async (_signer, _address) => {
    fetch("/api/user/" + _address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (res) => {
        if (res.status == "ok") {
          if (res.nonce) {
            let timestamp = new Date().getTime();
            const message = `Welcome to ApeUniverse.\n
              Nonce: ${res.nonce}\nTimestamp: ${timestamp}`;
            try {
              const signature = await _signer.signMessage(message);

              let postObj = {
                address: _address,
                timestamp: timestamp,
                signature: signature,
              };
              fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postObj),
              })
                .then((response) => response.json())
                .then((res) => {
                  if (res.status === "ok") {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("id", res.user.id);
                    localStorage.setItem("address", res.user.address);
                    setAddress(res.user.address);
                    setAuthenticated(true);
                    if (res.welcome) {
                      Router.push({
                        pathname: "/member/edit",
                        query: { welcome: res.welcome },
                      });
                    }
                  } else {
                    alert(JSON.stringify(res));
                  }
                })
                .catch((err) => {
                  alert(JSON.stringify(err));
                });
            } catch (err) {
              alert(JSON.stringify(err));
            }
          } else {
            // redirect
          }
        } else {
          alert("Something strange occured. Please contact admin.");
        }
      })
      .catch((err) => {
        console.log("ERROR: GET api/user/[address] ===>", err);
      });
  };

  const disconnect = () => {
    setAddress("");
    // setSigner(null);
    // setConnected(false);
    setAuthenticated(false);
    localStorage.clear();
    Router.push("/home");
  };

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/home">
          <img
            alt="ApeUniverse.eth"
            src="/logo.png"
            height="32"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <div className="d-flex">
          <Link href="https://twitter.com/apeuniverse_eth">
            <a target="_blank" rel="noopener noreferrer">
              <Image src="/twitter.png" alt="Twitter" width="32" height="32" />
            </a>
          </Link>
          &nbsp; &nbsp; &nbsp;
          {isAuthenticated ? (
            <>
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-primary">
                  {address.slice(0, 6) + "......" + address.slice(-6)}
                </Button>
                <Dropdown.Toggle
                  split
                  variant="outline-primary"
                  id="dropdown-split-basic"
                />
                <Dropdown.Menu>
                  <Dropdown.Item href="/member/edit">Profile</Dropdown.Item>
                  <NavDropdown.Divider />
                  <Dropdown.Item onClick={disconnect}>Disconnect</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Button variant="primary" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Appbar;
