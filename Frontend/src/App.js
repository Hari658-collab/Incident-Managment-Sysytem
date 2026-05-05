import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncidentList from "./IncidentList";
import IncidentDetails from "./IncidentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IncidentList />} />
        <Route path="/incident/:id" element={<IncidentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;