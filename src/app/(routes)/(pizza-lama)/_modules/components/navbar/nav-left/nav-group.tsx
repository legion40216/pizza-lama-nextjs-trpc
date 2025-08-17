import React from 'react'

import { navLinks } from "@/data/links";
import { usePathname } from "next/navigation";
import NavLinks from '../components/nav-links';

export function useNavRoutes() {
  const pathName = usePathname();

  return navLinks.map((link) => ({
    ...link,
     active: pathName?.startsWith(link.href + "/") || pathName === link.href,
  }));
}

export default function NavGroup() {
    const routes = useNavRoutes();
    
  return (
    <div className='flex gap-3 items-center'>
      {
        routes.map((route, index) => (
        <NavLinks 
          key={index}
          routeActive={route.active}
          routeHref={route.href}
          routeLabel={route.label}
          className="hover:text-pizza-store-link"
          activeClassName="text-pizza-store-link"
          inactiveClassName="text-muted-foreground"
        />
        ))
      }
    </div>
  )
}
