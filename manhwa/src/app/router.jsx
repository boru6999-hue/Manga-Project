import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "../pages/Home/Home";
import MangaDetail from "../pages/Manga/MangaDetail";
import Reader from "../pages/Reader/Reader";
import Favorites from "../pages/Favorites/Favorites";
import Login from "../pages/Auth/Login";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/manga/:id", element: <MangaDetail /> },
      { path: "/read/:id/:ch", element: <Reader /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);
