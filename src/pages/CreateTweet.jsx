import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
// import aaa from "../assets/jpg/aaa.jpg";
import { getDocs, query, orderBy } from "firebase/firestore";

function CreateTweet({ setTweets, tweets }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tweet: "",
    imgUrl: "",
    comments: [],
  });

  // eslint-disable-next-line no-unused-vars
  const { name, tweet, imgUrl } = formData;

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
            imgUrl: user.photoURL,
          });
        } else {
          navigate("/sign-in");
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
      timestamp: serverTimestamp(),
    };
    try {
      // eslint-disable-next-line
      const docRef = await addDoc(collection(db, "tweets"), formDataCopy);
      setLoading(false);
      toast.success("Tweeted...");

      setFormData((prevState) => ({
        ...prevState,
        tweet: "",
      }));
      const fetchTweets = async () => {
        try {
          const tweetsRef = collection(db, "tweets"); //reference
          //create query
          const q = query(tweetsRef, orderBy("timestamp", "desc"));

          const querySnap = await getDocs(q);

          const tweets = [];

          querySnap.forEach((doc) => {
            return tweets.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setTweets(tweets);
          setLoading(false);
        } catch (error) {
          toast.error("Could not featch tweets");
        }
      };
      fetchTweets();
    } catch (error) {
      toast.error("Try again!!!");
    }

    navigate("/");
  };

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      tweet: e.target.value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="tweet-container">
        <img src={imgUrl} alt="profile" className="img"></img>

        <div className="text-cotainer">
          <strong></strong>
        </div>
        <form onSubmit={onSubmit}>
          <textarea
            className="textarea"
            type="text"
            id="address"
            value={tweet}
            placeholder="type your tweet..."
            onChange={onMutate}
            required
          />
          <input type="submit" value="Tweet" className="tweet" />
        </form>
      </div>
    </>
  );
}

export default CreateTweet;
