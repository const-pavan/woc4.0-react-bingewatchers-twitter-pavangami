import Tweets from "./Tweets";
import CreateTweet from "./CreateTweet";
import { useEffect, useState } from "react";
function Explore() {
  const [tweets, setTweets] = useState(null);
  return (
    <div className="explore">
      <header>
        <h1>Explore...</h1>
      </header>
      <main>
        <CreateTweet setTweets={setTweets} tweets={tweets} />
        <Tweets setTweets={setTweets} tweets={tweets} />
      </main>
    </div>
  );
}

export default Explore;
