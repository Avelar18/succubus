import productWhite1 from "@/assets/product-white-1.jpg";
import productWhite2 from "@/assets/product-white-2.jpg";
import productWhite3 from "@/assets/product-white-3.jpg";
import productDark1 from "@/assets/product-dark-1.jpg";
import productDark2 from "@/assets/product-dark-2.jpg";
import productDark3 from "@/assets/product-dark-3.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "harness" | "lingerie";
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
];
