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
      login(_address);
    } else {
      alert("Something strange occured. Please contact admin.");
    }
  };

  const login = async (_address) => {
    fetch("/api/collection?filter=true", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(async (res) => {
        let requestUrl =
          openseaAssetsApi +
          "?limit=50&owner=" +
          _address +
          "&asset_contract_addresses=" +
          res.join("&asset_contract_addresses=");
        fetch(requestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(async (res) => {
            let assets = [];
            for (let asset of res.assets) {
              assets.push({
                address: asset.asset_contract.address,
                imageURI: asset.image_url,
                tokenId: asset.token_id,
              });
            }
            let postObj = {
              userAddress: _address,
              assets: assets,
            };
            fetch("/api/user", {
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
          })
          .catch((err) => {
            setShow(false);
            alert("Something strange occured");
            console.log("ERROR: GET openseaAssetsApi ==>", err);
          });
      })
      .catch((err) => {
        setShow(false);
        alert("Something strange occured");
        console.log("ERROR: GET api/collection?filter=true ==>", err);
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
          {/* <Nav className="me-auto"> */}
          <Nav style={{ alignItems: "center" }}>
            <Nav.Link
              href="https://twitter.com/apeuniverse_eth"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/twitter.png" alt="Twitter" width="32" height="32" />
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
