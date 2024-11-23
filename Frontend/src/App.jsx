import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";

export default function App() {
  return (
    // Dont Touch this File
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}
