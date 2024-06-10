"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

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

interface BookCartProps {
  book: Book;
}

const BookCart: React.FC<BookCartProps> = ({ book }) => {
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    //로그인 했는지 체크 하고 setuserid 변경
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const incrementQuantity = () => {
    // 수량늘리기 함수
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    // 수량줄이기 함수
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!userId) {
      const confirmLogin = window.confirm(
        "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );

      if (confirmLogin) {
        router.push("/login");
      }
      return;
    }

    try {
      // 카트 아이템 컬렉션에서 이미 존재하는 책이 있는지 확인
      const cartItemsRef = collection(db, `users/${userId}/cartItems`);
      const q = query(cartItemsRef, where("book.isbn", "==", book.isbn));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 이미 있는 책이면 수량 업데이트
        querySnapshot.forEach(async (doc) => {
          const newQuantity = doc.data().quantity + quantity;
          await updateDoc(doc.ref, { quantity: newQuantity });
        });
        console.log("Quantity updated for existing book in cart.");
      } else {
        // 책이 없으면 새로 추가
        const docRef = await addDoc(cartItemsRef, { book, quantity });
        console.log("Document written with ID: ", docRef.id);
      }

      const cartPageMove = window.confirm(
        "장바구니에 책이 담겼습니다. 이동하시겠습니까?"
      );
      if (cartPageMove) {
        router.push("/cart");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="card p-4 mb-5" style={{ boxSizing: "border-box" }}>
      <h5 className="card-title">판매중</h5>

      {/* 수량 선택 */}
      <div className="d-flex align-items-center mb-3">
        <label htmlFor="quantity" className="me-2">
          수량
        </label>
        <button
          className="btn btn-outline-secondary me-1"
          onClick={decrementQuantity}
        >
          -
        </button>
        <input
          id="quantity"
          type="number"
          className="form-control text-center"
          value={quantity}
          style={{ width: "60px" }}
          readOnly
        />
        <button
          className="btn btn-outline-secondary ms-1"
          onClick={incrementQuantity}
        >
          +
        </button>
      </div>

      {/* 구매 옵션 */}
      <div className="mb-3">
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={handleAddToCart}
        >
          카트에 넣기
        </button>
        <button type="button" className="btn btn-secondary w-100" disabled>
          바로구매
        </button>
      </div>

      {/* 추가 정보 */}
      <div className="mb-3">
        <ul className="list-unstyled">
          <li className="mb-1">• 해외배송 가능</li>
          <li className="mb-1">• 최저가 보상</li>
          <li className="mb-1">• 문화비소득공제 신청가능</li>
        </ul>
      </div>
    </div>
  );
};

export default BookCart;
