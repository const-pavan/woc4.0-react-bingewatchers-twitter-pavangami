import { Navigate, Outlet } from "react-router-dom";
import { useSameStatus } from "../hooks/useSameAuth";
import Spinner from "./Spinner";

function PrivateRouteOther() {
  const { loggedIn, checkingStatus } = useSameStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Navigate to="/profile" /> : <Outlet />;
}

export default PrivateRouteOther;
