import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { auth } from "@/firebaseConfig"; // firebase.js 파일 경로에 맞게 수정

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

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  book: Book;
  onSave: (review: string, rating: number, userId: string) => void;
}

const ModalComponent: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  book,
  onSave,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  const handleClose = () => setShowModal(false);
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  const handleSave = () => {
    if (currentUserId) {
      onSave(review, rating, currentUserId);
      handleClose();
    } else {
      console.error("User is not logged in");
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#6fadcf", border: "none" }}
      >
        <Modal.Title>한줄평 쓰기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>{book.title}</p>
          <StarRatings
            rating={rating}
            starRatedColor="blue"
            changeRating={handleRatingChange}
            numberOfStars={5}
            name="rating"
            starDimension="30px"
            starSpacing="5px"
          />
          <textarea
            placeholder="한줄평을 써주세요"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              marginTop: "20px",
              padding: "10px",
              boxSizing: "border-box",
            }}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
