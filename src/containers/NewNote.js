import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewNote.css";
import { API, Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { s3Upload } from "../libs/awsLib";
import axios from "axios";

export default function NewNote() {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    const session = await Auth.currentSession();
    const { email } = session?.idToken?.payload;

    console.log(session);
    console.log(email);
    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      console.log(attachment);
      await axios
        .post(
          "https://45lj50i7w5.execute-api.us-east-1.amazonaws.com/prod/notes",
          { content, attachment, email }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error.response);
        });
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control
            value={content}
            onChange={(e) => setContent(e.target.value)}
            as="textarea"
            rows={3}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          type="submit"
          class="btn btn-primary"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
