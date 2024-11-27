import {
  MdShoppingBag,
  MdHome,
  MdSupervisedUserCircle,
  MdCellTower,
  MdOutlineSettings,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoGitNetworkSharp, IoColorFilterSharp } from "react-icons/io5";
import { SiPaloaltonetworks } from "react-icons/si";
type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  role: string | undefined,
): Group[] {
  let menuItems: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname === "/",
          icon: MdHome,
          submenus: [],
        },
        {
          href: "/market-place",
          label: "Market Place",
          active: pathname === "/market-place",
          icon: AiFillProduct,
          submenus: [],
        },
        {
          href: "/offers",
          label: "Offers",
          active: pathname.includes("/offers"),
          icon: MdShoppingBag,
          submenus: [],
        },
        {
          href: "/filters",
          label: "Reports",
          active: pathname.includes("/filters"),

          icon: IoColorFilterSharp,
          submenus: [
            {
              href: "/filters/clicks",
              label: "Clicks",
              active: pathname === "clicks",
            },
            {
              href: "/filters/conversions",
              label: "Conversions",
              active: pathname === "/conversions",
            },
            {
              href: "/filters/offers-report",
              label: "Offer report",
              active: pathname === "/offers-report",
            },
            {
              href: "/filters/user-report",
              label: "User report",
              active: pathname === "/user-report",
            },
          ],
        },
      ],
    },
  ];

  if (role !== "user") {
    menuItems[0].menus.push({
      href: "/users",
      label: "Users",
      active: pathname.includes("/users"),
      icon: MdSupervisedUserCircle,
      submenus: [],
    });
  }

  if (role === "admin" || role === "administrator") {
    menuItems[0].menus.push(
      {
        href: "/trackers",
        label: "Trackers",
        active: pathname === "/trackers",
        icon: SiPaloaltonetworks,
        submenus: [],
      },
      {
        href: "/networks",
        label: "Networks",
        active: pathname === "/networks",
        icon: IoGitNetworkSharp,
        submenus: [],
      },
      {
        href: "/domains",
        label: "Domains",
        active: pathname === "/domains",
        icon: MdCellTower,
        submenus: [],
      },
    );
  }

  menuItems.push({
    groupLabel: "Settings",
    menus: [
      {
        href: "/account",
        label: "Account",
        active: pathname === "/account",
        icon: MdOutlineSettings,
        submenus: [],
      },
    ],
  });

  return menuItems;
}
