import React from "react";
import { Button, Spinner } from "react-bootstrap";
import "./LoaderButton.css";
import { FaSpinner } from "react-icons/fa";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <FaSpinner />}
      {props.children}
    </Button>
  );
}
