import React, { useContext } from "react";
import { ImFacebook, ImInstagram } from "react-icons/im";
import { CursorContext } from "../context/CursorContext";

const Socials = () => {
  const { mouseEnterHandler, mouseLeaveHandler } = useContext(CursorContext);

  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      className="hidden xl:flex ml-24"
    >
      <ul className="flex gap-x-4">
        <li>
          <a
            href="https://www.instagram.com/alexszilagyiphotography/"
            target="_blank"
          >
            <ImInstagram />
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/alexszilagyiphotography"
            target="_blank"
          >
            <ImFacebook />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Socials;
