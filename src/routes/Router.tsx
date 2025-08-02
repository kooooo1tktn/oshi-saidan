import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Posts } from "../pages/Posts";
import { New } from "../pages/New";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<Posts />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </>
  );
};
