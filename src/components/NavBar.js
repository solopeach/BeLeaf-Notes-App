import { Auth } from "aws-amplify";
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useAppContext } from "../libs/contextLibs";
import { useNavigate } from "react-router-dom";

export default function NavBar(props) {
  const { userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    navigate("/login");
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">BeLeaf</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {props.isAuthenticated ? (
              <>
                <Nav.Link href="/settings">Settings</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                {" "}
                <Nav.Link href="/signUp">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
