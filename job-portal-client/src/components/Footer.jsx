import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-gray-300 p-4 text-center w-full">
      &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
    </footer>
  );
};

export default Footer;
