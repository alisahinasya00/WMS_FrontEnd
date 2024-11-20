/* eslint-disable no-unused-vars */
import React from "react";
import "./RightSide.css";
import CustomerReview from "../CustomerReview/CustomerReview";
import Date from "../DateTime/DateTimeDisplay ";

const RightSide = () => {
    return (
        <div className="RightSide">
            <div>
                <Date />
                <h3>Çalışan İncelemesi</h3>
                <CustomerReview />

            </div>
        </div>
    );
};

export default RightSide;