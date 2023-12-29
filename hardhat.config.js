require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./frontend/src/context/utils/artifacts",
    cache: "./frontend/src/context/utils/cache",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      // accounts: hardhat create
      chainId: 31337,
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/ZDHcjU7yLHOlrhQx6LqF_ipeRsagRYc6",
      accounts: [
        "0ffd27e05ea7fd3e233ea393b7605156569709f174345fbde62d07189501bc1c",
      ],
      chainId: 5,
    },
  },
};
