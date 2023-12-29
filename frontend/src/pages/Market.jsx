import React, { useContext, useEffect, useState } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/Nft-card/NftCard";

import { NFT__DATA } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";
import NFTContext from "../context/NFTContext";
import axios from "axios";
import { pinataApi } from "../pinata/pinataApi";
import { ethers } from "ethers";
import ModalPending from "../components/ui/ModalPending/ModalPending";
import noNFT from "../assets/images/nfts.svg"
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa"
import { useRef } from "react";

const Market = () => {
  const { fetchNFTs, connectingWithSmartContract, balanceOf } = useContext(NFTContext)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(0)
  const [nfts, setNfts] = useState([])
  const [data, setData] = useState(NFT__DATA);
  const nameRef = useRef()

  const navigate = useNavigate()

  const handleCategory = () => { };

  const handleItems = () => { };

  // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "high") {
      const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

      setData(filterData);
    }

    if (filterValue === "mid") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 5.5 && item.currentBid < 6
      );

      setData(filterData);
    }

    if (filterValue === "low") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setData(filterData);
    }
  };



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

  const handleFetchNFT = async () => {
    const data = await fetchNFTs()
    setData(data)
    setNfts(data)
  }



  useEffect(() => {
    handleFetchNFT()

  }, [])

  const handleChangeSearch = async (e) => {
    const value = e.target.value.toLowerCase()
    const nfts = data.filter((nft, index) => nft.title.toLowerCase().includes(value))
    setNfts(nfts);
  }


  return (
    <>
      {showModal && <ModalPending create={message} close={setShowModal} />}
      <CommonSection title={"MarketPlace"} />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                {/* <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>All Categories</option>
                      <option value="art">Art</option>
                      <option value="music">Music</option>
                      <option value="domain-name">Domain Name</option>
                      <option value="virtual-world">Virtual World</option>
                      <option value="trending-card">Trending Cards</option>
                    </select>
                  </div>

                  <div className="all__items__filter">
                    <select onChange={handleItems}>
                      <option>All Items</option>
                      <option value="single-item">Single Item</option>
                      <option value="bundle">Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="filter__right">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div> */}
                <div className="form__input" style={{ width: "40%", position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Type name on NFTs"

                    onChange={handleChangeSearch}
                  />
                  <FaSearch style={{ color: 'white', position: 'absolute', top: "25%", right: "5%" }} />
                </div>
              </div>
            </Col>

            {nfts.length > 0 ? nfts?.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} click={handleBuyNFT} />
              </Col>
            )) : (<div className="no-nfts">
              <img src={noNFT} alt="" />
              <h2>No NFTs</h2>

            </div>)}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Market;
