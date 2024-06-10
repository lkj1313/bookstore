"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
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
  isDeleting?: boolean; // 애니메이션 적용 여부
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showContent, setShowContent] = useState<boolean>(false);

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

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 700); // 0.7초 후에 콘텐츠를 보여주기
  }, []);

  const handleDelete = async (id: string) => {
    if (!userId) return;

    // 애니메이션을 위해 isDeleting 상태를 true로 설정
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isDeleting: true } : item
      )
    );

    // 애니메이션이 끝난 후에 삭제
    setTimeout(async () => {
      try {
        await deleteDoc(doc(db, `users/${userId}/cartItems`, id));
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (e) {
        console.error("Error removing document: ", e);
      }
    }, 1000); // 애니메이션 시간과 맞추기
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

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (!userId) return;

    try {
      const itemDoc = doc(db, `users/${userId}/cartItems`, id);
      await updateDoc(itemDoc, { quantity: newQuantity });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (e) {
      console.error("Error updating quantity: ", e);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart에 상품이 없습니다.</p>
      ) : (
        <div className={`fade-in ${showContent ? "show" : ""}`}>
          <div className="list-group mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={` row list-group-item d-flex justify-content-between align-items-center  ${
                  item.isDeleting ? "fade-out" : ""
                }`}
              >
                <div className="d-flex align-items-center col-9">
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
                        min="1"
                        className="form-control d-inline-block ms-2"
                        style={{ width: "60px" }}
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                      />
                    </p>
                    <p>
                      {formatPrice(Number(item.book.discount) * item.quantity)}{" "}
                      원
                    </p>
                  </div>
                </div>
                <div className="col-3 d-flex flex-column align-items-end">
                  <button className="btn btn-primary mb-2 w-100" disabled>
                    주문하기
                  </button>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleDelete(item.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12 text-end">
          <h5>총 상품금액: {formatPrice(calculateTotal())}원</h5>
          <button className="btn btn-primary" disabled>
            전체 주문하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
