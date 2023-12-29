import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import NftCard from "../Nft-card/NftCard";
import { NFT__DATA } from "../../../assets/data/data.js";

import "./live-auction.css";
import NFTContext from "../../../context/NFTContext";
import ModalPending from "../ModalPending/ModalPending";
import { ethers } from "ethers";

const LiveAuction = () => {
  const { fetchNFTs, connectingWithSmartContract,balanceOf } = useContext(NFTContext)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(0)
  const handleBuyNFT = async (nft) => {
    const { tokenId, price } = nft
    const contract = await connectingWithSmartContract()
    try {
      setShowModal(true)
      const transaction = await contract.createMarketSale(tokenId, { value: ethers.utils.parseUnits(price, "ether") })
      await transaction.wait()
      balanceOf()
      setMessage(1)
      handleFetchNFT()
      
    } catch (error) {
      console.log(error);
      setMessage(2)
    }
  }
  const [data, setData] = useState(NFT__DATA)
  const handleFetchNFT = async () => {
    const data = await fetchNFTs()
    setData(data)
  }
  useEffect(() => {
    handleFetchNFT()
  }, [])
  return (
    <section>
      {showModal && <ModalPending create={message} close={setShowModal} />}
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {data?.slice(0, 4).map((item, index) => (
            <Col lg="3" md="4" sm="6" className="mb-4" key={index}>
              <NftCard item={item} click={handleBuyNFT} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;
