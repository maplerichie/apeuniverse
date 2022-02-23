import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    address: "0xE34d03b5e76E6617eeF630209C794d9d7a4a7fF1",
    name: "Tester",
    ens: "tester.eth",
    website: "https://example.com/",
    twitter: "tester",
    wechat: "tester",
    discord: "tester#1234",
    opensea: "tester",
    looksrare: "tester",
    message: "Hello world",
    avatarURI: "https://i.insider.com/61cc84b94710b10019c77960",
    status: 1,
  },
  {
    address: "0xE34d03b5e76E6617eeF630209C794d9d7a4a7fF2",
    name: "Tester",
    ens: "tester.eth",
    website: "https://example.com/",
    twitter: "tester",
    wechat: "tester",
    discord: "tester#1234",
    opensea: "tester",
    looksrare: "tester",
    message: "Hello world",
    avatarURI: "https://i.insider.com/61cc84b94710b10019c77960",
    status: 1,
  },
  {
    address: "0xE34d03b5e76E6617eeF630209C794d9d7a4a7fF3",
    name: "Tester",
    ens: "tester.eth",
    website: "https://example.com/",
    twitter: "tester",
    wechat: "tester",
    discord: "tester#1234",
    opensea: "tester",
    looksrare: "tester",
    message: "Hello world",
    avatarURI: "https://i.insider.com/61cc84b94710b10019c77960",
    status: 1,
  },
  {
    address: "0xE34d03b5e76E6617eeF630209C794d9d7a4a7fF4",
    name: "Tester",
    ens: "tester.eth",
    website: "https://example.com/",
    twitter: "tester",
    wechat: "tester",
    discord: "tester#1234",
    opensea: "tester",
    looksrare: "tester",
    message: "Hello world",
    avatarURI: "https://i.insider.com/61cc84b94710b10019c77960",
    status: 1,
  },
];

const collectionData: Prisma.CollectionCreateInput[] = [
  {
    address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
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
    address: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    tokenURI: "https://boredapeyachtclub.com/api/mutants/",
    name: "Mutant Ape Yacht Club",
    website: "https://boredapeyachtclub.com/",
    discord: "https://discord.gg/3P5K3dzgdB",
    twitter: "BoredApeYC",
    opensea: "mutant-ape-yacht-club",
    looksrare: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    status: 1,
  },
];

const assetData: Prisma.AssetCreateInput[] = [
  {
    assetKey: "36f13D1",
    tokenId: 1,
    imageURI:
      "https://lh3.googleusercontent.com/ULjfyo4LJhtV3J9K7lu1xh0YZQBa6WHPp-cwlV2C9sUIyTpgSlv554mh_97fRXsziOIu9xwpukl5NQoDbkE3mlXlWR8zU7qcWQsxVg=w202",

    status: 1,
  },
  {
    assetKey: "36f13D2",
    tokenId: 2,
    imageURI:
      "https://lh3.googleusercontent.com/Czn9y9yAUpvuI6SGoVSnNe29_kZ84Ey_9saCrdpA7a5j2_8IWlUFSBM3_GMkjBPmbG8AS1jWtrzgQG4nCsyAlR_VtEI0fXMeKD8ILA=w202",

    status: 1,
  },
  {
    assetKey: "36f13D3",
    tokenId: 3,
    imageURI:
      "https://lh3.googleusercontent.com/PmEaLtImJTLlgbJKgYenuMAo6e4UTM791ckWPx_zPixAEX6tDzcf5toRwYaRcXzY70W32JEgQjK14MFZZW16lZnbjEwHYN8kAI3GXQ=w202",

    status: 1,
  },
  {
    assetKey: "36f13D4",
    tokenId: 4,
    imageURI:
      "https://lh3.googleusercontent.com/Q4uXff5hD6T91FlaDiqZTpMu-kEgwx6IcUHXsWF_Moq5u6VOvfqKuIXN2_StL78LNiA1YW3e16vnrLq_zqvfOMtK7PLy9AcKGxWr=w202",

    status: 1,
  },
  {
    assetKey: "36f13D5",
    tokenId: 5,
    imageURI:
      "https://lh3.googleusercontent.com/KEDiL3ntKzr2Ta0H3TbcyfJL1OPgd6Y76iUhOqO5q9Rtr2zU-UKmZ4OvKlNF4z6LHcG7-P-xydFn8US1UT9XCg5iMfF6NLdhmt_FJyc=w202",

    status: 1,
  },
  {
    assetKey: "36f13D6",
    tokenId: 6,
    imageURI:
      "https://lh3.googleusercontent.com/k_7lAkcWlwqCJuDWkQeeHNB5Uye8mfbJg_Wrx3g9ejfQ1KuYomf9MgOmzJw6iXzo0LNsx-xyv7AfZg7BQoCLtunTVH5SvZrrAkGy7w=w202",

    status: 1,
  },
  {
    assetKey: "36f13D7",
    tokenId: 7,
    imageURI:
      "https://lh3.googleusercontent.com/EE4wtZaiUGD01e9O1S34q403G9zlJ4ByPspsTFn5G85yx0iwWbv3fGRbfqMs2yorB3OjFqKvTL6rTtP3mkrOSVRixYvhyAlV3ikBRQ=w202",

    status: 1,
  },
  {
    assetKey: "36f13D8",
    tokenId: 8,
    imageURI:
      "https://lh3.googleusercontent.com/v0tOsDJK6Lwfy0Hw7gq7iB-vdmxOm6P9sL0XZIijWRb2K5wZir-JF6pCSkxcaO1yQTkJACiGWuBAPlk6gUrrL9E24EWJzN_VJUNf5A=w202",

    status: 1,
  },
  {
    assetKey: "36f13D9",
    tokenId: 9,
    imageURI:
      "https://lh3.googleusercontent.com/RTfmPFKeHEk-KU2G4u44Q-t0QysY-5qKEntiNjWwC3sTvluRS-uiF-DAOGPM_Yfvd-cOoOpFSvUxYOxcTO5R7ohyPaLiD41Na6yAhQ=w202",

    status: 1,
  },
  {
    assetKey: "36f13D11",
    tokenId: 11,
    imageURI:
      "https://lh3.googleusercontent.com/9zN9y4F70N43-zUCKwMYsbw_prZOaH_3ooJFHwXdA31vYQyyATXoSwDw4wqR_wFuR8fAjS3ZCwJBhfgEE0icvouysXicAdHF4rLN9Q=w202",

    status: 1,
  },
  {
    assetKey: "36f13D12",
    tokenId: 12,
    imageURI:
      "https://lh3.googleusercontent.com/VjcjwhsEOK-JRYdhJ95mXoz6PB3yfnqYRZ8gi7O8_1NAUdUCaKlP-YvHS7LHrsPREHccEnWmtRJ1r2mTqymb8UfuKVTuv6iDc7u8NQ=w202",

    status: 1,
  },
  {
    assetKey: "36f13D13",
    tokenId: 13,
    imageURI:
      "https://lh3.googleusercontent.com/RTG6wfenJRDgAkYlP1Pjja2dOZS5ea-6DdRpKTBXE1-IJbvCtm2rX3cP7yNsY1w0FxJB4LJGOuUOqWcpEyqSL-qvkK1ZxEcpbTQ6=w202",

    status: 1,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const c of collectionData) {
    const collection = await prisma.collection.create({
      data: c,
    });
    console.log(`Created collection with id: ${collection.id}`);
  }
  for (const a of assetData) {
    const asset = await prisma.asset.create({
      data: a,
    });
    console.log(`Created asset with id: ${asset.id}`);
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
