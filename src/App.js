import * as React from "react";
import Box from "@mui/material/Box";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Discover from "./views/Discover";
import Detail from "./views/Detail";
import ManageBookings from "./views/ManageBookings";

export default function App() {
  return (
    <Box>
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/discover" />} />
          <Route exact path="/discover" element={<Discover />} />
          <Route exact path="/discover/:id" element={<Detail />} />
          <Route exact path="/manage" element={<ManageBookings />} />
        </Routes>
      </Router>
    </Box>
  );
}
