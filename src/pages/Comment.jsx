import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateComment from "./CreateComment";

function Comment() {
  const params = useParams();
  const s = params.id;
  const [tweet, setTweet] = useState(null);

  useEffect(() => {
    const fetchTweet = async (coll, id) => {
      try {
        const snap = await getDoc(doc(db, coll, id));
        setTweet(snap.data());
      } catch (error) {
        toast.error("Could not featch comments..");
      }
    };
    fetchTweet("tweets", s);
  }, []);

  return tweet ? (
    <main>
      <div className="tweet-container">
        <img src={tweet.imgUrl} alt="profile" className="img"></img>
        <div className="text-cotainer">
          <strong>{tweet.name}</strong>
          <p>{tweet.tweet}</p>
        </div>
      </div>
      <CreateComment id={s} />
      <div>
        {tweet.comments.length > 0 &&
          tweet.comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.name}</p>
              <p>{comment.comment}</p>
              <br />
            </div>
          ))}
      </div>
    </main>
  ) : (
    <div>Loading...</div>
  );
}

export default Comment;
