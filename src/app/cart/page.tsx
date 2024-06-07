"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"; // Firebase 설정 파일 import
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

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

interface CartItem {
  id: string;
  book: Book;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;

      const querySnapshot = await getDocs(
        collection(db, `users/${userId}/cartItems`)
      );
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartItem[];
      setCartItems(items);
    };

    fetchCartItems();
  }, [userId]);

  const handleDelete = async (id: string) => {
    // 삭제 함수
    if (!userId) return;

    try {
      await deleteDoc(doc(db, `users/${userId}/cartItems`, id));
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        selectedItems.has(item.id)
          ? total + Number(item.book.discount) * item.quantity
          : total,
      0
    );
  };
  const formatPrice = (price: number) => {
    // 숫자를 한국 통화 형식으로 포맷
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleCheckboxChange = (id: string) => {
    //체크박스 상태를 변경하여 선택된 항목의 ID를 추가 또는 제거
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  return (
    <div className="container mt-4">
      <h1>장바구니</h1>
      <div className="row">
        <div className="col-12">
          {cartItems.length === 0 ? (
            <p>장바구니에 상품이 없습니다.</p>
          ) : (
            <div className="list-group mb-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="me-3"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <img
                      src={item.book.image}
                      alt={item.book.title}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "auto" }}
                    />
                    <div className="ms-3">
                      <h5>{item.book.title}</h5>
                      <p>
                        수량:
                        <input
                          type="number"
                          value={item.quantity}
                          className="form-control d-inline-block ms-2"
                          style={{ width: "60px" }}
                          readOnly
                        />
                      </p>
                      <p>
                        {formatPrice(
                          Number(item.book.discount) * item.quantity
                        )}
                        원
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button className="btn btn-primary mb-2">주문하기</button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-end">
          <h5>총 상품금액: {formatPrice(calculateTotal())}원</h5>
          <button className="btn btn-primary">전체 주문하기</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
