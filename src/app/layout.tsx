import type { Metadata } from "next";
import { inter, cinzelDeco, cinzel, caveat } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ChapterProgress from "@/components/ChapterProgress";

export const metadata: Metadata = {
  title: "PROJECT GOTHAM | The Dark Knight Arrives in India",
  description: "An immersive, psychological 3D web experience exploring the philosophy of Batman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${caveat.variable} dark`} style={{ background: 'black' }}>
      <body className="bg-black text-neutral-200 antialiased overflow-x-hidden selection:bg-neutral-800 selection:text-white" suppressHydrationWarning>
        <CustomCursor />
        <ChapterProgress />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
