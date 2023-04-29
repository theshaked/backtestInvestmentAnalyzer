import Navbar from "./Components/Navbar/Navbar";
import NotFound from "./Components/NotFound/NotFound";
import Modal from "./Components/Modal/Modal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import Backtrack from "./Pages/Backtrack/Backtrack";

function App() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <Navbar
        title="Home"
        links={[
          { label: "Home", url: "/" },
          { label: "Backtrack", url: "/backtrack" },
          { label: "Import", url: "/import" },
        ]}
        onClickLogin={() => setIsLoginModalOpen(true)}
        onClickSignUp={() => setIsSignUpModalOpen(true)}
      />
      <div className="flex h-screen flex-col justify-items-stretch bg-background pt-12 ">
        <Routes>
          <Route path="/" element={<NotFound />} />
          <Route path="/backtrack" element={<Backtrack />} />
          <Route path="/import" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Modal isOpen={isSignUpModalOpen} setIsOpen={setIsSignUpModalOpen}>
          <SignUp />
        </Modal>
        <Modal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}>
          <Login />
        </Modal>
      </div>
    </BrowserRouter>
  );
}

export default App;
