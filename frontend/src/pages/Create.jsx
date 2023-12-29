import React, { useContext, useState } from "react";

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";
import "../styles/create-item.css";
import { NFTContext } from '../context/NFTContext'
import { CircularProgress } from "@mui/material";
import { useRef } from "react";
import { uploadFileToIPFS, uploadJsonToIPFS } from "../pinata/pinata";
import { ethers } from "ethers";
import ModalPending from "../components/ui/ModalPending/ModalPending";
import { useNavigate } from "react-router-dom";

const item = {
  tokenId: "01",
  title: "Guard",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam adipisci cupiditate officia, nostrum et deleniti vero corrupti facilis minima laborum nesciunt nulla error natus saepe illum quasi ratione suscipit tempore dolores. Recusandae, similique modi voluptates dolore repellat eum earum sint.",
  image: img,
  seller: "Trista Francis",
  // creatorImg: avatar,
  price: 7.89,
  load: true
};



const Create = () => {
  const navigate = useNavigate()
  const { connectingWithSmartContract } = useContext(NFTContext)
  const [imgUrl, setImgUrl] = useState()
  const descriptionRef = useRef()
  const titleRef = useRef()
  const priceRef = useRef()
  const startDayRef = useRef()
  const endDayRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [creating, setCreating] = useState(0)
  // const [success, setSucess] = useState()
  const [showModal, setShowModal] = useState(false)
  const handleChangePreview = async (e) => {
    setIsLoading(true)
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    try {
      const res = await uploadFileToIPFS(file)
      setImgUrl(res)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function uploadMetadataToIPFS() {
    const title = titleRef.current.value
    const price = priceRef.current.value
    const description = descriptionRef.current.value
    const startDay = startDayRef.current.value
    const endDay = endDayRef.current.value
    //Make sure that none of the fields are empty
    if (!title || !description || !price || !imgUrl || !startDay || !endDay)
      return;

    const nftJSON = {
      title, description, price, image: imgUrl, startDay, endDay
    }

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJsonToIPFS(nftJSON);
      console.log(response)
      return response
    }
    catch (e) {
      console.log("error uploading JSON metadata:", e)
    }
  }

  const listNFT = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value
    const price = priceRef.current.value
    const description = descriptionRef.current.value
    const startDay = startDayRef.current.value
    const endDay = endDayRef.current.value
    //Make sure that none of the fields are empty
    if (!title || !description || !price || !imgUrl || !startDay || !endDay)
      return;

    const nftJSON = {
      title, description, price, image: imgUrl, startDay, endDay
    }

    try {
      setShowModal(true)
      setCreating(0)
      const metadataURL = await uploadMetadataToIPFS();
      console.log("Please wait...");
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(priceRef.current.value, 'ether')
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
      let transaction = await contract.createToken(title, description, startDay, endDay, imgUrl, metadataURL, price, { value: listingPrice })
      await transaction.wait()
      console.log("Successfully listed your NFT!");
      setCreating(1)
      // setSucess(true)
    } catch (error) {
      console.log(error);
      console.log("Upload error");
      // setSucess(false)
      setCreating(2)
    }
    // setCreating(false)

  }

  const closeAndNavigate = () => {
    setShowModal(false)
    navigate("/market")
  }

  const handleCreateNFT = async () => {
    const title = titleRef.current.value
    const price = priceRef.current.value
    const description = descriptionRef.current.value

    // await createNFT({ title, price, description }, imgUrl)
  }

  return (
    <>
      {showModal && <ModalPending create={creating} close={closeAndNavigate} />}
      <CommonSection title="Create Item" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              <NftCard item={item} />
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form>
                  <div className="form__input upload">
                    <div className="form-upload">
                      <label htmlFor="">Upload File</label>
                      <div className="upload__input">
                        <input type="file" onChange={handleChangePreview} />
                        <div className="upload-form">
                          <button className="bid__btn d-flex align-items-center gap-1" type="button">
                            <i className="ri-add-circle-line"></i> Upload file
                          </button>
                          <div className="sp">
                            <p>Or</p>
                            <span>Drag image here</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="preview-img">
                      {isLoading ? <CircularProgress /> : (imgUrl && <img className="preview" src={imgUrl} alt="Preview" />)}
                    </div>

                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input ref={priceRef}
                      type="number"
                      placeholder="Enter price for one item (ETH)"
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Minimum Bid</label>
                    <input type="number" placeholder="Enter minimum bid" />
                  </div>

                  <div className=" d-flex align-items-center gap-4">
                    <div className="form__input w-50">
                      <label htmlFor="">Starting Date</label>
                      <input type="date" ref={startDayRef} />
                    </div>

                    <div className="form__input w-50">
                      <label htmlFor="">Expiration Date</label>
                      <input type="date" ref={endDayRef} />
                    </div>
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Enter title" ref={titleRef} />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description</label>
                    <textarea
                      ref={descriptionRef}
                      name=""
                      id=""
                      rows="7"
                      placeholder="Enter description"
                      className="w-100"
                    ></textarea>
                  </div>
                  <button className="bid__btn d-flex align-items-center gap-1 create" type="button" onClick={listNFT}>
                    Create NFT
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
