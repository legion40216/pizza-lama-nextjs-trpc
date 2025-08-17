import React from "react";

import Cart from "./nav-right/cart";
import UserMenu from "./nav-right/user-menu";
import Logout from "./nav-right/logout";

export default function NavRight() {
  return (
    <div className="flex gap-3 items-center">
      <Logout />

      <UserMenu />

      <Cart />
    </div>
  );
}
