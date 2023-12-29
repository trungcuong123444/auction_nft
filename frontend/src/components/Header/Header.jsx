import React, { useRef, useEffect, useState, useContext } from "react";
import "./header.css";
import { Container } from "reactstrap";
import Skeleton from '@mui/material/Skeleton';
import { NavLink, Link } from "react-router-dom";
import { ethers } from "ethers";
import NFTContext from "../../context/NFTContext";
import Identicon from "../IdentityIcon.jsx";
import { RiArrowDropDownLine } from "react-icons/ri"
import ModalAccount from "../ModalAccount/ModalAccount";


const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  {
    display: "Contact",
    url: "/contact",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const iconRef = useRef()
  const { connectWallet, currentAccount, isLoading, isConnected } = useContext(NFTContext)
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });

    return () => {
      window.removeEventListener("scroll");
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  return (
    <header className="header" ref={headerRef}>
      {showModal && <ModalAccount showModal={setShowModal} />}
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className=" d-flex gap-2 align-items-center ">
              <span>
                <i className="ri-fire-fill"></i>
              </span>
              NFT
            </h2>
          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS?.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5 ">
            {isLoading ?
              <Skeleton sx={{ bgcolor: '#ffffffaf' }} width={120} height={23} />
              : (currentAccount && isConnected ?
                <div className="d-flex">
                  <div className="account d-flex align-items-center" style={{ gridColumnGap: "1rem", columnGap: "1rem", cursor: 'pointer' }} onClick={() => setShowModal((prev) => !prev)}>
                    <Identicon width={30} address={currentAccount} />  {`${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}`}
                    <RiArrowDropDownLine style={{ fontSize: 30 }} className={`${showModal ? "rotate" : "non-rotate"}`} />
                  </div>

                </div> :
                (<button onClick={connectWallet} className="btn d-flex gap-2 align-items-center">
                  <span>
                    <i className="ri-wallet-line"></i>
                  </span>
                  <div>Connect Wallet</div>
                </button>))}

            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
