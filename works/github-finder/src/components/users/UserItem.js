import React from "react";
import {Link } from 'react-router-dom';

const userItem = ({user: {login, avatar_url}}) => {
  return (
    <div className="card text-center">
      <img
        src={avatar_url}
        className="round-img"
        style={{ width: "60px" }}
        alt="img"
      />
      <h3>{login}</h3>
      <div>
        <Link to={`/user/${login}`} className="btn btn-dark btn-sm">
          More...
        </Link>
      </div>
    </div>
  );
};

export default userItem;
