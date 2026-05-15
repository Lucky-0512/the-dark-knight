import { Inter, Cinzel_Decorative, Cinzel, Caveat } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const cinzelDeco = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const cinzel = Cinzel({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const caveat = Caveat({ 
  subsets: ["latin"],
  variable: "--font-caveat",
});
