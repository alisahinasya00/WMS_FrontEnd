import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./Table.css";

const getStatusStyle = (status) => {
    if (status === "Onaylandi") {
        return { backgroundColor: "#90EE90", color: "green" };
    } else if (status === "Bekliyor") {
        return { backgroundColor: "#FFD700", color: "black" };
    } else if (status === "Reddedildi") {
        return { backgroundColor: "#FF6347", color: "black" };
    } else {
        return { backgroundColor: "#B0C4DE", color: "black" }; // Default color
    }
};

const TableComponent = ({ data, title }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("urunAdi");

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        if (orderBy === "urunAdi" || orderBy === "islemAdi" || orderBy === "calisanAdi") {
            if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
            return 0;
        } else if (orderBy === "urunAdedi" || orderBy === "islemTarihi") {
            if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
            return 0;
        }
        return 0;
    });

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text(title, 20, 10);
        const tableColumn = ["Urun Adi", "Islem Adi", "Tarih", "Calisan Adi", "Adet", "Durum", "Magaza Adi"];
        const tableRows = [];

        sortedData.forEach((row) => {
            const rowData = [
                row.urunAdi,
                row.islemAdi,
                new Date(row.islemTarihi).toLocaleDateString(),
                row.calisanAdi,
                row.urunAdedi,
                row.durum,
                row.magazaAdi,
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`islemler.pdf`);
    };

    return (
        <div className="Table">
            <h3>{title}</h3>
            <button onClick={downloadPDF} style={{ marginBottom: "10px", padding: "8px 16px", backgroundColor: "#00796b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                PDF Olarak İndir
            </button>
            <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #80808029", borderRadius: "12px", background: "#f5f5f5" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "urunAdi"}
                                    direction={orderBy === "urunAdi" ? order : "asc"}
                                    onClick={() => handleRequestSort("urunAdi")}
                                    style={{ color: "#00796b" }}
                                >
                                    Ürün Adı
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="left">
                                <TableSortLabel
                                    active={orderBy === "islemAdi"}
                                    direction={orderBy === "islemAdi" ? order : "asc"}
                                    onClick={() => handleRequestSort("islemAdi")}
                                    style={{ color: "#00796b" }}
                                >
                                    İşlem Adı
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="left">
                                <TableSortLabel
                                    active={orderBy === "islemTarihi"}
                                    direction={orderBy === "islemTarihi" ? order : "asc"}
                                    onClick={() => handleRequestSort("islemTarihi")}
                                    style={{ color: "#00796b" }}
                                >
                                    Tarih
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="left">
                                <TableSortLabel
                                    active={orderBy === "calisanAdi"}
                                    direction={orderBy === "calisanAdi" ? order : "asc"}
                                    onClick={() => handleRequestSort("calisanAdi")}
                                    style={{ color: "#00796b" }}
                                >
                                    Çalışan Adı
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="left">
                                <TableSortLabel
                                    active={orderBy === "urunAdedi"}
                                    direction={orderBy === "urunAdedi" ? order : "asc"}
                                    onClick={() => handleRequestSort("urunAdedi")}
                                    style={{ color: "#00796b" }}
                                >
                                    Adet
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="left">Durum</TableCell>
                            <TableCell align="left">Mağaza Adı</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index} style={{ borderRadius: "8px", backgroundColor: "#f0f0f0", marginBottom: "10px" }}>
                                <TableCell>{row.urunAdi}</TableCell>
                                <TableCell align="left">{row.islemAdi}</TableCell>
                                <TableCell align="left">
                                    {new Date(row.islemTarihi).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="left">{row.calisanAdi}</TableCell>
                                <TableCell align="left">{row.urunAdedi}</TableCell>
                                <TableCell align="left">
                                    <span className="status" style={getStatusStyle(row.durum)}>
                                        {row.durum}
                                    </span>
                                </TableCell>
                                <TableCell align="left">{row.magazaAdi}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableComponent;
