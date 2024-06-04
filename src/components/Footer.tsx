"use client";
import React from "react";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";

const Footer = () => {
  const [showContent, setShowContent] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 1000); // 1초 후에 콘텐츠를 보여주기
  }, []);
  return (
    <footer>
      {showContent && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container className="">
            <footer className="footer py-3 " style={{ padding: "0" }}>
              <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">
                    FAQs
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">
                    About
                  </a>
                </li>
              </ul>
              <p className="text-center text-body-secondary">
                © 2024 Company, Inc
              </p>
            </footer>
          </Container>
        </div>
      )}
    </footer>
  );
};

export default Footer;
