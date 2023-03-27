import Navbar from "./Components/Navbar/Navbar";
import NotFound from "./Components/NotFound/NotFound";

import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  const test = () => {
    console.log("bla");
  };
  return (
    <BrowserRouter>
      <Navbar
        title="Home"
        links={[
          { label: "Home", url: "/" },
          { label: "About", url: "/about" },
          { label: "Contact", url: "/contact" },
        ]}
      />
      <div className="flex h-screen flex-col justify-items-stretch bg-background pt-12 ">
        <Routes>
          <Route path="/home" element={<NotFound />} />
          <Route path="/about" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
