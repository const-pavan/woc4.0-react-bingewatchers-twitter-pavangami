import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";

function Both() {
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData2, setFormData2] = useState({
    email: "",
    password: "",
  });
  const { email2, password2 } = formData2;
  const navigate = useNavigate();

  const onChange2 = (e) => {
    setFormData2((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email2,
        password2
      );
      if (userCredential.user) {
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Bad user Credentials");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imgUrl:
      "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
  });
  const { name, email, password, imgUrl } = formData;

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
      //console.log(auth.currentUser.uid);
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: imgUrl,
      });

      const formdatacopy = { ...formData };
      delete formdatacopy.password;
      formdatacopy.timestamp = serverTimestamp();
      formdatacopy.uid = auth.currentUser.uid;
      formdatacopy.following = [];
      formdatacopy.followers = [];

      await setDoc(doc(db, "users", user.uid), formdatacopy);

      navigate("/profile");
    } catch (error) {
      toast.error("Something is Wrong!!!");
    }
  };
  return (
    <main>
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true"></input>
        <div className="singup">
          <form onSubmit={onSubmit}>
            <label htmlFor="chk" aria-hidden="true">
              {" "}
              Sing up{" "}
            </label>
            <input
              type="text"
              className="w-input"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
              required
            />
            <input
              type="email"
              className="w-input"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
              required
            />
            <div className="rowseeen">
              <input
                type={showPassword ? "text" : "password"}
                className="w-input"
                placeholder="password"
                id="password"
                value={password}
                onChange={onChange}
                required
              />
              <img
                src={VisibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
            <button>Sing up</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={onSubmit2}>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              type="email"
              className="w-input"
              placeholder="Email"
              id="email2"
              value={email2}
              onChange={onChange2}
            />
            <div className="rowseeen">
              <input
                type={showPassword2 ? "text" : "password"}
                className="w-input"
                placeholder="password"
                id="password2"
                value={password2}
                onChange={onChange2}
              />
              <img
                src={VisibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword2((prev) => !prev)}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>

            <button>Login</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Both;
