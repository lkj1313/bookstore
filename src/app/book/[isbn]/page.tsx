"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookInfo } from "@/components/book/BookInfo";
import { BookPrice } from "@/components/book/BookPrice";
import { BookDelivery } from "@/components/book/BookDelivery";
import BookCart from "@/components/book/BookCart";

interface PageProps {
  params: {
    isbn: string;
  };
}
interface Book {
  author?: string;
  description?: string;
  discount?: string;
  image?: string;
  isbn?: string;
  link?: string;
  pubdate?: string;
  publisher?: string;
  title?: string;
}

const BookPage = (props: PageProps) => {
  const { isbn } = props.params;
  const [book, setBook] = useState<Book>({});

  useEffect(() => {
    if (isbn) {
      const fetchBook = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9999/search/book`,
            {
              params: { query: isbn, display: 1 },
            }
          );
          setBook(response.data.items[0]);
        } catch (error) {
          console.error("Error fetching book data:", error);
        }
      };

      fetchBook();
    }
  }, [isbn]);

  return (
    <div className="container mt-4 ">
      <div className="row d-flex align-items-stretch">
        <div className="col-4 d-flex flex-column p-0">
          <img
            style={{
              width: "auto",
              height: "100%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
            className="book-image"
            src={book.image}
            alt="Book cover"
          />
        </div>
        <div className="col-6 ms-4 position-relative">
          <div className="row">
            <BookInfo book={book} />
            <BookPrice book={book} />
            <BookDelivery />
          </div>
        </div>
        <BookCart book={book} />
      </div>
    </div>
  );
};

export default BookPage;
