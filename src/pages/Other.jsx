import { db } from "../firebase.config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Tweets from "./Tweets";
import Spinner from "../components/Spinner";
import UserProfile from "./UserProfile";

function Other() {
  const params = useParams();
  const uid = params.id;
  const [user, setUser] = useState(null);

  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (coll, id) => {
      try {
        const snap = await getDoc(doc(db, coll, id));
        //console.log(snap.data());
        setFollowerCount(snap.data().followers.length);
        setFollowingCount(snap.data().following.length);
        setUser(snap.data());
      } catch (error) {
        toast.error("Could not featch comments..");
      }
    };
    fetchUser("users", uid);
    const auth = getAuth();
    const fetchFollow = async (coll, id) => {
      try {
        //create query
        const snap = await getDoc(doc(db, coll, id));
        if (snap.data().followers.includes(auth.currentUser.uid)) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Could not featch user");
      }
    };
    fetchFollow("users", uid);

    const fetchTweets = async () => {
      try {
        setTweets(null);
        const tweetsRef = collection(db, "tweets"); //reference
        //create query
        const q = query(tweetsRef, orderBy("timestamp", "desc"));

        const querySnap = await getDocs(q);

        const tweets = [];

        querySnap.forEach((doc) => {
          //console.log(doc.data().userRef);
          //console.log(auth.currentUser.uid);
          if (doc.data().userRef === uid)
            return tweets.push({
              id: doc.id,
              data: doc.data(),
            });
          else return tweets;
        });
        setTweets(tweets);
        setLoading(false);
      } catch (error) {
        toast.error("Could not featch tweets");
      }
    };
    fetchTweets();
  }, [following, uid]);

  const onFollowClick = async () => {
    if (!following) {
      try {
        const auth = getAuth();
        const docRef = doc(db, `/users/${uid}`);
        await updateDoc(docRef, {
          followers: arrayUnion(auth.currentUser.uid),
        });
        const docRef2 = doc(db, `/users/${auth.currentUser.uid}`);
        await updateDoc(docRef2, {
          following: arrayUnion(uid),
        });
        toast.success("Follow is successful...");
        //setFollowerCount(docRef.data().followers.length);
        setFollowing(true);
      } catch (error) {
        console.log(error);
        toast.error("Try again!!!");
      }
    } else {
      try {
        const auth = getAuth();
        const docRef = doc(db, `/users/${uid}`);
        await updateDoc(docRef, {
          followers: arrayRemove(auth.currentUser.uid),
        });
        const docRef2 = doc(db, `/users/${auth.currentUser.uid}`);
        await updateDoc(docRef2, {
          following: arrayRemove(uid),
        });
        toast.success("Unfollow is successful...");
        //console.log(docRef.data().followers);
        //setFollowerCount(docRef.data().followers.length);
        setFollowing(false);
      } catch (error) {
        console.log(error);
        toast.error("Try again!!!");
      }
    }
  };
  return loading ? (
    <Spinner />
  ) : user ? (
    <>
      <header>
        <h1>User Profile</h1>
      </header>
      <main>
        <UserProfile
          imgUrl={user.imgUrl}
          onFollowClick={onFollowClick}
          name={user.name}
          following={following}
          followingCount={followingCount}
          followerCount={followerCount}
          isOwn={true}
        />
        <Tweets setTweets={setTweets} tweets={tweets} />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default Other;
