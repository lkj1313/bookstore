"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

interface Book {
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

const SearchResultPage = (props: PageProps) => {
  // 상태 변수를 정의합니다.
  const [books, setBooks] = useState<Book[]>([]); // 검색된 책 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부

  // IntersectionObserver를 관리하는 useRef 훅
  const observer = useRef<IntersectionObserver | null>(null);

  // 마지막 책 요소에 대한 콜백 함수
  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return; // 로딩 중이면 아무 작업도 하지 않음
      if (observer.current) observer.current.disconnect(); // 기존 옵저버 연결 해제
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1); // 현재 페이지를 증가시킴
        }
      });
      if (node) observer.current.observe(node); // 새로운 노드를 옵저버에 등록
    },
    [loading, hasMore]
  );

  const query = decodeURIComponent(props.params.id); // URL에서 검색 쿼리를 디코드

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // 로딩 상태를 true로 설정
      try {
        const response = await axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${query}&display=50&page=${currentPage}`
        );
        const items = response.data.items;
        if (items.length === 0) {
          setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
        } else {
          setBooks((prevBooks) => [...prevBooks, ...items]); // 기존 책 목록에 새로 가져온 책을 추가
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false); // 로딩 상태를 false로 설정
    };

    fetchBooks(); // 데이터를 가져오는 함수 호출
  }, [query, currentPage]); // 검색 쿼리나 현재 페이지가 변경될 때마다 실행

  return (
    <div>
      <Container style={{ marginTop: "30px" }}>
        <div className="row">
          {books.map((book, index) => (
            <div
              className="col-lg-4 col-md-6 col-sm-12 bookListBox"
              key={index}
              ref={books.length === index + 1 ? lastBookElementRef : null} // 마지막 책 요소에 대한 ref 설정
            >
              <div
                className="card"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "10px",
                  border: "0.3px solid #D2E1FF",
                  alignItems: "center",
                  marginBottom: "10px",
                  overflow: "hidden",
                }}
              >
                <Link
                  href={`/book/${book.isbn}`}
                  style={{ height: "65%", width: "100%" }}
                >
                  <img
                    style={{ height: "100%", width: "100%" }}
                    src={book.image}
                    className={`card-img-top img-darken-on-hover `}
                    alt={book.title}
                  />
                </Link>
                <div
                  className="card-body"
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h5
                    className="card-title, rato-paragraph"
                    style={{ marginTop: "10px" }}
                  >
                    {book.title}
                  </h5>
                  <p style={{ fontWeight: "normal" }}>
                    {book.author.replace(/\^/g, ", ")}
                  </p>
                  <span>₩{parseInt(book.discount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>} {/* 로딩 중일 때 표시 */}
      </Container>
    </div>
  );
};

export default SearchResultPage;
