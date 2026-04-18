import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiActivity,
  FiRss,
  FiTool,
  FiShield,
  FiList,
  FiFileText,
  FiMessageCircle,
  FiTruck,
} from "react-icons/fi";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  {
    icon: FiSlack,
    name: "Catalog",
    routes: [
      {
        path: "/products",
        name: "Products",
      },
      {
        path: "/categories",
        name: "Categories",
      },
      {
        path: "/attributes",
        name: "Attributes",
      },
      {
        path: "/coupons",
        name: "Coupons",
      },
      {
        path: "/brands",
        name: "Brands",
      },
      {
        path: "/reviews",
        name: "Reviews",
      },
    ],
  },

  {
    path: "/customers",
    icon: FiUsers,
    name: "Customers",
  },
  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders",
  },
  {
    path: "/vendors",
    icon: FiTruck,
    name: "Vendors",
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "OurStaff",
  },
  {
    path: "/seo-management",
    icon: FiActivity,
    name: "Seo Management",
  },
  {
    path: "/blogs",
    icon: FiRss,
    name: "Blogs",
  },
  {
    path: "/pages",
    icon: FiList,
    name: "Pages",
  },
  {
    path: "/cms",
    icon: FiFileText,
    name: "CMS Management",
  },

  // {
  //   icon: FiMessageCircle,
  //   name: "Community",
  //   routes: [
  //     {
  //       path: "/admin/community",
  //       name: "Content Moderation",
  //     },
  //     {
  //       path: "/admin/users",
  //       name: "User Management",
  //     },
  //   ],
  // },

  {
    icon: FiTool,
    name: "CBSG",
    routes: [
      {
        path: "/cbsg/builds",
        name: "Builds",
      },
      {
        path: "/cbsg/users",
        name: "Users",
      },
      {
        path: "/cbsg/moderation",
        name: "Moderation",
      },
      {
        path: "/cbsg/settings",
        name: "CBSG Settings",
      },
    ],
  },

  {
    path: "/settings?settingTab=common-settings",
    icon: FiSettings,
    name: "Settings",
  },
  // {
  //   icon: FiGlobe,
  //   name: "International",
  //   routes: [
  //     {
  //       path: "/languages",
  //       name: "Languages",
  //     },
  //     {
  //       path: "/currencies",
  //       name: "Currencies",
  //     },
  //   ],
  // },
  // {
  //   icon: FiTarget,
  //   name: "OnlineStore",
  //   routes: [
  //     {
  //       name: "ViewStore",
  //       path: "http://localhost:3000",
  //       outside: "store",
  //     },

  //     {
  //       path: "/store/customization",
  //       name: "StoreCustomization",
  //     },
  //     {
  //       path: "/store/store-settings",
  //       name: "StoreSettings",
  //     },
  //   ],
  // },

  // {
  //   icon: FiSlack,
  //   name: "Pages",
  //   routes: [
  //     // submenu

  //     {
  //       path: "/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/coming-soon",
  //       name: "Coming Soon",
  //     },
  //   ],
  // },
];

export default sidebar;
