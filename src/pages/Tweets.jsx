import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Dialog(props) {
  const date = props.timestamp.toDate();
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
      </div>
    </div>
  );
}

function Tweets() {
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsRef = collection(db, "tweets"); //reference
        //create query
        const q = query(tweetsRef, orderBy("timestamp", "desc"), limit(10));

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
  }, []);
  return (
    <div className="category">
      {loading ? (
        <Spinner />
      ) : tweets && tweets.length > 0 ? (
        <>
          <main>
            <ul>
              {tweets.map((tweet) => (
                <Dialog
                  key={tweet.id}
                  title={tweet.data.name}
                  message={tweet.data.tweet}
                  img={tweet.data.imgUrl}
                  timestamp={tweet.data.timestamp}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No Tweets Yet</p>
      )}
    </div>
  );
}

export default Tweets;
