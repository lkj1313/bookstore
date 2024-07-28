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
    } catch (error: any) {
      // Firebase 에러 코드에 따른 메시지 처리
      let errorMessage = "회원가입 실패: ";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage += "이미 사용 중인 이메일입니다.";
          break;
        case "auth/invalid-email":
          errorMessage += "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/operation-not-allowed":
          errorMessage += "이메일/비밀번호 계정이 비활성화되었습니다.";
          break;
        case "auth/weak-password":
          errorMessage += "비밀번호가 너무 약합니다.";
          break;
        default:
          errorMessage += error.message;
          break;
      }
      alert(errorMessage);
      throw error; // 에러를 다시 던져서 필요시 호출하는 곳에서 추가로 처리할 수 있도록 합니다.
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
        height: "80vh",
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
                      placeholder="Enter useremail"
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
