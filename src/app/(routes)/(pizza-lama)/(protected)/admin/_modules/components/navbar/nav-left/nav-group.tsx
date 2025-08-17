"use client"
import React from 'react'

import { usePathname } from "next/navigation";
import NavLinks from '../components/nav-links';
import { adminRoutes } from '@/data/links';

export function useNavRoutes(userRole?: UserRole) {
  const pathName = usePathname();

  // Combine base routes with filtered admin routes based on role
  const filteredRoutes = [
    ...adminRoutes.filter(route => 
      !route.roles || (userRole && route.roles.includes(userRole))
  )];

  return filteredRoutes.map((link) => ({
    ...link,
    active: pathName?.startsWith(link.href + "/") || pathName === link.href,
  }));
}

import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from '@/hooks/client-auth-utils';
import { UserRole } from '@/data/data';

export default function NavGroup() {
  const { user }= useCurrentUser();
  const routes = useNavRoutes(user?.role as UserRole);
    
  return (
    <div className='flex gap-3 items-center'>
      {routes.map((route, index) => (
        <NavLinks 
          key={index}
          routeActive={route.active}
          routeHref={route.href}
          className="hover:no-underline"
        >
          <Badge
            variant={route.active ? "default" : "secondary"}
            className="cursor-pointer"
          >
            {route.label}
          </Badge>
        </NavLinks>
      ))}
    </div>
  );
}
