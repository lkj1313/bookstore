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
  const [results, setResults] = useState<Result[]>([]);
  const [results2, setResults2] = useState<Result[]>([]);
  const [results3, setResults3] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [response1, response2, response3] = await Promise.all([
        axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${encodeURI(
            "프론트엔드"
          )}&display=30`
        ),
        axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${encodeURI(
            "건강"
          )}&display=5`
        ),
        axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${encodeURI(
            "강아지"
          )}&display=5`
        ),
      ]);

      const books = response1.data.items;
      if (books.length < 5) {
        console.log("선택할 수 있는 책이 충분하지 않습니다.");
        setResults(books);
      } else {
        const shuffledBooks = books.sort(() => 0.5 - Math.random());
        const selectedBooks = shuffledBooks.slice(0, 5);
        setResults(selectedBooks);
      }

      setResults2(response2.data.items);
      setResults3(response3.data.items);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setShowContent(true);
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
