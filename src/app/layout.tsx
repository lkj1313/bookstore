import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/scss/global.scss";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import ScrollToTop from "./component/utils/ScrollToTop";

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
          <Header />
          <ScrollToTop />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
