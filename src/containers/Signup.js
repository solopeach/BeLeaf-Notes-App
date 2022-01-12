import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Signup.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLibs";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";

export default function Signup() {
  const { userHasAuthenticated } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    console.log(confirmPassword.length);
    console.log(password.length);
    return email.length > 0 && password.length > 0 && confirmPassword > 0;
  }

  function validateConfirmationForm() {
    return confirmCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(email, confirmCode);
      await Auth.signIn(email, password);

      userHasAuthenticated(true);
      alert(
        "You successfully verified your email! Your account is ready to go!"
      );
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="tel"
            class="form-control"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
          />
          <small id="emailHelp" class="form-text text-muted">
            A confirmation code has been sent to your email!
          </small>
        </div>
        <LoaderButton
          type="submit"
          class="btn btn-primary"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <small id="emailHelp" class="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              console.log(e.target.value);
              setPassword(e.target.value);
            }}
          />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={confirmPassword}
            onChange={(e) => {
              console.log(e.target.value);
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <LoaderButton
          type="submit"
          class="btn btn-primary"
          bsSize="large"
          isLoading={isLoading}
        >
          Signup
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
