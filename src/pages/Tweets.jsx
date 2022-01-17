import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

function Dialog(props) {
  // const auth = getAuth();
  // let imgUrl= null;
  const date = props.timestamp.toDate();
  const id = props.id;
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
      <div className="text-cotainer">
        <strong>{props.title}</strong>
        <p>{props.message}</p>
        <p>{ndate}</p>
        <Link to={`/comments/${id}`}>
          <img src={props.img} alt="comment" className="retweet"></img>
          {<p>{props.comments.length}</p>}
        </Link>
      </div>
    </div>
  );
}

function Tweets({ setTweets, tweets }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsRef = collection(db, "tweets"); //reference
        //create query
        const q = query(tweetsRef, orderBy("timestamp", "desc"));

        const querySnap = await getDocs(q);

        const tweets = [];

        querySnap.forEach((doc) => {
          //console.log(doc.data());
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
  });
  return (
    <main>
      <div>
        {loading ? (
          <Spinner />
        ) : tweets && tweets.length > 0 ? (
          <>
            <ul>
              {tweets.map((tweet) => (
                <Dialog
                  key={tweet.id}
                  id={tweet.id}
                  title={tweet.data.name}
                  message={tweet.data.tweet}
                  img={tweet.data.imgUrl}
                  timestamp={tweet.data.timestamp}
                  comments={tweet.data.comments}
                />
              ))}
            </ul>
          </>
        ) : (
          <p>No Tweets Yet</p>
        )}
      </div>
    </main>
  );
}

export default Tweets;
