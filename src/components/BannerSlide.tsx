import Carousel from "react-bootstrap/Carousel";

interface Result {
  author: string;
  description: string;
  discount: string;
  image: string;
  isbn: string;
  link: string;
  pubdate: string;
  publisher: string;
  title: string;
}
interface BannerSlideProps {
  results: Result[];
}

const BannerSlide: React.FC<BannerSlideProps> = ({ results }) => {
  return (
    <div className="position-absoulte">
      <Carousel>
        {results.map((item, index) => (
          <Carousel.Item key={index}>
            <div className="row bannerSlideRowContainer">
              <div className="col-4">
                <img
                  className="d-block position-relative"
                  style={{
                    left: "50px",
                    width: "40%",
                    height: "12rem",
                    margin: "10px",
                    boxSizing: "border-box",
                  }}
                  src={item.image} // 이미지의 URL을 이미지 객체에서 가져옵니다.
                  alt={item.title} // 이미지의 대체 텍스트를 이미지 객체에서 가져옵니다.
                />
              </div>
              <div className="col-8">
                <div style={{ marginTop: "10px", boxSizing: "border-box" }}>
                  <p
                    className="fs-4"
                    style={{
                      marginBottom: "0",
                      marginRight: "10px",
                      width: "80%",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="fw-normal"
                    style={{ marginTop: "20px", marginBottom: "40px" }}
                  >
                    {item.author}
                  </p>
                </div>
              </div>{" "}
              {/* 두 번째 열을 첫 번째 열 안에 포함 */}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSlide;
