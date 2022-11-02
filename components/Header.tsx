import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import Router from "next/router";
import styles from "../styles/Common.module.scss";

declare let window: any;

const logo = {
  maxWidth: "70vw",
};

const Header: React.FC<{}> = ({}) => {
  const openseaAssetsApi = "https://api.opensea.io/api/v1/assets";
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  let assets = [];

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAddress(localStorage.getItem("address"));
      setAuthenticated(true);
    }
  });

  const connect = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const network = await _provider.getNetwork();
    if (network.chainId !== 1) {
      alert("Please connect to Ethereum Mainnet");
      return;
    }
    let _signer = _provider.getSigner();
    let _address = await _signer.getAddress();
    if (ethers.utils.isAddress(_address)) {
      setShow(true);
      assets = [];
      getCollections(_address);
    } else {
      alert("Something strange occured. Please contact admin.");
    }
  };

  const getCollections = async (_address) => {
    let res = await (
      await fetch(
        process.env.NEXT_PUBLIC_DOMAIN_URL + "api/collection?filter=true",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
    ).json();
    let requestUrl =
      openseaAssetsApi +
      "?limit=50&owner=" +
      // "?limit=50&order_direction=asc&owner=" +
      _address +
      "&asset_contract_addresses=" +
      res.join("&asset_contract_addresses=");
    getAssetsFromOpenSea(_address, requestUrl);
  };

  const getAssetsFromOpenSea = async (_address, url) => {
    let res = await (
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    for (let asset of res.assets) {
      assets.push({
        address: asset.asset_contract.address,
        imageURI: asset.image_url,
        tokenId: asset.token_id,
      });
    }
    if (res.next) {
      getAssetsFromOpenSea(_address, url + "&cursor=" + res.next);
    } else {
      login(_address);
    }
  };

  const login = async (_address) => {
    let postObj = {
      userAddress: _address,
      assets: assets,
    };
    fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postObj),
    })
      .then((response) => response.json())
      .then(async (res) => {
        setShow(false);
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
          alert("Something strange occured");
        }
      })
      .catch((err) => {
        setShow(false);
        alert("Something strange occured");
        console.log("ERROR: POST api/user/ ==>", err);
      });
  };

  const disconnect = () => {
    setAddress("");
    setAuthenticated(false);
    localStorage.clear();
    Router.push("/home");
  };

  return (
    <Navbar collapseOnSelect expand="md" bg="transparent" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/home">
          <img
            alt="apeuniverse.eth"
            src="/logo.png"
            height="32"
            className="d-inline-block align-top"
            style={logo}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav style={{ alignItems: "center" }}>
            {/* <NavDropdown title="$APE Claim" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="https://www.apecoin.com/claim"
                target="_blank"
                rel="noopener noreferrer"
              >
                Claim now!
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/apecoin/bayc">BAYC</NavDropdown.Item>
              <NavDropdown.Item href="/apecoin/mayc">MAYC</NavDropdown.Item>
              <NavDropdown.Item href="/apecoin/bakc">BAKC</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Otherdeed Claim" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="https://otherside.xyz/claim"
                target="_blank"
                rel="noopener noreferrer"
              >
                Claim now!
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/otherdeed/bayc">BAYC</NavDropdown.Item>
              <NavDropdown.Item href="/otherdeed/mayc">MAYC</NavDropdown.Item>
            </NavDropdown> */}
            <Nav.Link
              href="https://twitter.com/apeuniverse_eth"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/twitter.png" alt="Twitter" width="32" height="32" />
            </Nav.Link>
            <Nav.Link
              href="https://discord.gg/JNPHXcwDuY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/discord.png" alt="Discord" width="32" height="32" />
            </Nav.Link>
            <Nav.Link
              href="https://www.clubhouse.com/club/%E6%97%A0%E7%BB%84%E7%BB%87%E6%AD%A3%E5%B8%B8%E4%BA%BA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/clubhouse.png"
                alt="Clubhouse"
                width="32"
                height="32"
              />
            </Nav.Link>
            {isAuthenticated ? (
              <NavDropdown
                title={address.slice(0, 6) + "......" + address.slice(-6)}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item href="/member/edit">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={disconnect}>
                  Disconnect
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link>
                <Button variant="primary" onClick={connect}>
                  Connect Wallet
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.loadingModal}
      >
        <Modal.Body>
          <span>Welcome to ApeUniverse!</span>
          <br />
          <br />
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;
