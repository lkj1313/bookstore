import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"; // firebase.js 파일 경로에 맞게 수정
import ModalComponent from "./ModalComponent";
import AverageRating from "./AverageRating";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { onAuthStateChanged } from "firebase/auth";

// 리뷰 타입 정의
export interface Review {
  id: string;
  bookId: string;
  title: string;
  review: string;
  rating: number;
  likes: number; // 추가: 추천수
  timestamp: Timestamp; // Firestore Timestamp 객체
  userId: string;
}

// 책 타입 정의
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

// 컴포넌트 프로퍼티 타입 정의
interface BookReviewProps {
  book: Book;
}

// BookReview 컴포넌트 정의
const BookReview: React.FC<BookReviewProps> = ({ book }) => {
  const [reviews, setReviews] = useState<Review[]>([]); // 리뷰 목록 상태
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [averageRating, setAverageRating] = useState(0); // 평균 평점 상태
  const [likedReviews, setLikedReviews] = useState<string[]>([]); // 좋아요를 누른 리뷰 ID를 저장
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 현재 사용자 ID 상태

  // 현재 사용자 ID 설정
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 리뷰 목록 가져오기
  const fetchReviews = async () => {
    if (book.isbn) {
      const q = query(
        collection(db, "reviews"),
        where("bookId", "==", book.isbn),
        orderBy("timestamp", "desc") // 타임스탬프 기준 내림차순 정렬
      );
      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];
      let totalRating = 0;
      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const review: Review = {
          id: doc.id,
          bookId: reviewData.bookId,
          title: reviewData.title,
          review: reviewData.review,
          rating: reviewData.rating,
          timestamp: reviewData.timestamp,
          likes: reviewData.likes || 0, // likes 필드가 없으면 기본값 0
          userId: reviewData.userId,
        };
        reviewsData.push(review);
        totalRating += review.rating;
      });
      setReviews(reviewsData);
      setAverageRating(
        reviewsData.length ? totalRating / reviewsData.length : 0
      );
    }
  };

  // 책 정보가 변경될 때마다 리뷰 목록을 가져옴
  useEffect(() => {
    fetchReviews();
  }, [book]);

  // 모달 열기
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 리뷰 저장
  const handleSaveReview = async (
    review: string,
    rating: number,
    userId: string
  ) => {
    try {
      // 이미 리뷰를 작성했는지 확인
      const q = query(
        collection(db, "reviews"),
        where("bookId", "==", book.isbn),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("이미 이 책에 대한 리뷰를 작성하셨습니다.");
        return;
      }

      // 리뷰 작성
      await addDoc(collection(db, "reviews"), {
        bookId: book.isbn,
        title: book.title,
        review,
        rating,
        timestamp: Timestamp.now(), // Firestore Timestamp 객체 사용
        likes: 0, // 초기 추천수 0
        userId: userId, // 현재 사용자 ID를 사용
      });
      setShowModal(false);
      fetchReviews(); // 리뷰를 저장한 후 리뷰 목록을 다시 가져옴
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 좋아요 토글
  const handleLike = async (reviewId: string, currentLikes: number) => {
    const alreadyLiked = likedReviews.includes(reviewId);

    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        likes: alreadyLiked ? currentLikes - 1 : currentLikes + 1,
      });

      setLikedReviews((prevLikedReviews) =>
        alreadyLiked
          ? prevLikedReviews.filter((id) => id !== reviewId)
          : [...prevLikedReviews, reviewId]
      );
      fetchReviews(); // 좋아요를 업데이트한 후 리뷰 목록을 다시 가져옵니다.
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId: string) => {
    const confirmDelete = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await deleteDoc(reviewRef);
      fetchReviews(); // 리뷰를 삭제한 후 리뷰 목록을 다시 가져옵니다.
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  // 컴포넌트 렌더링
  return (
    <div
      className="col-12 mt-5 p-0"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <ReviewForm onOpenModal={handleOpenModal} /> {/* 리뷰 작성 폼 */}
      <AverageRating averageRating={averageRating} /> {/* 평균 평점 */}
      <ReviewList
        reviews={reviews}
        bookTitle={book.title || ""}
        onLike={handleLike}
        likedReviews={likedReviews}
        onDelete={handleDeleteReview}
        currentUserId={currentUserId} // 현재 사용자 ID를 전달
      />
      <ModalComponent
        book={book}
        showModal={showModal}
        setShowModal={setShowModal}
        onSave={handleSaveReview}
        currentUserId={currentUserId}
      />
    </div>
  );
};
``;

export default BookReview;
