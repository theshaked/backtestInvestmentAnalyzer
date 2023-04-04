import Navbar from "./Components/Navbar/Navbar";
import NotFound from "./Components/NotFound/NotFound";
import Modal from "./Components/Modal/Modal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Components/SignUp/SignUp";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar
        title="Home"
        links={[
          { label: "Home", url: "/" },
          { label: "Backtrack", url: "/backtrack" },
          { label: "Import", url: "/import" },
        ]}
        onClickLogin={() => setIsModalOpen(true)}
        onClickSignUp={() => setIsModalOpen(true)}
      />
      <div className="flex h-screen flex-col justify-items-stretch bg-background pt-12 ">
        <Routes>
          <Route path="/home" element={<NotFound />} />
          <Route path="/backtrack" element={<NotFound />} />
          <Route path="/import" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <SignUp />
        </Modal>
      </div>
    </BrowserRouter>
  );
}

export default App;
