import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Button,
  Card,
  Container,
  Modal,
  Spinner,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import styles from "../styles/Common.module.scss";

declare let window: any;
const assetApi = "https://api.opensea.io/api/v1/assets";
const listingApi =
  "https://api.opensea.io/api/v1/asset/{asset_contract_address}/{token_id}/listings";
const osUrl = "https://opensea.io/assets/";
const lrUrl = "https://looksrare.org/collections/";
const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-mainnet.alchemyapi.io/v2/TqeAXaheP1_z1QOWUvOvVjcQl4KvxP0i"
);
const abi = ["function alphaClaimed(uint256) public view returns (bool)"];
const contract = new ethers.Contract(
  "0x025c6da5bd0e6a5dd1350fda9e3b6a614b205a1f",
  abi,
  provider
);

const ApeCoin: NextPage = () => {
  const [timer, setTimer] = useState(null);
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(10000);
  const pageSize = 30;
  const [unclaimed, setUnclaimed] = useState([]);
  const [lastPage, setLastPage] = useState(0);

  const paginate = (array, page_size, page_number) => {
    return array.slice(
      page_number * page_size,
      page_number * page_size + page_size
    );
  };

  const nextPage = () => {
    setPage(page + 1);
    setTempPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
    setTempPage(page - 1);
  };

  const [tempPage, setTempPage] = useState(0);

  const jumpPage = (e) => {
    e.preventDefault();
    let p = parseInt(e.target.value) || 0;
    setTempPage(p);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        if (p >= 0 && p <= lastPage) {
          setPage(p);
        } else {
          return;
        }
      }, 750)
    );
  };

  const refreshUnclaimed = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/apecoin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    setUnclaimed(res.data);
    setLastPage(Math.floor(res.data.length / pageSize));
  };

  const checkClaimed = async (id, isOpensea) => {
    let claimed = await contract.alphaClaimed(parseInt(id));
    if (!claimed) {
      openUrl(id, isOpensea);
    } else {
      await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "api/apecoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: id }),
      }).then((response) => response.json());
      setSelectedTokenId(id);
      setPrompt(true);
    }
  };

  const openUrl = (id, isOpensea) => {
    window.open((isOpensea ? osUrl : lrUrl) + address + "/" + id, "_blank");
    if (prompt) {
      setPrompt(false);
    }
  };

  const closePrompt = () => {
    setPrompt(false);
    refreshUnclaimed();
  };

  useEffect(() => {
    refreshUnclaimed();
  }, []);

  useEffect(() => {
    async function os() {
      setLoading(true);
      let tokenIds = paginate(unclaimed, pageSize, page);
      if (tokenIds.length <= 0) {
        setLoading(false);
        return;
      }
      let requestUrl =
        assetApi +
        "?limit=50&order_direction=asc&include_orders=true&asset_contract_address=" +
        address +
        "&token_ids=" +
        tokenIds.join("&token_ids=");
      await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          setAssets(res.assets);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    os();
  }, [unclaimed, page]);

  return (
    <Layout>
      <h1
        style={{
          textTransform: "initial",
          justifyContent: "center",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div>
          <img
            src="/apecoin.svg"
            style={{ height: "2.75rem" }}
            className="align-bottom"
          />{" "}
          to claim&nbsp;
        </div>
        ({unclaimed.length} BAYC)
      </h1>
      <div className={styles.pageButtons}>
        {page != 0 ? (
          <Button variant="primary" size="lg" onClick={previousPage}>
            Previous
          </Button>
        ) : (
          <></>
        )}
        <span style={{ margin: "0 16px" }}>
          <InputGroup>
            <FormControl
              value={tempPage}
              style={{ width: "56px" }}
              onChange={jumpPage}
            />
            <InputGroup.Text>/{lastPage}</InputGroup.Text>
          </InputGroup>
        </span>
        {page != lastPage ? (
          <Button variant="primary" size="lg" onClick={nextPage}>
            Next
          </Button>
        ) : (
          <></>
        )}
      </div>
      <Container fluid className={styles.cardGrid}>
        {assets.map((asset) => (
          <Card
            className={
              asset.sell_orders != null ? styles.baycCardGlow : styles.baycCard
            }
            key={asset.id}
          >
            <Card.Img variant="top" src={asset.image_preview_url} />
            <Card.Body>
              <Card.Title className={styles.cardTitle}>
                <span>#{asset.token_id}</span>
                {asset.sell_orders != null ? (
                  <span style={{ color: "#0fa" }}>
                    {parseFloat(
                      ethers.utils.formatEther(
                        ethers.BigNumber.from(asset.sell_orders[0].base_price)
                      )
                    ).toFixed(2)}
                    ETH
                  </span>
                ) : (
                  <span style={{ color: "grey" }}>Unlisted</span>
                )}
              </Card.Title>
              <Card.Footer
                style={{ justifyContent: "space-around", display: "flex" }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => checkClaimed(asset.token_id, true)}
                >
                  <img alt="OpenSea" src="/opensea.png" width="32" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => checkClaimed(asset.token_id, false)}
                >
                  <img alt="looksrare" src="/looksrare.png" width="32" />
                </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        ))}
      </Container>
      <div className={styles.pageButtons}>
        {page != 0 ? (
          <Button variant="primary" size="lg" onClick={previousPage}>
            Previous
          </Button>
        ) : (
          <></>
        )}
        <span style={{ margin: "0 16px" }}>
          <InputGroup>
            <FormControl
              value={tempPage}
              style={{ width: "56px" }}
              onChange={jumpPage}
            />
            <InputGroup.Text>/{lastPage}</InputGroup.Text>
          </InputGroup>
        </span>
        {page != lastPage ? (
          <Button variant="primary" size="lg" onClick={nextPage}>
            Next
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Modal
        show={loading}
        backdrop="static"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.loadingModalA}
      >
        <Modal.Body>
          <Spinner animation="grow" />
          <p>Fetching</p>
        </Modal.Body>
      </Modal>

      <Modal
        show={prompt}
        onHide={closePrompt}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={styles.loadingModalA}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p>Sorry, BAYC #{selectedTokenId} already used to claim ApeCoin.</p>
          <div>
            <Button
              variant="secondary"
              onClick={() => openUrl(selectedTokenId, true)}
            >
              <img alt="OpenSea" src="/opensea.png" width="32" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => openUrl(selectedTokenId, false)}
            >
              <img alt="looksrare" src="/looksrare.png" width="32" />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default ApeCoin;
