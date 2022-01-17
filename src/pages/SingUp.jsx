import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

function SingUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imgUrl:
      "https://images.unsplash.com/photo-1641945511908-4a2ef922b2a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
  });
  const { name, email, password, imgUrl } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: imgUrl,
      });

      const formdatacopy = { ...formData };
      delete formdatacopy.password;
      formdatacopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formdatacopy);

      navigate("/");
    } catch (error) {
      toast.error("Something is Wrong!!!");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back...!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={VisibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          {/*<Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>*/}
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <Link to="/sign-in" className="registerLink">
          Sign In
        </Link>
      </div>
    </>
  );
}

export default SingUp;
