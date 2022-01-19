import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Tweets from "./Tweets";

function Profile() {
  const auth = getAuth();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [tweets, setTweets] = useState(null);
  useEffect(() => {
    const fetchUser = async (coll, id) => {
      try {
        const snap = await getDoc(doc(db, coll, id));
        //console.log(snap.data());
        setFollowerCount(snap.data().followers.length);
        setFollowingCount(snap.data().following.length);
      } catch (error) {
        toast.error("Could not featch data..");
      }
    };
    fetchUser("users", auth.currentUser.uid);

    const fetchTweets = async () => {
      try {
        const tweetsRef = collection(db, "tweets"); //reference
        //create query
        const q = query(tweetsRef, orderBy("timestamp", "desc"));

        const querySnap = await getDocs(q);

        const tweets = [];

        querySnap.forEach((doc) => {
          // console.log(doc.data().userRef);
          // console.log(auth.currentUser.uid);
          if (doc.data().userRef === auth.currentUser.uid)
            return tweets.push({
              id: doc.id,
              data: doc.data(),
            });
          else return tweets;
        });

        setTweets(tweets);
        //setLoading(false);
      } catch (error) {
        toast.error("Could not featch tweets");
      }
    };
    fetchTweets();
  }, []);

  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const navigate = useNavigate();
  const { name } = formData;
  const onLogOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update in db
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //console.log(auth.currentUser);
        //update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update, Try again..!");
    }
  };

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogOut}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevstate) => !prevstate);
            }}
          >
            {changeDetails ? "Done" : "Change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
          </form>
        </div>
        <div>
          <br />
          <p>followers {followerCount}</p>
          <br />
          <p>following {followingCount}</p>
        </div>
        <Tweets setTweets={setTweets} tweets={tweets} />
      </main>
    </div>
  );
}

export default Profile;
