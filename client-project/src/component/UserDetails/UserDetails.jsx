import React from "react";
import "./userDetails.scss";
const UserDetails = ({ user }) => {
  console.log("user", user);
  return (
    <div className="user-details-container">
      <div className="card">
        <h2>User Profile</h2>
        <div className="info">
          <p>
            <strong>Username:</strong> {user?.user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.user?.email}
          </p>
          <p>
            <strong>Full Name:</strong> {user?.user?.firstName}{" "}
            {user?.user?.lastName}
          </p>

          <p>
            <strong>Mobile:</strong> {user?.user?.mobile}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
