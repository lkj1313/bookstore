import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";

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
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={`/book/${item.isbn}`}
              passHref
            >
              <div className="row bannerSlideRowContainer img-darken-on-hover d-flex flex-wrap">
                <div className="col-12 col-md-4 d-flex justify-content-center align-items-center p-2">
                  <img
                    className="d-block position-relative"
                    style={{
                      width: "50%",
                      height: "100%",
                      marginLeft: "5px",
                      boxSizing: "border-box",
                    }}
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="col-12 col-md-8 d-flex flex-column ">
                  <div style={{ marginTop: "10px", boxSizing: "border-box" }}>
                    <div className="customLink md-flex">
                      <p
                        className="fs-4 text-center text-md-start"
                        style={{
                          marginBottom: "0",
                          marginRight: "10px",
                          width: "80%",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="fw-normal text-center text-md-start"
                        style={{ marginTop: "20px", marginBottom: "40px" }}
                      >
                        {item.author}
                      </p>
                    </div>
                  </div>{" "}
                </div>
              </div>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerSlide;
