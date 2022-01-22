import Tweets from "./Tweets";
import CreateTweet from "./CreateTweet";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
function Explore() {
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

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
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);
  return (
    <div className="explore">
      <header>
        <h1>Explore...</h1>
      </header>
      <main>
        <CreateTweet setTweets={setTweets} tweets={tweets} />
        <Tweets
          setTweets={setTweets}
          tweets={tweets}
          loading={loading}
          isOwn={false}
        />
      </main>
    </div>
  );
}

export default Explore;
