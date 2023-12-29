import React, { useContext, useState } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { NFT__DATA } from "../assets/data/data";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";

import "../styles/nft-details.css";

import { Link } from "react-router-dom";
import NFTContext from "../context/NFTContext";
import { useEffect } from "react";
import { ethers } from "ethers";
import Identicon from "../components/IdentityIcon";
import { Skeleton } from "@mui/material";
import { NFTMarketPlaceAddress } from "../context/constant";
import ModalPending from "../components/ui/ModalPending/ModalPending";

const NftDetails = () => {
  const [nft, setNft] = useState()
  const [showModal, setShowModal] = useState(false)
  const [sell, setSell] = useState(0)
  const { id } = useParams();
  const navigate = useNavigate();
  const { connectingWithSmartContract, balanceOf } = useContext(NFTContext)

  const handleGetNFTDetail = async () => {
    const contract = await connectingWithSmartContract()
    const data = await contract.getMarketItemById(id)

    let item = {}
    item.tokenId = data[0].toNumber()
    item.seller = data[1]
    item.owner = data[2]
    item.price = ethers.utils.formatUnits(
      data[3].toString(),
      "ether"
    );
    item.sold = data[4]
    item.title = data[5]
    item.description = data[6]
    item.startDay = data[7]
    item.endDay = data[8]
    item.image = data[9]
    setNft(item)




  }

  const handleBuyNFT = async () => {

    const contract = await connectingWithSmartContract()
    try {
      setShowModal(true)
      const transaction = await contract.createMarketSale(nft.tokenId, { value: ethers.utils.parseUnits(nft.price, "ether") })
      await transaction.wait()
      balanceOf()
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
      const priceEther = ethers.utils.parseUnits(nft.price, "ether")
      const listingPrice = listing.toString();
      const transaction = await contract.reSellToken(nft.tokenId, priceEther, { value: listingPrice })
      await transaction.wait()
      setSell(1)
    } catch (error) {
      console.log(error);
      setSell(2)
    }

  }


  useEffect(() => {
    handleGetNFTDetail()
  }, [id])

  return (
    <>
      {showModal && <ModalPending close={setShowModal} create={sell} />}
      <CommonSection title={nft?.title} />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              {nft ? (<img
                src={nft?.image}
                alt=""
                className="w-100 single__nft-img"
              />) : (<Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '100%', height: 546 }} />)}

            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                {nft ? (<h2> {nft?.title}</h2>) : (<Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '50%' }} />)}

                <div className=" d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className=" d-flex align-items-center gap-4 single__nft-seen">
                    <span>
                      <i className="ri-eye-line"></i> 234
                    </span>
                    <span>
                      <i className="ri-heart-line"></i> 123
                    </span>
                  </div>

                  <div className=" d-flex align-items-center gap-2 single__nft-more">
                    <span>
                      <i className="ri-send-plane-line"></i>
                    </span>
                    <span>
                      <i className="ri-more-2-line"></i>
                    </span>
                  </div>
                </div>
                <div className="price-seller d-flex " style={{}}>
                  <div className="nft__creator d-flex gap-3 align-items-center">
                    <div className="creator__img">
                      {nft ? (<Identicon width={40} address={nft?.seller} />) : (<Skeleton variant="circular" sx={{ bgcolor: '#ffffffaf' }} width={40} height={40} />)}
                    </div>

                    <div className="creator__detail">
                      <p>Created By</p>
                      {nft ? (<h6>{`${nft?.seller.substring(0, 4)}...${nft?.seller.substring(nft?.seller.length - 4)}`}</h6>) : (<Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '100%' }} />)}

                    </div>
                  </div>

                  <div className="nft__creator d-flex gap-3 align-items-center" style={{ marginLeft: "5em" }}>
                    <div className="creator__detail d-flex align-items-center" style={{ justifyContent: 'space-between', width: '10em' }}>
                      <p>Current Bid</p>
                      {nft ? (<h6>{nft.price} ETH</h6>) : (<Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '100%' }} />)}
                    </div>
                  </div>
                </div>


                <p className="my-4">{nft?.description}</p>

                <button className="singleNft-btn d-flex align-items-center gap-2 w-100" onClick={nft?.owner === NFTMarketPlaceAddress ? handleBuyNFT : handleSellNFT}>
                  <i className="ri-shopping-bag-line"></i>
                  <Link to="#" >{nft?.owner === NFTMarketPlaceAddress ? "Place a Bid" : "Resell"}</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <LiveAuction />
    </>
  );
};

export default NftDetails;
