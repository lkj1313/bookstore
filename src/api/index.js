import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// .env 파일의 경로를 지정합니다.
dotenv.config({ path: "../../.env" });

const app = express();
const port = 9999;
app.use(cors());

const clientId = process.env.Id;
const clientSecret = process.env.Password;

app.get("/search/book", async (req, res) => {
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
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Vercel의 서버리스 함수로 Express 앱을 사용
export default app;
