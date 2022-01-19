function UserProfile({
  imgUrl,
  onFollowClick,
  name,
  following,
  followingCount,
  followerCount,
}) {
  return (
    <div>
      <div className="p-container">
        <div>
          <div className="commentime-container">
            <img src={imgUrl} alt="profile" className="profile-icon"></img>

            <div className="col-container">
              <div className="name-container">
                <h1 className="profileaa-user-name">{name}</h1>
                <div className="count2"></div>
                <div className="count2"></div>
                <button onClick={onFollowClick} className="follow">
                  {following ? "Following" : "Follow"}
                </button>
              </div>

              <div className="name-container">
                <strong>
                  followers
                  <span className="navbarListItems">{followerCount}</span>{" "}
                </strong>
                <div className="count2"></div>
                <div className="count2"></div>
                <strong>
                  following
                  <span className="navbarListItems">{followingCount}</span>{" "}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
