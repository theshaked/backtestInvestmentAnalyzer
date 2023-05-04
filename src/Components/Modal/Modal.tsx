import { ReactNode } from "react";
import { CloseIcon } from "../../Icons/Icons";
import Button from "../Button/Button";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  children: ReactNode;
}

const Modal = (props: ModalProps) => {
  const visibilityShadowing = props.isOpen
    ? "visible opacity-50"
    : "collapse opacity-0";
  const visibilityModal = props.isOpen
    ? "visible opacity-100 scale-100"
    : "collapse opacity-0 scale-0";

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-screen bg-black transition-opacity duration-300 ease-in-out ${visibilityShadowing}`}
      />
      <div
        className={`fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center transition-all duration-150 ease-in-out  ${visibilityModal}`}
      >
        <div
          aria-hidden={!props.isOpen}
          className="relative z-50 rounded-lg bg-secondary p-1 text-foreground shadow-lg drop-shadow-xl"
        >
          <Button onClick={() => props.setIsOpen(false)}>
            <CloseIcon />
          </Button>
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Modal;
