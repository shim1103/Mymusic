import { createBrowserRouter } from 'react-router-dom';
import Login from "./page/login/login";
import SignUp from "./page/login/signup";
import ProtectedRoute from "./ProtectedRoute";
import RouterApp from "./page/RouterApp";
import Main from "./page/main"
import Form from "./page/form/form";
import Setting from "./page/setting/setting";
import Logout from "./page/login/logout";
import { ProtectedSuper } from './page/login/ProtectedSuper';
import Users from "./page/login/users";
import NotFoundPage from "./page/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RouterApp />,
        children: [
          { index: true, element: <Main /> },
          { path: "logout", element: <Logout /> },
          { path: "form", element: <Form /> },
          { path: "setting", element: <Setting /> },
          { path: "*", element: <NotFoundPage /> },
          {
            element: <ProtectedSuper />,
            children: [
              { index: true, path: "users", element: <Users /> },
            ],
          }
        ]
      },
    ]
  }
]);

export default router;
