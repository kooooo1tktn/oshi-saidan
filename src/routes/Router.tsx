import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Posts } from "../pages/Posts";
import { New } from "../pages/New";
import { Layout } from "../components/Layout";

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<Posts />} />
        <Route path="/new" element={<New />} />
      </Route>
    </Routes>
  );
};
