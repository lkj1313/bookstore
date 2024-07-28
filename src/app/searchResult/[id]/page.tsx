"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
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
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const query = decodeURIComponent(props.params.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${query}&display=100`
        );
        const items = response.data.items;
        setBooks(items);
        setShowContent(true); // 데이터를 성공적으로 가져온 후 showContent를 true로 설정
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [query]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemsPerPage = 24;
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const paginationSize = 5;
  const startPage =
    Math.floor((currentPage - 1) / paginationSize) * paginationSize + 1;
  const endPage = Math.min(startPage + paginationSize - 1, totalPages);

  return (
    <div className={`fade-in ${showContent ? "show" : ""}`}>
      <Container style={{ marginTop: "30px" }}>
        <div className="row">
          {books
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((book, index) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 bookListBox"
                key={index}
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
                      className="card-title rato-paragraph"
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
        {totalPages > 1 && (
          <nav
            aria-label="Page navigation example"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ul className="pagination">
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => i + startPage
              ).map((pageNum) => (
                <li
                  className={`page-item ${
                    pageNum === currentPage ? "active" : ""
                  }`}
                  key={pageNum}
                >
                  <a
                    className="page-link"
                    href={`#`}
                    onClick={() => handlePageClick(pageNum)}
                  >
                    {pageNum}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {showScrollToTop && (
          <Button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
              opacity: 0.7,
              transition: "opacity 0.5s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            Scroll to Top
          </Button>
        )}
      </Container>
    </div>
  );
};

export default SearchResultPage;
