/* eslint-disable no-unused-vars */
import { UilEstate } from "@iconscout/react-unicons"
import { CiUser } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { FaBorderNone } from "react-icons/fa";
import { MdOutlineWarehouse, MdWarehouse } from "react-icons/md";
import { CiHome } from "react-icons/ci";
import { BiCategoryAlt } from "react-icons/bi";
import { RiProductHuntLine } from "react-icons/ri";
import { MdOutlineFactory } from "react-icons/md";
import { CiShop } from "react-icons/ci";
import { MdOutlineInsertChartOutlined } from "react-icons/md";
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";
import { AiOutlineStock } from "react-icons/ai";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsBox2 } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";


export const SidebarData = [
    {
        icon: CiHome,
        heading: "Ana Sayfa",
        screen: 'mainDash'
    },
    {
        icon: CiUser,
        heading: "Çalışan işlemleri",
        screen: "calisan"
    },
    {
        icon: BsBox2,
        heading: "Ürün İşlemleri",
        screen: "urun"
    }, {
        icon: CiShop,
        heading: "Mağaza İşlemleri",
        screen: "magaza"
    },
    {
        icon: MdOutlineFactory,
        heading: "Fabrika İşlemleri",
        screen: "fabrika"
    }, {
        icon: MdOutlineWarehouse,
        heading: "Depo işlemleri",
        screen: "depo"
    }, {
        icon: GrTransaction,
        heading: "Giriş/Çıkış Ürünler",
        screen: "siparis"
    },
    {
        icon: MdCategory,
        heading: "Ürün-Kategori İşlemleri",
        screen: "kategori"
    },
];

export const CalisanSidebarData = [
    {
        icon: CiHome,
        heading: "Ana Sayfa",
        screen: 'mainDash'
    },
    {
        icon: CiUser,
        heading: "Bilgilerim",
        screen: "calisan"
    },
    {
        icon: BsBox2,
        heading: "Ürün İşlemleri",
        screen: "urun"
    },
    {
        icon: IoMdAddCircleOutline,
        heading: "Yeni Ürün Kayıt ",
        screen: "urunKayit"
    },
    {
        icon: GrTransaction,
        heading: "Çıkış/İade Ürünler",
        screen: "siparis"
    },
    {
        icon: GrTransaction,
        heading: "Ürün Giriş",
        screen: "siparis2"
    },
];

export const MagazaSidebarData = [
    {
        icon: CiHome,
        heading: "Ana Sayfa",
        screen: 'mainDash'
    },
    {
        icon: CiUser,
        heading: "Bilgilerim",
        screen: "magaza"
    },
    {
        icon: BsBox2,
        heading: "Sipariş ve İade",
        screen: "urun"
    },
    {
        icon: GrTransaction,
        heading: "Siparişler ve İptal",
        screen: "siparis"
    },
];

export const CardsData = [
    {
        title: "Stok",
        color: {
            backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
        },
        barValue: 70,  //yüzde kısmı sonradan ayarlanacak
        value: "25,970",
        png: AiOutlineStock,
        series: [
            {
                name: "Stok",
                data: [31, 40, 28, 51, 42, 109, 100], //sonradan apiden çekilecek
            },
        ],
    },
    {
        title: "Sipariş",
        color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
        },
        barValue: 80,
        value: "14,270",
        png: GrTransaction,
        series: [
            {
                name: "Sipariş",
                data: [10, 100, 50, 70, 80, 30, 40],
            },
        ],
    },
    {
        title: "Ürün",
        color: {
            backGround:
                "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
        },
        barValue: 60,
        value: "4,270",
        png: MdOutlineProductionQuantityLimits,
        series: [
            {
                name: "Ürün",
                data: [10, 25, 15, 30, 12, 15, 20],
            },
        ],
    },
]