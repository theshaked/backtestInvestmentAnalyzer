import { ReactNode, useState } from "react";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  primaryColor?: boolean;
  disabled?: boolean;
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

  const buttonPadding = iconEffects ? "px-1 py-1 m-1" : "px-4 py-1";

  return (
    <button
      className={`${buttonColorHover} ${buttonColorActive} rounded ${buttonPadding} ${buttonColor} fill-foreground text-lg text-foreground transition-all duration-300 ease-out ${buttonHoverEffect} active:scale-95 disabled:bg-slate-400 disabled:text-slate-200 disabled:hover:rounded`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
