import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// 환경 변수 로드
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // 모든 도메인에서의 요청을 허용
    methods: ["GET", "POST"], // 허용할 HTTP 메서드
  })
);

const clientId = process.env.Id;
const clientSecret = process.env.Password;

app.get("/book/search", async (req, res) => {
  try {
    const { query, display } = req.query;
    const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
      query
    )}&display=${display}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .send(error.response ? error.response.data : "Internal Server Error");
  }
});

// Vercel의 서버리스 함수로 Express 앱을 사용
export default app;
