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
