import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// .env 파일의 경로를 지정합니다.
dotenv.config();

const app = express();
app.use(cors());

const clientId = process.env.Id;
const clientSecret = process.env.Password;

app.get("/api/search/book", async (req, res) => {
  try {
    const { query, display } = req.query;
    console.log(req.query);
    const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURI(
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

export default app;
