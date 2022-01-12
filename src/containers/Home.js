import React from "react";
import "./Home.css";
import NavBar from "../components/NavBar";
import { FaLeaf } from "react-icons/fa";
import { ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLibs";
import axios from "axios";
import { Auth } from "aws-amplify";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
      } catch (e) {
        console.log(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  async function loadNotes() {
    const session = await Auth.currentSession();
    const notesData = [];
    const { email } = session?.idToken?.payload;
    console.log(email);

    const notes = await axios
      .get(
        "https://45lj50i7w5.execute-api.us-east-1.amazonaws.com/prod/notes",
        { params: { email } }
      )
      .then((response) => {
        console.log(response.data);
        const notesData = response.data;
        setNotes(notesData);
        console.log(notesData);
      })
      .catch((error) => {
        console.log(error.response);
      });

    return notesData;
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <ListGroup.Item
          action
          href={`/notes/${note.noteId}`}
          header={note.content.trim().split("\n")[0]}
        >
          {note.content} <br />
          {note.attachment ? "Attachment: " + note.attachment + "\n" : null}
          {"Created: " + new Date(note.createdAt).toLocaleString()}
        </ListGroup.Item>
      ) : (
        <ListGroup.Item action href="/notes/new">
          <h4>
            <b>{"\uFF0B"}</b> Create a new note
          </h4>
        </ListGroup.Item>
      )
    );
  }

  function renderNotes() {
    return (
      <div className="Home">
        <div className="notes">
          <h1>Your Notes</h1>
          <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
        </div>
      </div>
    );
  }

  function renderLander() {
    return (
      <>
        <div className="Home">
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

  return <>{isAuthenticated ? renderNotes() : renderLander()}</>;
}
