"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // 폼새로고침막기
    if (emailPattern.test(email) && email.length > 4 && password.length > 4) {
      handleLogin(email, password);
    }
  };
  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 완료");
      router.push("/");
    } catch (error: any) {
      // Firebase 에러 코드에 따른 메시지 처리
      let errorMessage = "로그인 실패: ";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage += "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/user-disabled":
          errorMessage += "사용자 계정이 비활성화되었습니다.";
          break;
        case "auth/user-not-found":
          errorMessage += "해당 이메일 주소의 사용자를 찾을 수 없습니다.";
          break;
        case "auth/wrong-password":
          errorMessage += "잘못된 비밀번호입니다.";
          break;
        default:
          errorMessage += error.message;
          break;
      }
      alert(errorMessage);
    }
  };
  return (
    <div
      style={{
        height: "80vh",
        margin: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center mt-5">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">Login</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      type="email"
                      className="form-control"
                      id="username"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="d-grid mt-3">
                    <button className="btn btn-primary" type="submit">
                      Login
                    </button>
                  </div>
                </form>
                <div className="d-grid mt-3">
                  <Link href="/signup" className="btn btn-secondary">
                    Signup
                  </Link>
                </div>
              </div>
            </div>{" "}
            testId : test@gmail.com password : 123456
          </div>
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Page;
