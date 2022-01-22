import Profile from "./pages/Profile";
// import SignIn from "./pages/SignIn";
import Explore from "./pages/Explore";

import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Comment from "./pages/Comment";
import Other from "./pages/Other";
import PrivateRouteOther from "./components/PrivateRouteOther";
import Both from "./pages/Both";
import Users from "./pages/Users";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={} /> */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Explore />} />
          </Route>
          <Route path="/user" element={<PrivateRoute />}>
            <Route path="/user" element={<Users />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/other/:id" element={<PrivateRouteOther />}>
            <Route path="/other/:id" element={<Other />} />
          </Route>
          {/* <Route path="/sign-in" element={<SignIn />} /> */}
          <Route path="/comments/:id" element={<Comment />} />
          {/* <Route path="/sign-up" element={<SingUp />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Both />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
