import Navbar from "./Components/Navbar/Navbar";
import NotFound from "./Components/NotFound/NotFound";
import Modal from "./Components/Modal/Modal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <BrowserRouter>
      <Navbar
        title="Home"
        links={[
          { label: "Home", url: "/" },
          { label: "Backtrack", url: "/backtrack" },
          { label: "Import", url: "/import" },
        ]}
      />
      <div className="flex h-screen flex-col justify-items-stretch bg-background pt-12 ">
        <Routes>
          <Route path="/home" element={<NotFound />} />
          <Route path="/backtrack" element={<NotFound />} />
          <Route path="/import" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <NotFound />
          <NotFound />
        </Modal>
      </div>
    </BrowserRouter>
  );
}

export default App;
