"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BookInfo } from "@/app/book/[isbn]/component/BookInfo";
import { BookPrice } from "@/app/book/[isbn]/component/BookPrice";
import { BookDelivery } from "@/app/book/[isbn]/component/BookDelivery";
import BookCart from "@/app/book/[isbn]/component/BookCart";
import BookReview from "./component/BookReview";

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

  const router = useRouter();
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    if (isbn) {
      const fetchBook = async () => {
        try {
          const response = await axios.get(
            `https://bookstore-phi-five.vercel.app/search/book`,
            {
              params: { query: isbn, display: 1 },
            }
          );
          setBook(response.data.items[0]);
          setShowContent(true); // 데이터 로드 완료 후 showContent를 true로 설정
        } catch (error) {
          console.error("Error fetching book data:", error);
        }
      };

      fetchBook();
    }
  }, [isbn, router]);

  return (
    <div className={`fade-in ${showContent ? "show" : ""}`}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-md-4 d-flex flex-column p-0">
            {book.image && ( // book.image가 존재할 경우에만 이미지 렌더링
              <img
                style={{
                  height: "500px",
                  width: "auto",
                  marginBottom: "10px",
                }}
                className="book-image"
                src={book.image}
                alt="Book cover"
              />
            )}
          </div>
          <div className="col-12 col-md-7 ms-md-4 position-relative">
            <div className="row">
              <BookInfo book={book} />
              <BookPrice book={book} />
              <BookDelivery />
            </div>
          </div>
          <div className="col-12 mt-4 p-0">
            <BookCart book={book} />
          </div>
        </div>
        <BookReview book={book} />
      </div>
    </div>
  );
};

export default BookPage;
