import { ReactNode } from "react";
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
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
            </svg>
          </Button>
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Modal;
