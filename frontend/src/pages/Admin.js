import { useEffect } from "react";
import { requestForToken } from "../utils/fireBaseConfig";

const Admin = () => {
  useEffect(() => {
    requestForToken();
  }, []);

  return <h1>Admin Dashboard</h1>;
};

export default Admin;
