import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import comment from "../assets/jpg/comment.jpg";
import { FaTimes } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
function Dialog(props) {
  const auth = getAuth();
  // let imgUrl= null;
  const navigate = useNavigate();
  const isOwn = props.isOwn;
  const date = props.timestamp.toDate();
  const id = props.id;
  const userID = props.useId;
  const ndate =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    "  at " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  const onDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "tweets", `${id}`));
        navigate("/profile");
      } catch (error) {
        toast.error("Try again...!");
      }
    }
  };
  return (
    <div className="tweet-container">
      <img src={props.img} alt="profile" className="img"></img>
      <div className="tt-container">
        <div className="text-cotainer">
          <Link to={`/other/${userID}`}>{<strong>@{props.title}</strong>}</Link>
          <p>{props.message}</p>
          <p>{ndate}</p>
        </div>

        <div className="commentime-container">
          {/* {console.log(userID)}
          {console.log(auth.currentUser.uid)} */}
          {!isOwn && userID === auth.currentUser.uid ? (
            <FaTimes color="purple" onClick={onDelete} />
          ) : (
            <div className="count"></div>
          )}

          <Link to={`/comments/${id}`}>
            <div className="navbarListItems">
              <img src={comment} alt="comment" className="comment-icon"></img>
              <div className="count"></div>
              {props.comments.length}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Tweets({ setTweets, tweets, loading, isOwn }) {
  return (
    <div className="">
      {loading ? (
        <Spinner />
      ) : tweets && tweets.length > 0 ? (
        <>
          <div>
            {tweets.map((tweet) => (
              <Dialog
                key={tweet.id}
                id={tweet.id}
                title={tweet.data.name}
                message={tweet.data.tweet}
                img={tweet.data.imgUrl}
                timestamp={tweet.data.timestamp}
                comments={tweet.data.comments}
                useId={tweet.data.userRef}
                isOwn={isOwn}
              />
            ))}
          </div>
        </>
      ) : (
        <h2>No Tweets Yet</h2>
      )}
      <div className="marginB"></div>
    </div>
  );
}

export default Tweets;
