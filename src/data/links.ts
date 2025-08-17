import { UserRole } from "./data";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/sales", label: "Sale" },
];

export const baseRoutes = [
  { label: "Orders", href: "/orders" },
];

export const adminRoutes = [
  { label: "Dashboard", href: "/admin/dashboard", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { label: "Accounts", href: "/admin/accounts", roles: [UserRole.ADMIN] },
  { label: "Categories", href: "/admin/categories", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { label: "Sizes", href: "/admin/sizes", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { label: "Products", href: "/admin/products", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { label: "Orders", href: "/admin/orders", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
];