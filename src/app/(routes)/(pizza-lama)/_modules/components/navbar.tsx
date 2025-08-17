import React from "react";

import NavLeft from "./navbar/nav-left";
import NavMain from "./navbar/nav-main";
import NavRight from "./navbar/nav-right";

export default function Navbar() {
  return (
    <div>
      <div className="p-2 bg-pizza-store-primary">
        <p className="text-center text-pizza-store-primary-foreground">
          Free delivery for all orders over $100
        </p>
      </div>

      <div className="flex items-center justify-between p-4 
      border-2 border-pizza-store-primary"
      >
        <NavLeft />

        <NavMain />

        <NavRight />
      </div>
    </div>
  );
}