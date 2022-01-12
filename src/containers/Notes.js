import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Auth, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { ThemeContext } from "styled-components";
import axios from "axios";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { Form } from "react-bootstrap";
import { s3Upload } from "../libs/awsLib";

export default function Notes() {
  var dingus = "";
  const file = useRef(null);
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadNote() {
      const session = await Auth.currentSession();
      const notesData = {};
      const { email } = session?.idToken?.payload;

      const hello = await axios.get(
        `https://45lj50i7w5.execute-api.us-east-1.amazonaws.com/prod/notes/${id}`,
        { params: { email } }
      );

      setNote(hello);
      setContent(hello.data.content);
      setAttachment(hello.data.attachment);
      console.log(attachment);

      if (hello.data.attachment) {
        var attachmentURL = await Storage.vault.get(hello.data.attachment);
        console.log(attachmentURL);
        setAttachment(attachmentURL);
        console.log(attachmentURL);
      }
    }

    async function onLoad() {
      try {
        await loadNote();
        console.log(attachment);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, []);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function saveNote(note) {
    await axios
      .put(
        `https://45lj50i7w5.execute-api.us-east-1.amazonaws.com/prod/notes/${id}`,
        note
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      const session = await Auth.currentSession();
      const notesData = [];
      const { email } = session?.idToken?.payload;

      await saveNote({
        content,
        attachment: attachment || note.attachment,
        email,
      });
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function deleteNote() {
    const session = await Auth.currentSession();
    const notesData = [];
    const { email } = session?.idToken?.payload;
    await axios
      .delete(
        `https://45lj50i7w5.execute-api.us-east-1.amazonaws.com/prod/notes/${id}`,
        { params: { email } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      navigate("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
      {note && (
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
          {attachment && (
            <Form.Group>
              <Form.Label>
                Attachment <br />
              </Form.Label>
              {" - "}
              <a target="_blank" rel="noopener noreferrer" href={attachment}>
                {formatFilename(note.data.attachment)}
              </a>
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!attachment && <Form.Label>Attachment</Form.Label>}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            className="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
