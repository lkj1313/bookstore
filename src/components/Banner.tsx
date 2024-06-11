"use client";
import { useState, useEffect } from "react";
import "@/assets/scss/global.scss";
import axios from "axios";
import BannerSlide from "./BannerSlide";
import { Container } from "react-bootstrap";

interface Result {
  author: string;
  description: string;
  discount: string;
  image: string;
  isbn: string;
  link: string;
  pubdate: string;
  publisher: string;
  title: string;
}

const Banner = () => {
  const [query, setQuery] = useState<string>("프론트엔드");
  const [results, setResults] = useState<Result[]>([]);

  const [query2, setQuery2] = useState<string>("건강");
  const [results2, setResults2] = useState<Result[]>([]);

  const [query3, setQuery3] = useState<string>("강아지");
  const [results3, setResults3] = useState<Result[]>([]);
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
    setTimeout(() => {
      setShowContent(true);
    }, 500); // 0.5초 후에 콘텐츠를 보여주기
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/search/book?query=${encodeURI(
          query
        )}&display=5`
      );
      setResults(response.data.items);
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/search/book?query=${encodeURI(
          query2
        )}&display=5`
      );
      setResults2(response.data.items);
    } catch (err: any) {
      console.log(err);
    }
  };
  const fetchData3 = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/search/book?query=${encodeURI(query3)}&display=5`
      );
      setResults3(response.data.items);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className={`fade-in ${showContent ? "show" : ""}`}>
      <Container>
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ marginBottom: "10px", padding: "0" }}>
            프론트엔드 추천 도서
          </h4>
          <div className="m-0" style={{ backgroundColor: "#e5dede" }}>
            <BannerSlide results={results} />
          </div>
        </div>
      </Container>
      <Container>
        <div style={{ padding: "0" }}>
          <h4 style={{ marginTop: "40px", padding: "0" }}>
            건강관련 추천 도서
          </h4>
          <div className=" m-0 " style={{ backgroundColor: "#e5dede" }}>
            <BannerSlide results={results2} />
          </div>
        </div>
      </Container>
      <Container>
        <div style={{ margin: "40px 0px", padding: "0" }}>
          <h4>강아지관련 추천 도서</h4>
          <div style={{ backgroundColor: "#e5dede" }}>
            <BannerSlide results={results3} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
