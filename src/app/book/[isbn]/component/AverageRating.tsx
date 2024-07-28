import React from "react";
import StarRatings from "react-star-ratings";

interface AverageRatingProps {
  averageRating: number;
}

const AverageRating: React.FC<AverageRatingProps> = ({ averageRating }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
      }}
    >
      <StarRatings
        rating={Math.round(averageRating)}
        starRatedColor="blue"
        numberOfStars={5}
        name="averageRating"
        starDimension="30px"
        starSpacing="5px"
      />
    </div>
  );
};

export default AverageRating;
