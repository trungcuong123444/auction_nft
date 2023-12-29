import React, { useContext } from "react";
import NFTContext from "../../../context/NFTContext";

import "../Modal/modal.css";
import nftCard from "../../../assets/images/nfts.svg"

const Modal = () => {
    const { networkError, isConnected, connectWallet, metaMask } = useContext(NFTContext);
    console.log(metaMask);
    const handleChangeNetWork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x5" }]
            });
        } catch (error) {
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: "0x5" }]
                });
            }

        }
    }
    const title = !metaMask ? "Please install metaMask first" : (!isConnected ? "Please connect to metamask" : "Website only support on goerli network")

    return (
        <div className="modal__wrapper">
            <div className="single__modal" style={{ height: "22%" }}>
                <span className="close__modal">

                </span>
                <img src="" alt="" />
                <h6 className="text-center text-light">{title} </h6>
                {metaMask && (<button className="place__bid-btn" onClick={!isConnected ? connectWallet : handleChangeNetWork}>{!isConnected ? "Connect Wallet" : "Switch network"}  </button>)}
            </div>
        </div>
    );
};

export default Modal;
