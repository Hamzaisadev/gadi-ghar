import { checkUser } from "@/lib/checkUser";
import Navbar from "./Navbar";

const NavbarServer = async () => {
  const user = await checkUser(); //
  return <Navbar user={user} />;
};

export default NavbarServer;
