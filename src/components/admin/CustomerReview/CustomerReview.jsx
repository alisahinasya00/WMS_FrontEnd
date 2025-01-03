import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const CustomerReview = () => {
    const [data, setData] = useState({
        series: [
            {
                name: "Çalışan İncelemesi",
                data: [],
            },
        ],
        options: {
            chart: {
                type: "area",
                height: "auto",
            },
            fill: {
                colors: ["#fff"],
                type: "gradient",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
                colors: ["#ff929f"],
            },
            tooltip: {
                x: {
                    format: "dd/MM/yy HH:mm",
                },
            },
            grid: {
                show: false,
            },
            xaxis: {
                type: "datetime",
                categories: [], // will be filled by the API response
            },
            yaxis: {
                show: false,
            },
            toolbar: {
                show: false,
            },
        },
    });

    useEffect(() => {
        // Fetch data from the backend with a role parameter
        axios.get('http://localhost:5002/api/Calisan', {
            params: {
                rol: 2 // Set the role parameter based on your backend requirements
            }
        })
            .then((response) => {
                console.log("Response Data:", response.data); // Log the response to check the format

                const reviews = response.data.data; // Extract data from the 'data' property of the response

                // Check if the response is an array
                if (Array.isArray(reviews)) {
                    const categories = reviews.map((review) => {
                        const dateStr = review.iseGirisTarihi;  // Use the correct property name 'iseGirisTarihi'

                        if (dateStr) {
                            const date = new Date(dateStr);
                            if (isNaN(date.getTime())) {
                                console.error("Geçersiz tarih değeri:", dateStr);
                                return null; // Return null for invalid date
                            }
                            return date.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
                        }
                        return null; // Return null if the date is undefined
                    }).filter((category) => category !== null); // Remove null entries for invalid dates

                    const seriesData = reviews.map((review) => review.maas); // Correctly map the 'maas' field

                    console.log("Categories:", categories); // Log categories array to check its content
                    console.log("Series Data:", seriesData); // Log series data to check its content

                    // Ensure that both categories and seriesData are not empty before updating state
                    if (categories.length > 0 && seriesData.length > 0) {
                        setData((prevData) => ({
                            ...prevData,
                            series: [
                                {
                                    name: "Çalışan Maaşı",
                                    data: seriesData,
                                },
                            ],
                            options: {
                                ...prevData.options,
                                xaxis: {
                                    ...prevData.options.xaxis,
                                    categories: categories,
                                },
                            },
                        }));
                    } else {
                        console.error("Eksik veri: Kategoriler veya seri verisi bulunamadı.");
                    }
                } else {
                    console.error("Veri formatı hatalı, beklenen array değil:", reviews);
                }
            })
            .catch((error) => {
                console.error("Veri çekme hatası:", error);
            });
    }, []); // Empty dependency array to run only once on component mount

    return (
        <div className="CustomerReview">
            {data.options.xaxis.categories.length > 0 && data.series[0].data.length > 0 ? (
                <Chart options={data.options} series={data.series} type="area" />
            ) : (
                <p>Veri yükleniyor...</p>
            )}
        </div>
    );
};

export default CustomerReview;
