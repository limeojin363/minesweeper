import GlobalStyle from "./GlobalStyle";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import InitialPage from "./pages/initial/InitialPage";
import GamePage from "./pages/game/GamePage";

const router = createBrowserRouter([
  {path: "/", element: <InitialPage />},
  {path: "/game", element: <GamePage />},
])

const App = () => {
  return (
    <>
      <GlobalStyle />
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
};

export default App;

