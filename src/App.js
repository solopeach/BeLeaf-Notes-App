import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Home from "./containers/Home";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import GlobalStyle from "./globalStyles";
import NavBar from "./components/NavBar";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import { AppContext } from "./libs/contextLibs";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
    console.log(isAuthenticated);
    console.log(isAuthenticating);
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <>
        <GlobalStyle />
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <BrowserRouter>
            <NavBar isAuthenticated={isAuthenticated} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/signup" element={<Signup />} />
              {isAuthenticated && (
                <>
                  <Route path="/notes/new" element={<NewNote />} />
                  <Route path="/notes/:id" element={<Notes />} />
                  <Route path="/settings" element={<Settings />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
        </AppContext.Provider>
      </>
    )
  );
}

export default App;
