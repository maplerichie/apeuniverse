import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import styles from "../styles/Common.module.scss";
import Avatar from "../components/Avatar";
import Layout from "../components/Layout";
import AssetImage from "../components/AssetImage";
import { User, Collection, Asset } from "../models";

type Props = {
  users: User[];
  collections: Collection[];
};

const Home: NextPage = (props: Props) => {
  return (
    <Layout>
      <main className={styles.main}>
        <h4 className={styles.title}>Members</h4>
        <div className={styles.grid} id="members">
          {props.users.map((user) => (
            <Avatar key={user.id} user={user} />
          ))}
        </div>
        <div id="gallery">
          {props.collections.map((collection) =>
            collection.assets?.length > 0 ? (
              <div id={"collection" + collection.id.toString()}>
                <div className={styles.collectionInfo}>
                  <h4 className={styles.collectionTitle}>{collection.name}</h4>
                  <div className={styles.collectionLinks}>
                    {collection.website ? (
                      <Link href={collection.website}>
                        <a target="_blank" rel="noopener noreferrer">
                          <Image
                            src="/website.png"
                            alt="Official website"
                            width="24"
                            height="24"
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {collection.twitter ? (
                      <Link href={"https://twitter.com/" + collection.twitter}>
                        <a target="_blank" rel="noopener noreferrer">
                          <Image
                            src="/twitter.png"
                            alt="Twitter"
                            width="24"
                            height="24"
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {collection.discord ? (
                      <Link href={collection.discord}>
                        <a target="_blank" rel="noopener noreferrer">
                          <Image
                            src="/discord.png"
                            alt="Discord"
                            width="24"
                            height="24"
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {collection.opensea ? (
                      <Link
                        href={
                          "https://opensea.io/collection/" + collection.opensea
                        }
                      >
                        <a target="_blank" rel="noopener noreferrer">
                          <Image
                            src="/opensea.png"
                            alt="Opensea"
                            width="24"
                            height="24"
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {collection.looksrare ? (
                      <Link
                        href={
                          "https://looksrare.org/collections/" +
                          collection.looksrare
                        }
                      >
                        <a target="_blank" rel="noopener noreferrer">
                          <Image
                            src="/looksrare.png"
                            alt="Looksrare"
                            width="24"
                            height="24"
                          />
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className={styles.galleryContainer}>
                  {collection.assets.map((asset) => (
                    <AssetImage
                      key={asset.assetKey}
                      asset={asset}
                      collection={collection}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )
          )}
        </div>
        <hr />
        <h4 className={styles.title}>About us</h4>
        <div className={styles.aboutus}>
          <p>Probably nothing!</p>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let res = await fetch("http://localhost:3000/api/user");
  const users = await res.json();
  res = await fetch("http://localhost:3000/api/collection");
  const collections = await res.json();
  return {
    props: { users, collections },
  };
};

export default Home;
