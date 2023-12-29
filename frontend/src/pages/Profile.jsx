import { ethers } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import CommonSection from '../components/ui/Common-section/CommonSection'
import ModalPending from '../components/ui/ModalPending/ModalPending'
import NftCard from '../components/ui/Nft-card/NftCard'
import NFTContext from '../context/NFTContext'
import noNFT from "../assets/images/nfts.svg"

const Profile = () => {

  const { connectingWithSmartContract } = useContext(NFTContext)
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(0)
  const [myOwner, setMyOwner] = useState([])
  const navigate = useNavigate()
  const handleGetNFTBuyed = async () => {
    const contract = await connectingWithSmartContract();
    const data = await contract.fetchMyNFT()
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
    setData(items)
  }

  const handleGetNFTCreate = async () => {
    const contract = await connectingWithSmartContract();
    const data = await contract.fetchItemListed()
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
    setMyOwner(items)
  }

  const handleSellNFT = async (nft) => {
    const { price, tokenId } = nft
    try {
      setShowModal(true)
      const contract = await connectingWithSmartContract()
      const listing = await contract.getListingPrice();
      const priceEther = ethers.utils.parseUnits(price, "ether")
      const listingPrice = listing.toString();
      const transaction = await contract.reSellToken(tokenId, priceEther, { value: listingPrice })
      await transaction.wait()
      setMessage(1)
      handleGetNFTBuyed()
    } catch (error) {
      console.log(error);
      setMessage(2)
    }

  }

  useEffect(() => {
    handleGetNFTBuyed()
    handleGetNFTCreate()
  }, [])

  return (
    <>
      {showModal && <ModalPending create={message} close={setShowModal} />}
      <CommonSection title={"My NFT"} />
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="live__auction__top d-flex align-items-center justify-content-between ">
                <h3>My NFT</h3>
                <span>
                  <Link to="/market">Explore more</Link>
                </span>
              </div>
            </Col>
            {data.length > 0 ? data.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} sale={true} click={handleSellNFT} />
              </Col>
            )) : (<div className="no-nfts">
              <img src={noNFT} alt="" />
              <h2>No NFTs</h2>
              <button className="bid__btn d-flex align-items-center gap-1 create" type="button" onClick={() => navigate("/market")}>
                Buy NFTs
              </button>
            </div>)}
            <Col lg="12" className="mb-5">
              <div className="live__auction__top d-flex align-items-center justify-content-between ">
                <h3>My owner</h3>
                <span>
                  <Link to="/market">Explore more</Link>
                </span>
              </div>
            </Col>
            {myOwner.length > 0 ? myOwner.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} sale={true} click={handleSellNFT} />
              </Col>
            )) : (<div className="no-nfts">
              <img src={noNFT} alt="" />
              <h2>No NFTs</h2>
              <button className="bid__btn d-flex align-items-center gap-1 create" type="button" onClick={() => navigate("/create")}>
                Create NFTs
              </button>
            </div>)}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Profile