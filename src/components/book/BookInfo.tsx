// components/Book/BookInfo.tsx

import React from "react";

interface BookInfoProps {
  book: {
    author?: string;
    publisher?: string;
    pubdate?: string;
    title?: string;
  };
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) {
    return "Date not available";
  }
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
};

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => (
  <div className="col-12 p-0 border-bottom ">
    <h4>{book.title}</h4>
    <div className="mb-4" style={{ fontSize: "15px" }}>
      <span>
        {" "}
        {book.author ? book.author.replace(/\^/g, ", ") : "Unknown Author"}
      </span>
      <span className="mx-3" style={{ userSelect: "none" }}>
        |
      </span>
      <span>{book.publisher}</span>
      <span className="mx-3" style={{ userSelect: "none" }}>
        |
      </span>
      <span>{formatDate(book.pubdate)}</span>
    </div>
  </div>
);
