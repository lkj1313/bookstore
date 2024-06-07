// components/Book/BookPrice.tsx

import React from "react";

interface BookPriceProps {
  book: {
    discount?: string;
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const BookPrice: React.FC<BookPriceProps> = ({ book }) => (
  <div className="col-12 border-bottom p-0 pt-4 pb-4">
    <div className="row centered-row">
      <div className="col-3 label">
        <span>정가</span>
      </div>
      <div className="col-6">
        <span>{`${formatPrice(Number(book.discount))} 원`}</span>
      </div>
    </div>
    <div className="row centered-row">
      <div className="col-3 label font-weight-bold">
        <span>판매가</span>
      </div>
      <div className="col-6 d-flex align-items-center">
        <span className="fs-2 text-danger">
          {`${formatPrice((Number(book.discount) * 90) / 100)} `}
        </span>
        <span className="text-danger">&nbsp;원&nbsp;(10% 할인)</span>
      </div>
    </div>
    <div className="row centered-row">
      <div className="col-3 label">
        <span>포인트</span>
      </div>
      <div className="col-6">
        <span style={{ fontSize: "0.9em" }}>
          {`${formatPrice((Number(book.discount) * 10) / 100)} 원 (10% 적립)`}
        </span>
      </div>
    </div>
  </div>
);
