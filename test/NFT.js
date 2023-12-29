const { expect } = require("chai");
const { ethers: hardhat } = require("hardhat");
const { ethers } = require("ethers");
describe("NFT", () => {
  it("Get listing price", async () => {
    const NFTMarket = await hardhat.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();

    const listing = await NFTContract.getListingPrice();
    console.log(listing);
    // const recipe = await listing.wait(0);
    // console.log(recipe);
  });
  it("Create NFT", async () => {
    const tokenURI = "https://tokrn";
    const NFTMarket = await hardhat.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const listing = await NFTContract.getListingPrice();
    const listingPrice = listing.toString();
    const amount = ethers.utils.parseUnits("0.00025", "ether");
    const create = await NFTContract.createToken(
      "title",
      "description",
      "startDay",
      "endDay",
      "imgUrl",
      "metadataURL",
      amount,
      { value: listingPrice }
    );
    await create.wait();
    console.log(create);
  });
  it("Fetch nft", async () => {
    const NFTMarket = await hardhat.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const nfts = await NFTContract.fetchMarketItem();
    console.log(nfts);
  });
  it("Get NFT", async () => {
    const NFTMarket = await hardhat.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const nft = await NFTContract.getMarketItemById(0);
    console.log(nft);
  });
  it("Buy NFT", async ()=> {
    const NFTMarket = await hardhat.getContractFactory("NFT");
    const NFTContract = await NFTMarket.deploy();
    await NFTContract.deployed();
    const nft = await NFTContract.createMarketSale(1);
  })
});
