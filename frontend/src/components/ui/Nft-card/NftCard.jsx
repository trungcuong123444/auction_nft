import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./nft-card.css";

import Modal from "../Modal/Modal";
import { Skeleton } from "@mui/material";
import img09 from "../../../assets/images/ava-01.png";
import NFTContext from "../../../context/NFTContext";
import Identicon from "../../IdentityIcon";
import ModalPending from "../ModalPending/ModalPending";
import { ethers } from "ethers";
const NftCard = (props) => {
  const { title, tokenId, price, image, owner, seller, load } = props.item;
  const { connectingWithSmartContract, currentAccount } = useContext(NFTContext)
  const [showModal, setShowModal] = useState(false);
  const { sale, click } = props
  const [loaded, setLoaded] = useState(load ? load : false)
  const [sell, setSell] = useState(0)
  const myNFT = currentAccount === seller?.toLowerCase();

  // const amount = ethers.utils.parseUnits(price, "ether")

  const handleBuyNFT = async () => {

    const contract = await connectingWithSmartContract()
    try {
      setShowModal(true)
      const transaction = await contract.createMarketSale(tokenId, { value: ethers.utils.parseUnits(price, "ether") })
      await transaction.wait()
      setSell(1)
    } catch (error) {
      console.log(error);
      setSell(2)
    }
  }

  const handleSellNFT = async () => {
    try {
      setShowModal(true)
      const contract = await connectingWithSmartContract()
      const listing = await contract.getListingPrice();
      const priceEther = ethers.utils.parseUnits(price, "ether")
      const listingPrice = listing.toString();
      const transaction = await contract.reSellToken(tokenId, priceEther, { value: listingPrice })
      await transaction.wait()
      setSell(1)
    } catch (error) {
      console.log(error);
      setSell(2)
    }

  }

  // useEffect(() => {
  //   if (!imageRef.current) {

  //     setIsLoading(true)
  //   } else {

  //     setIsLoading(false)
  //   }
  //   console.log('is load:', isLoading);
  // }, [imageRef.current])

  return (
    <div className="single__nft__card">
      <Link to={`/market/${tokenId}`}>
        <div className="nft__img">
          {!loaded && <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '100%', height: 221 }} />}
          <img src={image} alt="" className="w-100" onLoad={() => setLoaded(true)} style={!loaded ? { display: "none" } : {}} />
        </div>
      </Link>
      <div className="nft__content">

        <h5 className="nft__title">
          <Link to={`/market/${tokenId}`}> {!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '50%' }} /> : title} </Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__img">
            {!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="circular" width={40} height={40} /> : <Identicon address={seller} width={30} />}

          </div>

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <h6>Created By</h6>
              <p>{!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ fontSize: "0.9rem" }} /> : `${seller.substring(0, 4)}...${seller.substring(seller.length - 4)}`}</p>
            </div>

            <div>
              <h6>Current Bid</h6>
              <p>{!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ fontSize: "0.9rem" }} /> : `${price} ETH`} </p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className={`bid__btn d-flex align-items-center gap-1 ${myNFT && "my-nft"}`}
            onClick={() => {
              if (!myNFT) {
                click(props.item)
              }
            }}
          >
            <i className="ri-shopping-bag-line"></i> {myNFT ? "Your NFT" : (sale ? "Sell" : "Place Bid")}
          </button>

          <span className="history__link">
            <Link to="#">View History</Link>
          </span>
        </div>
      </div>

    </div >
  );
};

export default NftCard;
