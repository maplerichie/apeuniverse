import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const collectionData: Prisma.CollectionCreateInput[] = [
  {
    address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenURI: "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/",
    name: "Bored Ape Yacht Club",
    website: "https://boredapeyachtclub.com/",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "boredapeyachtclub",
    looksrare: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    status: 1,
  },
  {
    address: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
    tokenURI: "https://boredapeyachtclub.com/api/mutants/",
    name: "Mutant Ape Yacht Club",
    website: "https://boredapeyachtclub.com/",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "mutant-ape-yacht-club",
    looksrare: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    status: 1,
  },
  {
    address: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623",
    tokenURI: "ipfs://QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR/",
    name: "Bored Ape Kennel Club",
    website: "https://boredapeyachtclub.com/",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "bored-ape-kennel-club",
    looksrare: "0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623",
    status: 1,
  },
  {
    address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    tokenURI: "ipfs://QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR/",
    name: "CryptoPunks",
    website: "https://www.larvalabs.com/cryptopunks",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "cryptopunks",
    looksrare: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    status: 1,
  },
  {
    address: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
    tokenURI: "https://meebits.larvalabs.com/meebit/",
    name: "Meebits",
    website: "https://meebits.larvalabs.com/",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "meebits",
    looksrare: "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7",
    status: 1,
  },
  {
    address: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
    tokenURI: "https://clonex-assets.rtfkt.com/",
    name: "CLONE X",
    website: "http://www.rtfkt.com/",
    discord: "https://discord.gg/RTFKT",
    twitter: "RTFKTstudios",
    opensea: "clonex",
    looksrare: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    status: 1,
  },
  {
    address: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    tokenURI:
      "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/",
    name: "Azuki",
    website: "http://www.azuki.com/",
    discord: "https://discord.gg/azuki",
    twitter: "AzukiZen",
    opensea: "azuki",
    looksrare: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    status: 1,
  },
  {
    address: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
    tokenURI: "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/",
    name: "Doodles",
    website: "https://doodles.app/",
    discord: "https://discord.gg/doodles",
    twitter: "doodles",
    opensea: "doodles-official",
    looksrare: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    status: 1,
  },
  {
    address: "0xe785e82358879f061bc3dcac6f0444462d4b5330",
    tokenURI: "https://wow-prod-nftribe.s3.eu-west-2.amazonaws.com/t/",
    name: "World of Women",
    website: "http://worldofwomen.art/",
    discord: "https://discord.gg/worldofwomen",
    twitter: "worldofwomennft",
    opensea: "world-of-women-nft",
    looksrare: "0xe785E82358879F061BC3dcAC6f0444462D4b5330",
    status: 1,
  },
  {
    address: "0x1a92f7381b9f03921564a437210bb9396471050c",
    tokenURI: "https://api.coolcatsnft.com/cat/",
    name: "Cool Cats",
    website: "http://coolcatsnft.com/",
    discord: "https://discord.gg/X6A4AXrKaR",
    twitter: "coolcatsnft",
    opensea: "cool-cats-nft",
    looksrare: "0x1A92f7381B9F03921564a437210bB9396471050C",
    status: 1,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const c of collectionData) {
    const collection = await prisma.collection.create({
      data: c,
    });
    console.log(`Created ${collection.name} with id: ${collection.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
