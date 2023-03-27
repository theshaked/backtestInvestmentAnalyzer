import { useState } from "react";

interface ButtonProps {
  onClick: () => void;
  label: string;
  primaryColor?: boolean;
}

const Button = (props: ButtonProps) => {
  const color = props.primaryColor ? "primary" : "secondary";
  const buttonColor = props.primaryColor ? "bg-primary" : "bg-secondary";
  const buttonColorHover = props.primaryColor
    ? "hover:bg-primary-light"
    : "hover:bg-secondary-light";

  const buttonColorActive = props.primaryColor
    ? "active:bg-primary"
    : "active:bg-secondary";

  return (
    <button
      className={`${buttonColorHover} ${buttonColorActive} rounded px-4 py-2 ${buttonColor} text-lg text-foreground transition-all duration-300 ease-out hover:rounded-lg active:scale-95 `}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};

export default Button;
