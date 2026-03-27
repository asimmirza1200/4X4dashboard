import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Attributes = lazy(() => import("@/pages/Attributes"));
const ChildAttributes = lazy(() => import("@/pages/ChildAttributes"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Category = lazy(() => import("@/pages/Category"));
const ChildCategory = lazy(() => import("@/pages/ChildCategory"));
const Staff = lazy(() => import("@/pages/Staff"));
const Customers = lazy(() => import("@/pages/Customers"));
const CustomerOrder = lazy(() => import("@/pages/CustomerOrder"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderInvoice = lazy(() => import("@/pages/OrderInvoice"));
const Coupons = lazy(() => import("@/pages/Coupons"));
const Brands = lazy(() => import("@/pages/Brands"));
const BrandDetail = lazy(() => import("@/pages/BrandDetail"));
const Reviews = lazy(() => import("@/pages/Reviews"));

// const Setting = lazy(() => import("@/pages/Setting"));
const Page404 = lazy(() => import("@/pages/404"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Languages = lazy(() => import("@/pages/Languages"));
const Currencies = lazy(() => import("@/pages/Currencies"));
const Setting = lazy(() => import("@/pages/Setting"));
const StoreHome = lazy(() => import("@/pages/StoreHome"));
const StoreSetting = lazy(() => import("@/pages/StoreSetting"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const SEO = lazy(() => import("@/pages/Seo"));
const Blog = lazy(() => import("@/pages/Blogs"));
const Pages = lazy(() => import("@/pages/Pages"));
const CBSGBuilds = lazy(() => import("@/pages/CBSGBuilds"));
const CBSGBuildDetail = lazy(() => import("@/pages/CBSGBuildDetail"));
const CBSGUsers = lazy(() => import("@/pages/CBSGUsers"));
const CBSGModeration = lazy(() => import("@/pages/CBSGModeration"));
const CBSGSettings = lazy(() => import("@/pages/CBSGSettings"));
const PermissionTest = lazy(() => import("@/components/test/PermissionTestSimple"));
/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/attributes",
    component: Attributes,
  },
  {
    path: "/seo-management",
    component: SEO
  },
  {
    path: "/attributes/:id",
    component: ChildAttributes,
  },
  {
    path: "/product/:id",
    component: ProductDetails,
  },
  {
    path: "/blogs",
    component: Blog,
  },
  {
    path: "/pages",
    component: Pages,
  },
  {
    path: "/categories",
    component: Category,
  },
  {
    path: "/languages",
    component: Languages,
  },
  {
    path: "/currencies",
    component: Currencies,
  },

  {
    path: "/categories/:id",
    component: ChildCategory,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/customer-order/:id",
    component: CustomerOrder,
  },
  {
    path: "/our-staff",
    component: Staff,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/order/:id",
    component: OrderInvoice,
  },
  {
    path: "/coupons",
    component: Coupons,
  },
  {
    path: "/brands",
    component: Brands,
  },
  {
    path: "/brands/:id",
    component: BrandDetail,
  },
  {
    path: "/reviews",
    component: Reviews,
  },
  { path: "/settings", component: Setting },
  {
    path: "/store/customization",
    component: StoreHome,
  },
  {
    path: "/store/store-settings",
    component: StoreSetting,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/coming-soon",
    component: ComingSoon,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  // CBSG Routes
  {
    path: "/cbsg/builds",
    component: CBSGBuilds,
  },
  {
    path: "/cbsg/builds/:id",
    component: CBSGBuildDetail,
  },
  {
    path: "/cbsg/users",
    component: CBSGUsers,
  },
  {
    path: "/cbsg/moderation",
    component: CBSGModeration,
  },
  {
    path: "/cbsg/settings",
    component: CBSGSettings,
  },
  {
    path: "/test-permissions",
    component: PermissionTest,
  },
];

export default routes;
