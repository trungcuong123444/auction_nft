import React from "react";
import { CircularProgress } from "@mui/material";
import "../Modal/modal.css";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci"
const ModalPending = ({ create, close }) => {

    return (
        <div className="modal__wrapper">
            <div className="single__modal" style={{ height: "25%", textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div className="modal-pending" style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
                    {create === 0 ? (<>
                    <CircularProgress />
                     <p style={{ marginLeft: 30 }}>Processing...</p></>) : (create === 1 ? (<><CiCircleCheck style={{ color: 'green', fontSize: 30 }} /> <p style={{ marginLeft: 30 }}>Success</p></>) : <><CiCircleRemove style={{ color: 'red', fontSize: 30 }} /> <p style={{ marginLeft: 30 }}>Error</p></>)}
                </div>
                {create !== 0 && <button className="place__bid-btn" onClick={() => close(false)}>Close</button>}
            </div>
        </div>
    );
};

export default ModalPending;
