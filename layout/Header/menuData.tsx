import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Features",
    newTab: false,
    path: "/#features",
  },
  {
    id: 2.1,
    title: "Blog",
    newTab: false,
    path: "/blog",
  },
  {
    id: 2.3,
    title: "Docs",
    newTab: false,
    path: "/docs",
  },
  {
    id: 3,
    title: "Support",
    newTab: false,
    path: "/support",
  },
  {
    id: 4,
    title: "Calendar",
    path: "/calendar",
    newTab: false,
    roles: ["coach", "admin", "staff", "student"],
  },
  {
    id: 5,
    title: "Students",
    path: "/students",
    newTab: false,
    roles: ["coach", "admin", "staff"],
  },
  {
    id: 6,
    title: "Dashboard",
    path: "/dashboard",
    newTab: false,
    roles: ["coach", "admin", "staff", "student"],
  },
];

export default menuData;
