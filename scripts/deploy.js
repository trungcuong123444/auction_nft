// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, run, network } = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTFactory = await ethers.getContractFactory("NFT");
  console.log("Deploy contract...");
  const NFTContract = await NFTFactory.deploy();
  await NFTContract.deployed();
  console.log("Deploy contract to:" + NFTContract.address);

  // const data = {
  //   address: NFTContract.address,
  //   abi: JSON.parse(NFTContract.interface.format("json")),
  // };

  // fs.writeFileSync("./src/MarketPlace.json", JSON.stringify(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
