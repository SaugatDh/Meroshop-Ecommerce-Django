import { 
  ShoppingBag, 
  User, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  Trash2,
  Shield,
  History,
  MapPin,
  Lock,
  LogOut,
  CheckCircle2,
  Circle
} from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  artisanImage: string;
  image: string;
  rating: number;
  description?: string;
  tag?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Hand-Hammered Singing Bowl',
    price: 185.00,
    category: 'Patan Metalworks',
    artisan: 'Kanti S.',
    artisanImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkDSO2b_Bwl3A30kP51PKv53ExzlE146-OLm3NoknU2bDMkFGXfJsccRgh7JB8swDjSumzn7CGiDhBEboGoNvVLWgFH1VMztUSQrBz-qbFx9RtfwLCBTKNWZZ0gKxe8_2of5OSgT-F7STXTy4mM28C4vVcaNL7gMAghf4rqQ2RI7Gw37QcflYUl2F6Ai5lcjh7HkNvBMWXDG8BVU6X3JgLwBEqsYbZNZBjX33tNXz25shzsGIEDR-LQ2SI_VgSVW0MSx4asCMdrhn2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBo-Z5cPPoV7s-IYqfzzeaZ50bo6X2zvOv6nwpF45ecSrqSTWsLpZLhz3vnSlLaSf67JQV5Fjac6poTIEb3wHXleMi1Kica2yJxOiPm9AeMaGXbeRoCjXzPUy5vbyP2k2C54-5bMt32E_k65r6BbEjrdBAxJgM7gmb8-umdBKeelOhpbgdAbLkiyUERdDGdUsCiWxucsR4MBKswIAd-cclPX1Y8oRGGfZfaOujzY8CuL2Hpi14o_riVr7hD-oPjx6nhMFGEgtWmR5i',
    rating: 4.9,
    tag: 'Hand-Woven'
  },
  {
    id: '2',
    name: 'Pure Cashmere Throw',
    price: 320.00,
    category: 'Highland Textiles',
    artisan: 'Ramesh T.',
    artisanImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QtwWB0VROUJ-imE25cW2vejN6oXC5X7CAdIscmFl8S12UFlR8USuJziiNbqlW5l7kRDofVaG9O7dFlWLSLG7sQnXJhYjWQuyzBv9SMnyYPtSuQ31QHrHOt4l7N1EMnyx0-kSmWqnaviTgfNut5t2REWWuKiXseTCQ0nTVRRqyQF8BhMvcUpA3pKVm117aXkykuSV-Z3B8RSLCgSyxltJ8VzNRlWqmKo_a7x_MQFC23_F84FL2Ix6_tBgl_URO3Ve_u28DThUFB97',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFWaZPSsZ4KknCgD-lYhjubmJOKBO1gvpGh5flAGW2AVD8twq-UTztAg0dUZbQGwDCGfkMbyboRMFQPpeFCtv6JcUzfPfZ8lvB4efjJPFjzj_0zkomBwT8X9OaonzfubNEOUytXxcWpwqtg6dp2NViaa9lfVOqKI1L3vwitGaN7W_IUsuXDY3tp4nXwwxPJi6fX6UGiMMMot18772tsmyBmU2flXbaRnb-dDJSHYC4Dw9uisO_5yLWsxlK6mUJCRD-jgjJWtv47-x',
    rating: 5.0,
    tag: '100% Cashmere'
  },
  {
    id: '3',
    name: 'Stone-Washed Teapot',
    price: 95.00,
    category: 'Thimi Pottery',
    artisan: 'Maya G.',
    artisanImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2XKBuql4XfVwjRkwfKBclWKrXtLvWC3aun3I1H0sU7vQ2AROpe6GJtHX6h7HI1C1ZRVEY7HbgKCat7elJq4d-J5Oqc3w92iHReQBe0xGWiBqQCPcnRCJu9gG2hqsirHwYI1jImpcrZkB_HgujkPPM5UpWctna-ZXX9Wfwq6sQJnPIRMm_N9xJk5opF3JIBvAOyMbUMVacqSltElwFX1Re5I5jAZEIT25ih5tKnBYc8SsFK7GeynwLgbvqrfg1dBOSwlxt28LomviT',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBD8tiLByVwFxyft9m7hKdhoeckQbXMPoE03zis_RSQiPHvGyVy6bouES0MBm2wS8mb6iEGxCUz9akwKYUq31z--LYGsOGWSwsR-16cvouf-FvYEu7DXQLh9G86Ot1vTr6ZTFz7NI3vXKZMmcSeMqWxkC2xej7H6ipqsIXNw591_oF-PaZLQnr9XNn4XKBq7bUlvExaa-7AQnabfWMTejODL4iniY86sXB-JjY_HxiuHdiQlgr6RhiDIe_baYBjDOPRECNxUrdHvBh',
    rating: 4.7,
    tag: 'Natural Dye'
  },
  {
    id: '4',
    name: 'Ganesh Totem Mask',
    price: 150.00,
    category: 'Bhaktabur Carvings',
    artisan: 'Kanti S.',
    artisanImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATFq29q1zIyMYr6IWsn9YrXdpK3L27SFQc7Tpc_KyW9KyKMdx7hZmD0DHK_CJ7tNDRtAv0UgM6gx-bfyhNpCD2FFp0AAeZCekLszDombKCuMVbvEZ6AphFPeUjp3Sqc3uVqa_jDYtZGXQNkx-NPZmbAdDZ1HU8dBw-oP9fThIJyw7JID2QjVmdaLz0-V7f1e3baqyjt3BCHxu0-zUkhM1coGA8Dj-zL7SWb4InctV17wUP0PieRbnhewPiHRO263EcVJDUMYghQh_r',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2alrMQUk3MPkSuA20M3Rjqy1sfWlaIPpOqkt7YSKTU4m791cPZIN3WFI2h2bTxfjGz_VIKpBVEbEd8afQmqk6cyY75ihkVEy_TE9c-KqBLVYWJC0VbN2hDNyy4UefAgyM1G_5KoycytVtnkdmhu4DCmz_vhm6RWAZ2lWwt9XFLBTaGL29JSY9G9z5k9f-HAEktu5VrYwUon3hPsH4uSdjkwnYaYM8-HOu5XpbwbUYPaoIKRFiIlqOEoX4WxTg4_WYpstznaxCF9zh',
    rating: 5.0,
    tag: 'Signature Piece'
  }
];

export { 
  ShoppingBag, 
  User, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  Trash2,
  Shield,
  History,
  MapPin,
  Lock,
  LogOut,
  CheckCircle2,
  Circle
};
