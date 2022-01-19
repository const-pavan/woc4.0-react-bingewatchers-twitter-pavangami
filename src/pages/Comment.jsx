import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateComment from "./CreateComment";
import { Link } from "react-router-dom";
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
        <div className="tt-container">
          <div className="text-cotainer">
            <Link to={`/other/${tweet.userRef}`}>
              {<strong>@{tweet.name}</strong>}
            </Link>
            <p>{tweet.tweet}</p>
          </div>
        </div>
      </div>
      <CreateComment id={s} />
      <div>
        {tweet.comments.length > 0 &&
          tweet.comments.map((comment) => (
            <div key={comment.id} className="comment-container">
              <Link to={`/other/${comment.userRef}`}>
                {<strong>@{comment.name}</strong>}
              </Link>
              {/* <p>{comment.userRef}</p> */}
              <p>Comment : </p>
              <div className="count"></div>
              <p>{comment.comment}</p>
            </div>
          ))}
      </div>
    </main>
  ) : (
    <div>No Comment yet...</div>
  );
}

export default Comment;
