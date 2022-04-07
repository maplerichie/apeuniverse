import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import styles from "../styles/Common.module.scss";
import Avatar from "../components/Avatar";
import Layout from "../components/Layout";
import { User, Collection } from "../models";
import { Collection as CollectionRow } from "../components/Collection";

type Props = {
  users: User[];
  collections: Collection[];
};

const Home: NextPage = (props: Props) => {
  return (
    <Layout>
      <h4 className={styles.title}>Members</h4>
      <div className={styles.grid} id="members">
        {props.users.map((user, i) => (
          <Avatar key={i.toString()} user={user} />
        ))}
      </div>
      <div id="gallery" style={{ width: "100%" }}>
        {props.collections.map((collection, i) => (
          <CollectionRow key={i.toString()} collection={collection} />
        ))}
      </div>
      <hr />
      <h4 className={styles.title}>About us</h4>
      <div className={styles.aboutus}>
        <p>Probably nothing!</p>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let res = await fetch(process.env.DOMAIN_URL + "api/user");
  const users = await res.json();
  res = await fetch(process.env.DOMAIN_URL + "api/collection");
  const collections = await res.json();
  return {
    props: { users, collections },
  };
};

export default Home;
