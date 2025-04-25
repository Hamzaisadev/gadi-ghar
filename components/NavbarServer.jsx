import { checkUser } from "@/lib/checkUser";
import Navbar from "./Navbar";

const NavbarServer = async ({ isAdminPage = false }) => {
  const user = await checkUser(); //
  return <Navbar user={user} isAdminPage={isAdminPage} />;
};

export default NavbarServer;
