import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import comment from "../assets/jpg/comment.jpg";
function Dialog(props) {
  // const auth = getAuth();
  // let imgUrl= null;
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

function Tweets({ setTweets, tweets, loading }) {
  return (
    <div>
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
              />
            ))}
          </div>
        </>
      ) : (
        <p>No Tweets Yet</p>
      )}
    </div>
  );
}

export default Tweets;
