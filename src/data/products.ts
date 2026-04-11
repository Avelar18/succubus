import productWhite1 from "@/assets/product-white-1.jpg";
import productWhite2 from "@/assets/product-white-2.jpg";
import productWhite3 from "@/assets/product-white-3.jpg";
import productWhite4 from "@/assets/product-white-4.jpg";
import productWhite5 from "@/assets/product-white-5.jpg";
import productWhite6 from "@/assets/product-white-6.jpg";
import productDark1 from "@/assets/product-dark-1.jpg";
import productDark2 from "@/assets/product-dark-2.jpg";
import productDark3 from "@/assets/product-dark-3.jpg";
import productDark4 from "@/assets/product-dark-4.jpg";
import productDark5 from "@/assets/product-dark-5.jpg";
import productDark6 from "@/assets/product-dark-6.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "harness" | "lingerie" | "acessorio";
  style: "white" | "dark";
  description: string;
  sizes: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  limitedStock?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  // WHITE collection
  {
    id: "w1",
    name: "Conjunto Seda Celestial",
    price: 289,
    image: productWhite1,
    category: "lingerie",
    style: "white",
    description: "Renda francesa delicada com acabamento em seda natural. Sensação de nuvem contra a pele, elegância que abraça seu corpo com suavidade.",
    sizes: ["P", "M", "G", "GG"],
    isNew: true,
    rating: 4.9,
    reviews: 47,
  },
  {
    id: "w2",
    name: "Bralette Aurora",
    price: 199,
    originalPrice: 249,
    image: productWhite2,
    category: "lingerie",
    style: "white",
    description: "Seda italiana com detalhes artesanais. Toque suave e envolvente que celebra a feminilidade com sofisticação.",
    sizes: ["P", "M", "G"],
    isBestseller: true,
    rating: 4.8,
    reviews: 123,
  },
  {
    id: "w3",
    name: "Body Renda Sonho",
    price: 349,
    image: productWhite3,
    category: "lingerie",
    style: "white",
    description: "Renda chantilly francesa com transparência sutil. Uma peça que transforma momentos em memórias.",
    sizes: ["P", "M", "G", "GG"],
    limitedStock: true,
    rating: 5.0,
    reviews: 31,
  },
  {
    id: "w4",
    name: "Ligas Pérola",
    price: 159,
    image: productWhite4,
    category: "acessorio",
    style: "white",
    description: "Detalhes em pérola e laço de cetim. Um toque de romance que completa qualquer look com delicadeza e charme.",
    sizes: ["U"],
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: "w5",
    name: "Robe Nuvem de Seda",
    price: 399,
    originalPrice: 459,
    image: productWhite5,
    category: "lingerie",
    style: "white",
    description: "Seda pura com caimento fluido. Luxo e conforto em cada movimento, como um abraço suave ao amanhecer.",
    sizes: ["P", "M", "G", "GG"],
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "w6",
    name: "Camisola Etérea",
    price: 319,
    image: productWhite6,
    category: "lingerie",
    style: "white",
    description: "Tule bordado à mão com detalhes florais. Transparência delicada que revela com sutileza e encanta com elegância.",
    sizes: ["P", "M", "G"],
    limitedStock: true,
    rating: 4.8,
    reviews: 34,
  },
  // DARK collection
  {
    id: "d1",
    name: "Harness Obsidian",
    price: 359,
    image: productDark1,
    category: "harness",
    style: "dark",
    description: "Couro legítimo com fivelas douradas. Cada detalhe exala poder e confiança. Feito para quem não pede licença.",
    sizes: ["P", "M", "G", "GG"],
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "d2",
    name: "Strappy Shadow",
    price: 279,
    image: productDark2,
    category: "harness",
    style: "dark",
    description: "Tiras de couro com acabamento prateado. Atitude em cada fivela, mistério em cada detalhe.",
    sizes: ["P", "M", "G"],
    isBestseller: true,
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "d3",
    name: "Corset Midnight",
    price: 429,
    originalPrice: 499,
    image: productDark3,
    category: "lingerie",
    style: "dark",
    description: "Mesh premium com correntes delicadas. Estrutura que abraça com firmeza e liberta com elegância.",
    sizes: ["P", "M", "G", "GG"],
    limitedStock: true,
    rating: 4.8,
    reviews: 42,
  },
  {
    id: "d4",
    name: "Choker Dominion",
    price: 129,
    image: productDark4,
    category: "acessorio",
    style: "dark",
    description: "Couro gravado à mão com argola central dourada. Uma declaração silenciosa de quem comanda o jogo.",
    sizes: ["U"],
    isNew: true,
    rating: 4.9,
    reviews: 112,
  },
  {
    id: "d5",
    name: "Calcinha Rendada Noir",
    price: 189,
    image: productDark5,
    category: "lingerie",
    style: "dark",
    description: "Renda negra com detalhes metálicos e fechos artesanais. Sensualidade que não se esconde.",
    sizes: ["P", "M", "G", "GG"],
    isNew: true,
    isBestseller: true,
    rating: 4.8,
    reviews: 93,
  },
  {
    id: "d6",
    name: "Bracelete Spike",
    price: 149,
    originalPrice: 189,
    image: productDark6,
    category: "acessorio",
    style: "dark",
    description: "Couro com spikes de metal. Atitude no pulso. Para quem transforma acessórios em armadura.",
    sizes: ["U"],
    rating: 4.6,
    reviews: 67,
  },
];
