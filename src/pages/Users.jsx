import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import UserProfile from "./UserProfile";

function Users() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users"); //reference
        //create query
        const q = query(usersRef, orderBy("timestamp", "desc"));

        const querySnap = await getDocs(q);

        const user = [];

        querySnap.forEach((doc) => {
          //console.log(doc.data());
          return user.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(user);
        setLoading(false);
      } catch (error) {
        toast.error("Could not featch tweets");
      }
    };

    fetchUsers();
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <div>
        {users &&
          users.map((user) => (
            <div className="profile">
              {/* <div className="time-container">
                <img
                  src={user.data.imgUrl}
                  alt="profile"
                  className="profile-icon"
                ></img>
                <h1>{user.data.name}</h1>
              </div> */}

              <UserProfile
                key={user.id}
                imgUrl={user.data.imgUrl}
                // onFollowClick={onFollowClick}
                name={user.data.name}
                //following={user.following.length}
                followingCount={user.data.following.length}
                followerCount={user.data.followers.length}
                isOwn={false}
                isall={true}
                userID={user.id}
              />
            </div>
          ))}
      </div>
      <div className="marginB"></div>
    </>
  );
}

export default Users;
