import "./globals.css";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import MetaPixelInit from "@/components/MetaPixelInit";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const scrollRestoration = "manual";

export const metadata = {
  title: "Photography Easy Guide",
  description: "1,000+ Free Photography Easy Guide",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        {/* Meta Pixel — fires PageView on every page load/navigation */}
        <Suspense>
          <MetaPixelInit />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
