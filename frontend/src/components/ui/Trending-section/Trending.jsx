import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import { NFT__DATA } from "../../../assets/data/data";
import "./trending.css";

import NftCard from "../Nft-card/NftCard";
import NFTContext from "../../../context/NFTContext";
import { ethers } from "ethers";
import ModalPending from "../ModalPending/ModalPending";

const Trending = () => {
  const { fetchNFTs, connectingWithSmartContract,balanceOf } = useContext(NFTContext)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(0)
  const [data, setData] = useState(NFT__DATA)
  const handleFetchNFT = async () => {
    const data = await fetchNFTs()
    setData(data)
  }
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
  useEffect(() => {
    handleFetchNFT()
  }, [])
  return (
    <section>
      {showModal && <ModalPending create={message} close={setShowModal} />}
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h3 className="trending__title">Trending</h3>
          </Col>

          {data?.slice(0, 8).map((item) => (
            <Col lg="3" md="4" sm="6" key={item.id} className="mb-4">
              <NftCard item={item} click={handleBuyNFT} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Trending;
