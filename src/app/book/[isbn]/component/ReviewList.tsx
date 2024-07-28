import React from "react";
import StarRatings from "react-star-ratings";
import { Review } from "./BookReview";
import { Timestamp } from "firebase/firestore";

interface ReviewListProps {
  reviews: Review[];
  bookTitle: string;
  onLike: (reviewId: string, currentLikes: number) => void;
  likedReviews: string[];
  onDelete: (reviewId: string) => void;
  currentUserId: string | null; // 현재 사용자 ID
}

// 타임스탬프를 포맷팅하는 유틸리티 함수
const formatDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate(); // Firestore Timestamp를 JavaScript Date 객체로 변환
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  bookTitle,
  onLike,
  likedReviews,
  onDelete,
  currentUserId,
}) => {
  console.log(currentUserId);
  console.log(reviews);
  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {bookTitle} | {formatDate(review.timestamp)}
            </p>

            <div style={{ display: "flex", alignItems: "center" }}>
              <p>
                <StarRatings
                  rating={review.rating}
                  starRatedColor="blue"
                  numberOfStars={5}
                  name="reviewRating"
                  starDimension="20px"
                  starSpacing="3px"
                />{" "}
              </p>
            </div>
            <p>
              <p>{review.review}</p>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{
                  height: "30px",
                  width: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => onLike(review.id, review.likes)}
              >
                {likedReviews.includes(review.id) ? "❤️" : "♡"} {review.likes}
              </button>
              {review.userId === currentUserId && (
                <button
                  style={{
                    height: "30px",
                    width: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #ccc",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => onDelete(review.id)}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
