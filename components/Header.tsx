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
    setShow(true);
    let _signer;
    let _address;
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const network = await _provider.getNetwork();
    if (network.chainId !== 1) {
      alert("Please connect to Ethereum Mainnet");
      return;
    }
    _signer = _provider.getSigner();
    _address = await _signer.getAddress();
    if (ethers.utils.isAddress(_address)) {
      login(_signer, _address);
    } else {
      alert("Something strange occured. Please contact admin.");
    }
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
            const message = `Welcome to ApeUniverse.\nNonce: ${res.nonce}\nTimestamp: ${timestamp}`;
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
                    alert(JSON.stringify(res));
                  }
                })
                .catch((err) => {
                  setShow(false);
                  alert(JSON.stringify(err));
                });
            } catch (err) {
              setShow(false);
              alert(err.message);
            }
          } else {
            setShow(false);
            alert("Something strange occured");
          }
        } else {
          setShow(false);
          alert("Something strange occured");
        }
      })
      .catch((err) => {
        console.log("ERROR: GET api/user/[address] ===>", err);
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
          <span>
            Sign a message is not terrible. But it is dangerous that you
            don&apos;t know what you signed!
          </span>
          <br />
          <br />
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;
