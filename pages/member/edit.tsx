import type { NextPage } from "next";
import Link from "next/link";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Layout from "../../components/Layout";
import styles from "../../styles/Common.module.scss";
import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";

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
    opensea: "",
    looksrare: "",
    message: "",
  });

  useEffect(() => {
    async function auth() {
      const address = localStorage.getItem("address");
      await fetch("http://localhost:3000/api/user/" + address, {
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
    await fetch("http://localhost:3000/api/user", {
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

  const updateAssets = async (e) => {
    setLoading(true);
    await fetch("http://localhost:3000/api/asset/new", {
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
      <main className={styles.main}>
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
            <Form>
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
                  onChange={(e) =>
                    setUser({ ...user, website: e.target.value })
                  }
                  placeholder="Enter URL"
                />
              </Form.Group>

              <hr />
              <br />

              <Form.Group className="mb-3" controlId="formTwitter">
                <Form.Control
                  type="text"
                  value={user.twitter || ""}
                  onChange={(e) =>
                    setUser({ ...user, twitter: e.target.value })
                  }
                  placeholder="@YourTwitterhandle"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDiscord">
                <Form.Control
                  type="text"
                  value={user.discord || ""}
                  onChange={(e) =>
                    setUser({ ...user, discord: e.target.value })
                  }
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

              <hr />
              <br />

              <InputGroup className="mb-3 ">
                <InputGroup.Text
                  id="fromOpensea"
                  style={{ textTransform: "lowercase" }}
                >
                  https://opensea.io/
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={user.opensea ? user.opensea : user.address}
                  onChange={(e) =>
                    setUser({ ...user, opensea: e.target.value })
                  }
                  placeholder="username"
                />
              </InputGroup>

              <InputGroup className="mb-3">
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
              </InputGroup>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Personal Tagline</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  value={user.message || ""}
                  onChange={(e) =>
                    setUser({ ...user, message: e.target.value })
                  }
                  placeholder="Probably nthing!"
                />
              </Form.Group>

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
      </main>
    </Layout>
  );
};

export default MemberEdit;
