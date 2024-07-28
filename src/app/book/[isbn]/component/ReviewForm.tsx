import React from "react";

interface ReviewFormProps {
  onOpenModal: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onOpenModal }) => {
  return (
    <div className="card p-4">
      <span style={{ marginBottom: "10px" }}>한줄평</span>
      <button
        type="button"
        style={{
          backgroundColor: "transparent",
          height: "35px",
        }}
        onClick={onOpenModal}
      >
        한줄평 쓰기
      </button>
    </div>
  );
};

export default ReviewForm;
