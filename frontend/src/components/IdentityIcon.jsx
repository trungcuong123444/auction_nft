import styled from "@emotion/styled";
import { useContext, useEffect, useRef } from "react";
import NFTContext from "../context/NFTContext";
import jazzicon from "@metamask/jazzicon"

const StyledIdenticon = styled.div`
  display:flex;
  align-items: center;
`;

export default function Identicon({ width, address }) {

  const avatarRef = useRef()
  useEffect(() => {
    const element = avatarRef.current;
    if (element && address) {
      const addr = address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(width, seed) //generates a size 20 icon

      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [address, avatarRef]);


  return <StyledIdenticon ref={avatarRef} />
}
