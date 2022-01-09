import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Home from "./containers/Home";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import GlobalStyle from "./globalStyles";
import NavBar from "./components/NavBar";
import NotFound from "./containers/NotFound";

function App() {
  return (
    <>
      <GlobalStyle />
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
