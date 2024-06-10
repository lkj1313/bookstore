"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  const signUpWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("회원가입 완료! 로그인해주세요");
      router.push("/login");
      // 회원가입 성공 시 필요한 동작을 수행합니다.
    } catch (error) {
      alert("회원가입실패: 이메일 또는 비밀번호가 잘못되었습니다");
      // 회원가입 실패 시 에러 처리를 수행합니다.
      throw error;
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼새로고침막기
    if (emailPattern.test(email) && email.length > 4 && password.length > 4) {
      signUpWithEmailAndPassword(email, password);
    } else {
      alert("Valid email and password");
    }
  };
  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Signnup</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={email}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ): void => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="d-grid mt-3">
                    <button className="btn btn-primary" type="submit">
                      Signup
                    </button>
                  </div>
                </form>
                <div className="d-grid mt-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
