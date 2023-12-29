import { ethers, Signer } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { create } from "ipfs-http-client";
import Wenb3Modal from "web3modal";
import { NFTMarketPlaceAddress, NFTMarketPlaceABI } from "./constant";
import { pinataApi } from "../pinata/pinataApi";

const client = create("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketPlaceAddress,
    NFTMarketPlaceABI,
    signerOrProvider
  );

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [balance, setBalance] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [metaMask, setMetaMask] = useState(true);
  const checkIsConnected = async () => {
    setIsLoading(true);
    if (!window.ethereum) {
      setMetaMask(false);
      console.log("fucl");
    } else {
      console.log("object");
      const networkVersion = window.ethereum.networkVersion;
      const currentNetWork = networkVersion?.toString();

      if (currentNetWork !== "5") {
        setNetworkError(true);
      } else {
        setNetworkError(false);
      }
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        } else {
          setCurrentAccount();
          localStorage.removeItem("isConnect");
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    if (!window.ethereum) {
      setMetaMask(false);
    } else {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          localStorage.setItem(
            "isConnect",
            JSON.stringify({ isConnect: true })
          );
          setIsConnected(true);
        } else {
          console.log("No account found");
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    localStorage.removeItem("isConnect");
    setIsConnected(false);
  };

  const checkFakeConnect = async () => {
    const items = JSON.parse(localStorage.getItem("isConnect"));
    if (items) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", function (accounts) {
      setIsLoading(true);
      setCurrentAccount(accounts[0]);
      setIsLoading(false);
    });

    window.ethereum.on("chainChanged", (networkId) => {
      if (networkId === "0x5") {
        console.log(networkId);
        setNetworkError(false);
      } else {
        setNetworkError(true);
        console.log(typeof networkId);
        console.log("Wtf?");
      }
    });
  }

  // const uploadToIFPS = async (file) => {
  //   try {
  //     const added = await client.add({ content: file });
  //     const url = `https://ipfs.infura.io:5001/ipfs/${added.path}`;
  //     return url;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const createNFT = async (formInput, fileUrl) => {
    const { name, description, price } = formInput;
    if ((!name || !description || !price, !fileUrl))
      return console.log("Please enter all field");
    const data = JSON.stringify({ name, description, iamge: fileUrl });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io:5001/ipfs/${added.path}`;

      await createSale(url, price);
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling) => {
    try {
      const price = new ethers.utils.parseUnits(formInputPrice);
      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.reSellToken(url, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTs = async () => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider();
      const contract = await connectingWithSmartContract();
      const data = await contract.fetchMarketItem();
      console.log("data", data);
      const items = await Promise.all(
        data.map(
          async ({
            tokenId,
            seller,
            owner,
            price: unformattedPrice,
            description,
            deadline,
            target,
            image,
            title,
          }) => {
            // const tokenURI = await contract.tokenURI(tokenId);

            // const res = await axios.get(tokenURI);
            // console.log(res);
            // const { image, title, description } = res.data;
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              title,
              description,
              deadline,
              target,
            };
          }
        )
      );
      console.log(items);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyNFTOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemListed()
          : await contract.fetchMyNFT();
      console.log(data);
      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ethers"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  // const buyNFT = async (nft) => {
  //   try {
  //     const contract = await connectingWithSmartContract();
  //     const price = ethers.utils.parseUnits(nft.price.toString(), "ethers");
  //     const transaction = await contract.createMarketSale(nft.tokenId, {
  //       value: price,
  //     });
  //     await transaction.wait();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const balanceOf = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    const balanceETH = ethers.utils.formatEther(balance);
    setBalance(Number(balanceETH).toFixed(4));
  };

  useEffect(() => {
    checkIsConnected();
    balanceOf();
    checkFakeConnect();
  }, [currentAccount]);

  return (
    <NFTContext.Provider
      value={{
        connectWallet,
        currentAccount,
        setCurrentAccount,
        isLoading,
        metaMask,
        createNFT,
        fetchNFTs,
        fetchMyNFTOrListedNFTs,
        balanceOf,
        connectingWithSmartContract,
        networkError,
        balance,
        isConnected,
        setIsConnected,
        disconnectWallet,
      }}
    >
      {/* <ToastContainer /> */}
      {children}
    </NFTContext.Provider>
  );
};

export default NFTContext;
