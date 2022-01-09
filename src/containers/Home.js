import React from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import { FaLeaf } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="home">
        <div className="lander">
          <h1>BeLeaf</h1>
          <p>
            A simple note taking app&nbsp;
            <FaLeaf color="green" />
          </p>
        </div>
      </div>
    </>
  );
}
