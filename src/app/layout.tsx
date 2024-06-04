import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/scss/global.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "L's Librarystore",
  description: "L's Library",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            margin: 0,
          }}
        >
          <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
            <Header />
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
