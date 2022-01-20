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
import UserProfile from "./UserProfile";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function Profile() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dp, setdp] = useState(null);

  useEffect(() => {
    const fetchUser = async (coll, id) => {
      try {
        const snap = await getDoc(doc(db, coll, id));
        //console.log(snap.data());
        setUser(snap.data());
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
        setLoading(false);
      } catch (error) {
        toast.error("Could not featch tweets");
      }
    };
    fetchTweets();
  }, [auth.currentUser.uid]);

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

  const onMutate = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      setdp(e.target.files);
    }
  };
  let imgUrl;
  const onSubmitt = async (e) => {
    e.preventDefault();
    if (dp) {
      setLoading(true);
      // Store image in firebase
      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

          const storageRef = ref(storage, "images/" + fileName);

          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imgUrl = downloadURL;
                //console.log("File available at", downloadURL);
                resolve(downloadURL);
              });
            }
          );
        });
      };

      // eslint-disable-next-line no-unused-vars
      const imgUrls = await Promise.all(
        [...dp].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
      });
      //console.log("File available at", imgUrls);
      try {
        //update in db
        await updateProfile(auth.currentUser, {
          photoURL: imgUrl,
        });
        //console.log(auth.currentUser);
        //update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          imgUrl: imgUrl,
        });
      } catch (error) {
        console.log(error);
        toast.error("Could not update, Try again..!");
      }
      setLoading(false);
    } else {
      toast.error("Image not seleted..");
    }
  };

  return user ? (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogOut}>
          Logout
        </button>
      </header>
      <main>
        <UserProfile
          imgUrl={user.imgUrl}
          name={user.name}
          following={null}
          isOwn={false}
          followingCount={user.following.length}
          followerCount={user.followers.length}
        />

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
        <label className="formLabel">Profile Image</label>
        <div className="name-container">
          <form>
            <input
              className="formInputFile"
              type="file"
              id="images"
              max="1"
              accept=".jpg,.png,.jpeg"
              onChange={onMutate}
              required
            />
            <button type="submit" className="logOut" onClick={onSubmitt}>
              Update Profile
            </button>
          </form>
        </div>

        <Tweets setTweets={setTweets} tweets={tweets} loading={loading} />
      </main>
    </div>
  ) : (
    <Spinner />
  );
}

export default Profile;
