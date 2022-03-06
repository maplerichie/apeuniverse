import type { NextPage } from "next";
import Link from "next/link";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Layout from "../../components/Layout";
import styles from "../../styles/Common.module.scss";
import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Image from "next/image";

const MemberEdit: NextPage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: "",
    address: "",
    ens: "",
    website: "",
    twitter: "",
    discord: "",
    wechat: "",
    message: "",
    avatarURI: "",
    status: 0,
  });
  const [pfp, setPfp] = useState("");
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function auth() {
      const address = localStorage.getItem("address");
      await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/user/" + address, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.authenticated) {
            setUser(res.user);
            setPfp(res.user.avatarURI);
            setAuthenticated(true);
          } else {
            localStorage.clear();
            Router.push("/home");
          }
        })
        .catch((err) => console.log(err));
    }
    auth();
  }, []);

  const updateInfo = async (e) => {
    e.preventDefault();
    if (user.ens) {
      if (user.ens.length <= 4 || user.ens.slice(-4) != ".eth") {
        alert("Invalid ENS");
        setUser({ ...user, ens: "" });
        return;
      }
    }
    let userObj = JSON.parse(JSON.stringify(user), (key, value) =>
      value === null || value === "" ? undefined : value
    );
    setLoading(true);
    await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(userObj),
    })
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => alert(JSON.stringify(err)));
  };

  const updatePfp = async (e) => {
    e.preventDefault();
    if (validated) {
      setLoading(true);
      await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ address: user.address, avatarURI: pfp }),
      })
        .then((res) => {
          setUser({ ...user, avatarURI: pfp });
          setLoading(false);
          setShow(false);
        })
        .catch((err) => {
          alert(JSON.stringify(err));
          setLoading(false);
        });
    }
  };

  let expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\.(jpg|jpeg|png|webp|avif|gif|svg)|(https:\/\/\w+.googleusercontent.com\/.+)/gi;
  let pfpRegex = new RegExp(expression);

  const onchangePfp = (e) => {
    e.preventDefault();
    setPfp(e.target.value);
    if (pfpRegex.test(e.target.value)) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  };

  const handleShow = () => {
    if (pfpRegex.test(user.avatarURI)) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    setShow(true);
  };

  const handleClose = () => {
    setPfp(user.avatarURI);
    setShow(false);
  };

  const updateAssets = async (e) => {
    setLoading(true);
    await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/asset/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("id"),
        address: localStorage.getItem("address"),
      }),
    })
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => alert(JSON.stringify(err)));
    e.preventDefault();
  };

  return (
    <Layout>
      <h1 className={styles.title}>
        {router.query.welcome ? (
          <span>Welcome to Ape Universe</span>
        ) : (
          <span>Update Profile</span>
        )}
      </h1>
      {/* <Form.Group className="mb-3" controlId="form">
            <Form.Label></Form.Label>
            <Form.Control type="" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="form">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}
      {isAuthenticated ? (
        <>
          {user.status === 2 ? (
            <h3 style={{ color: "salmon" }}>Members must have BAYC or MAYC!</h3>
          ) : (
            <></>
          )}
          {user.status === 1 && !router.query.welcome ? (
            <div className={styles.pfpContainer} onClick={handleShow}>
              <Image
                src={user.avatarURI || "/user.png"}
                width="192"
                height="192"
                objectFit="cover"
              />
            </div>
          ) : (
            <></>
          )}
          <Form style={{ width: "400px", maxWidth: "90vw" }}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Enter name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={user.address} disabled />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEns">
              <Form.Label>ENS</Form.Label>
              <Form.Control
                type="text"
                value={user.ens || ""}
                onChange={(e) => setUser({ ...user, ens: e.target.value })}
                placeholder="Enter Ethereum Name Service"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWebsite">
              <Form.Label>Personal Website</Form.Label>
              <Form.Control
                type="url"
                value={user.website || ""}
                onChange={(e) => setUser({ ...user, website: e.target.value })}
                placeholder="Enter URL"
              />
            </Form.Group>

            <hr />
            <br />

            <Form.Group className="mb-3" controlId="formTwitter">
              <Form.Control
                type="text"
                value={user.twitter || ""}
                onChange={(e) => setUser({ ...user, twitter: e.target.value })}
                placeholder="@YourTwitterhandle"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDiscord">
              <Form.Control
                type="text"
                value={user.discord || ""}
                onChange={(e) => setUser({ ...user, discord: e.target.value })}
                placeholder="DiscordName#0000"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formWechat">
              <Form.Control
                type="text"
                value={user.wechat || ""}
                onChange={(e) => setUser({ ...user, wechat: e.target.value })}
                placeholder="WeChat ID"
              />
            </Form.Group>

            {/* <InputGroup className="mb-3">
              <InputGroup.Text
                id="fromOpensea"
                style={{ textTransform: "lowercase" }}
              >
                https://looksrare.org/accounts/
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={user.looksrare ? user.looksrare : user.address}
                onChange={(e) =>
                  setUser({ ...user, looksrare: e.target.value })
                }
                placeholder="address"
              />
            </InputGroup>  */}

            <Form.Group controlId="formMessage">
              <Form.Label>Personal message</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                value={user.message || ""}
                onChange={(e) => setUser({ ...user, message: e.target.value })}
                placeholder="Probably nthing!"
              />
            </Form.Group>

            <br />

            <Button
              variant="primary"
              style={{ float: "right" }}
              onClick={isLoading ? null : updateInfo}
            >
              {isLoading ? <Spinner animation="border" /> : "Submit"}
            </Button>
          </Form>
          {/* <Button variant="primary" onClick={isLoading ? null : updateAssets}>
            {isLoading ? <Spinner animation="border" /> : "Refresh assets"}
          </Button> */}
          {router.query.welcome ? (
            <Link href="/home">
              <a>Skip for now</a>
            </Link>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Link href="/home">
          <a>Connect wallet and login first!</a>
        </Link>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.pfpModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update pfp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ width: "400px", maxWidth: "90vw" }}>
            <Form.Group controlId="formPfp">
              <Form.Control
                type="url"
                value={pfp || ""}
                onChange={onchangePfp}
                placeholder="Enter URL (https://......)"
              />
              {validated ? (
                <></>
              ) : (
                <span className={styles.errorField}>
                  Please provide a valid image url
                </span>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={isLoading ? null : updatePfp}>
            {isLoading ? <Spinner animation="border" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default MemberEdit;
