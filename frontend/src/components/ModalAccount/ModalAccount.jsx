import React, { useContext, useEffect, useRef, useState } from 'react'
import NFTContext from '../../context/NFTContext'
import Identicon from '../IdentityIcon'
import "./modal-account.css"
import { TbCopy, TbPower } from 'react-icons/tb'
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'
import { ethers } from 'ethers'
import { RiArrowDropRightLine } from "react-icons/ri"
import { Link } from 'react-router-dom'

const ModalAccount = ({ showModal }) => {
    const { currentAccount, balance, disconnectWallet } = useContext(NFTContext)
    const titleRef = useRef()
    const handleDisConnect = () => {
        disconnectWallet()
        showModal(false)
    }

    // titleRef.current.title="Copy"

    const handlleCopy = () => {
        navigator.clipboard.writeText(currentAccount)
        titleRef.current.title = "Copied!"
        setTimeout(() => titleRef.current.title = "Copy", 1000)
    }


    return (
        <div className="modal__wrap" onClick={() => showModal(false)}>
            <div className="modal-profile">
                <div className="header-title d-flex align-items-center">
                    {currentAccount &&
                        (<div className="address-profile d-flex" >
                            <Identicon width={30} address={currentAccount} />  <div className='d-flex align-items-center'>{`${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}`}</div>
                        </div>)
                    }
                    <div className="modal-action d-flex  ">
                        <div className="copy d-flex align-items-center icons" ref={titleRef} title="Copy" onClick={handlleCopy}>
                            <TbCopy />
                        </div>
                        <div className="explore d-flex align-items-center icons" onClick={() => window.open(`https://goerli.etherscan.io/address/${currentAccount}`)}>
                            <HiOutlineArrowTopRightOnSquare />


                        </div>
                        <div className="power d-flex align-items-center icons" onClick={handleDisConnect}>
                            <TbPower />
                        </div>
                    </div>
                </div>
                <div className="balance text-center">
                    {balance} görETH
                </div>
                <div className="button-view-nft w-100">
                    <Link to="/profile">
                        <button className="bid__btn d-flex align-items-center gap-1 create m-auto" type="button" style={{ lineHeight: 'normal', fontWeight: 500, fontSize: 18 }}>
                            View and resell NFTs
                        </button>
                    </Link>
                </div>
                <div className="line" >
                </div>
                <div className="show-history d-flex align-items-center" style={{ lineHeight: "normal", color: "white" }}>
                    <span>Transaction</span> <RiArrowDropRightLine style={{ fontSize: 30 }} />
                </div>
            </div >
        </div>
    )
}

export default ModalAccount