"use client";
import React, { useState, useEffect } from "react";
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
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showContent, setShowContent] = useState(false);
  console.log(props);

  const query = decodeURIComponent(props.params.id);
  console.log(books);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://bookstore-phi-five.vercel.app/search/book?query=${query}&display=36`
        );
        const items = response.data.items;
        setBooks(items);
        setShowContent(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [query]);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 12;
  const totalPages = Math.ceil(books.length / itemsPerPage);
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  if (endPage - startPage < 2) {
    if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
      endPage = totalPages;
    } else {
      endPage = Math.min(totalPages, startPage + 2);
      startPage = Math.max(1, endPage - 2);
    }
  }

  return (
    <div>
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
                  className={`page-item ${pageNum === currentPage && "active"}`}
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
      </Container>
    </div>
  );
};

export default SearchResultPage;
