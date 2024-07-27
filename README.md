# Bookstore 애플리케이션

![Bookstore Logo](https://github.com/lkj1313/bookstore/raw/main/public/favicon.png)

React, NextJs Firebase, TypeScript, Express, 네이버API를 사용하여 만든 웹 기반 북스토어 애플리케이션입니다. 이 애플리케이션은 사용자가 회원가입 및 로그인, 책 검색, 책 상세 정보 보기, 카트에 책 담기 등등의 기능을 제공합니다. 또한 Express를 사용하여 네이버 API를 통합하였습니다.

## 주요 기능

- **사용자 인증**: Firebase 인증을 사용한 안전한 회원 가입 및 로그인.
- **책 검색 및 필터링**: 다양한 기준으로 책을 검색하고 필터링할 수 있습니다.
- **메인 페이지 추천 북 슬라이스**: 주요 추천 책을 슬라이드 형태로 표시합니다.
- **책 상세 정보**: 책의 상세 정보를 확인할 수 있습니다.
- **장바구니**: 선택한 책을 장바구니에 담을수 있습니다.
- **부트스트랩 UI**: 부트스트랩을 사용하여 반응형 디자인을 구현하였습니다.
- **Express와 네이버 API 통합**: Express 서버를 사용하여 네이버 API를 통한 데이터 통합을 구현하였습니다.

## 시작하기

개발 및 테스트 목적으로 로컬 머신에 프로젝트를 설정하는 방법을 설명합니다.

### 필요 사항

- Node.js (버전 14 이상)
- npm 또는 yarn
- Firebase 계정

### 설치

1. 리포지토리를 클론합니다:

   ```bash
   git clone https://github.com/lkj1313/bookstore.git
   cd bookstore
   ```

2. 종속성을 설치합니다:

   ```bash
   npm install
   ```

3. TypeScript 및 관련 패키지를 설치합니다:

   ```bash
   npm install --save-dev typescript @types/react @types/node
   ```

4. 환경 변수 설정 파일 생성:

```bash
   프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 네이버 API의 키를 받아옵니다.
```

5. `tsconfig.json` 파일을 생성합니다:

   ```bash
   npx tsc --init
   ```

6. 개발 서버를 시작합니다:

   ```bash
   npm run dev
   ```

7. 브라우저를 열고 `http://localhost:3000`로 이동합니다.

## 배포

이 애플리케이션은 Vercel을 통해 배포되었습니다. 배포된 애플리케이션은 아래 링크에서 확인할 수 있습니다:

[북스토어 애플리케이션 - Vercel 배포](https://bookstore-phi-five.vercel.app/)

## 사용 방법

<<<<<<< HEAD

### 회원 가입 및 로그인

1. 애플리케이션을 열고 회원 가입 페이지로 이동합니다.
2. 이메일과 비밀번호를 입력하고 회원 가입 버튼을 클릭합니다.
3. 로그인 페이지로 이동하여 이메일과 비밀번호로 로그인합니다.

### 책 검색 및 카트에 담기

1. 검색 바에 책 제목이나 저자를 입력하여 검색합니다.
2. 원하는 책을 선택하여 상세 정보를 확인합니다.
3. 장바구니에 책을 추가합니다.

## 코드 예제

### 책 검색 컴포넌트

```typescript
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
    event.preventDefault(); // 폼 새로고침 막기
    if (emailPattern.test(email) && email.length > 4 && password.length > 4) {
      handleLogin(email, password);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 완료");
      router.push("/");
    } catch (error) {
      alert("로그인 실패: 이메일 또는 비밀번호가 잘못되었습니다");
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
          <div className="col-md-6">
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
                  <Link href="/signup" className="btn btn-primary">
                    Signup
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
```

=======
Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

vercel 주소 :https://bookstore-phi-five.vercel.app/

> > > > > > > 42670ff02b3dc8a022bfc71b698bd1b41704e5f5
