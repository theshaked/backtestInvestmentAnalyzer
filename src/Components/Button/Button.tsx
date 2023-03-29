import { ReactNode, useState } from "react";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  primaryColor?: boolean;
}

const Button = (props: ButtonProps) => {
  const iconEffects = typeof props.children != "string";

  const buttonColor = iconEffects
    ? "bg-transparent"
    : props.primaryColor
    ? "bg-primary"
    : "bg-secondary";

  const buttonColorHover = props.primaryColor
    ? "hover:bg-primary-light"
    : "hover:bg-secondary-light";

  const buttonColorActive = props.primaryColor
    ? "active:bg-primary"
    : "active:bg-secondary";

  const buttonHoverEffect = iconEffects
    ? "hover:rounded-full"
    : "hover:rounded-lg";

  const buttonPadding = iconEffects ? "px-2 py-2" : "px-4 py-2";

  return (
    <button
      className={`${buttonColorHover} ${buttonColorActive} rounded ${buttonPadding} ${buttonColor} fill-foreground text-lg text-foreground transition-all duration-300 ease-out ${buttonHoverEffect} active:scale-95 `}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
