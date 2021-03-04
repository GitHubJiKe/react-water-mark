import React from "react";
import blabkIcon from "./images/Github_Logo.png";
import whiteIcon from "./images/Github_Logo_White.png";

interface IGithubCornerProps {
  href: string;
  mode?: "dark" | "light";
}

export default function GithubCorner(props: IGithubCornerProps) {
  const { href, mode = "dark" } = props;

  const isDarkMode = mode === "dark";

  return (
    <a
      href={href}
      target="_blank"
      style={{
        backgroundColor: isDarkMode ? "#665757" : "#75878a",
        width: 300,
        height: 300,
        display: "block",
        position: "fixed",
        right: -160,
        top: -160,
        transform: `rotate(45deg)`,
        cursor: "pointer",
        zIndex: 10000000,
      }}
    >
      <img
        src={isDarkMode ? whiteIcon : blabkIcon}
        width={140}
        height={40}
        style={{
          transform: `rotate(0deg)`,
          position: "absolute",
          top: 236,
          right: 80,
          cursor: "pointer",
        }}
      />
    </a>
  );
}
