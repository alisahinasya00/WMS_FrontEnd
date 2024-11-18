/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './DateTimeDisplay.css';

const DateTimeDisplay = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000); // Her 1 saniyede bir güncellenir

        return () => clearInterval(timer); // Bileşen unmount olduğunda temizlenir
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString("tr-TR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("tr-TR");
    };

    return (
        <motion.div
            className="datetime-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="datetime-card">
                <div className="datetime-header">
                    <h2></h2>
                </div>
                <div className="datetime-date">
                    <span>{formatDate(dateTime)}</span>
                </div>
                <div className="datetime-header">
                    <h2>Saat</h2>
                </div>
                <div className="datetime-time">
                    <span>{formatTime(dateTime)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default DateTimeDisplay;
