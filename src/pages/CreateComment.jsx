import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function CreateComment({ id }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
  });

  // eslint-disable-next-line no-unused-vars
  const { name, comment } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
            name: user.displayName,
            id: uuidv4(),
          });
        } else {
          //navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formDataCopy = {
      ...formData,
    };
    try {
      const docRef = doc(db, `/tweets/${id}`);
      await updateDoc(docRef, {
        comments: arrayUnion(formDataCopy),
      });

      setLoading(false);
      toast.success("Comment is successful...");

      setFormData((prevState) => ({
        ...prevState,
        comment: "",
      }));
    } catch (error) {
      console.log(error);
      toast.error("Try again!!!");
    }

    navigate("/");
  };

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      comment: e.target.value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <div>
        <ul>
          <div className="tweet-container">
            <div className="text-cotainer">
              <strong></strong>
            </div>
            <form onSubmit={onSubmit}>
              <input
                className="aaaaa"
                type="text"
                id="comment"
                placeholder="type some text"
                value={comment}
                onChange={onMutate}
                required
              />
              <input type="submit" value="Submit" />
            </form>
          </div>
        </ul>
      </div>
    </main>
  );
}

export default CreateComment;
