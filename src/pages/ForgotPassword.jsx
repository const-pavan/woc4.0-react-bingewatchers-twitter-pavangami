import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="w-input"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div className="signInBar">
            <button className="button">Send Reset Link</button>
          </div>
          <Link className="forgotPasswordLink" to="/login">
            Log In
          </Link>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
