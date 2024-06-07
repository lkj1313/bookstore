import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
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
    // 카트에 넣기 클릭시
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
      const docRef = await addDoc(collection(db, `users/${userId}/cartItems`), {
        book,
        quantity,
      });
      console.log("Document written with ID: ", docRef.id);
      router.push("/cart");
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
        <button className="btn btn-info w-100">바로구매</button>
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
