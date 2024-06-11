"use client";
import { useState, useEffect } from "react";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import axios from "axios";
import { useRouter } from "next/navigation";

const Header = () => {
  const [results, setResults] = useState("");
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    //로그아웃
    try {
      const question = confirm("정말 로그아웃 하시겠습니까?");
      if (question) {
        await signOut(auth);
        window.location.href = "/"; // 로그아웃 후 '/'로 새로고침하며 이동
      }
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://bookstore-phi-five.vercel.app/search/book?query=${encodeURI(
          query
        )}&display=5`
      );

      setResults(response.data.items);
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
    router.push(`
    /searchResult/${query}`);
  };

  const handleCartClick = () => {
    // 로그인 상태에서만 카트페이지로 이동 가능하게 만드는 함수
    if (isLoggedIn) {
      router.push("/cart");
    } else {
      const confirmLogin = window.confirm(
        "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
      );

      if (confirmLogin) {
        router.push("/login");
      }
    }
  };

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary ">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              className="faviconImg"
              src="/favicon.png"
              style={{ width: "30px" }}
              alt="logo"
            ></img>
          </Navbar.Brand>
          <Nav.Link className="homeNav" href="/">
            <span className="fw-bold" style={{ marginRight: "" }}>
              Home
            </span>
          </Nav.Link>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout}>
                  <button type="button" className="btn btn-outline-primary">
                    Logout
                  </button>
                </Nav.Link>
              ) : (
                <Nav.Link href="/login">
                  <button type="button" className="btn btn-outline-primary">
                    Login
                  </button>
                </Nav.Link>
              )}
              <Nav.Link onClick={handleCartClick}>
                <button type="button" className="btn btn-outline-primary">
                  Cart
                </button>
              </Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="outline-success">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
};

export default Header;
