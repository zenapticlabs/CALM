import { ResourceProps } from "@refinedev/core";

export const dashboardResources: ResourceProps[] = [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      isDashboard: true,
      label: "Dashboard",
    },
  },
  // {
  //   name: "organization",
  //   create: "/authenticate/"
  // },
  {
    name: "transactions",
    list: "/dashboard/recent-transactions",
    meta: {
      canDelete: true,
      label: "Transactions",
      parent: "transaction",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "transactions",
    list: "/dashboard/transactions/list",
    create: "/dashboard/transactions/create",
    edit: "/dashboard/transactions/edit",
    show: "/dashboard/transactions/show",
    meta: {
      canDelete: true,
      label: "Transactions",
      parent: "transaction",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "collections",
    list: "/transactions/collections",
    meta: {
      parent: "transaction",
      label: "Collection",
      disabled: true,
      hide: true,
    },
  },
  {
    name: "mastermgmt",
    meta: {
      label: "Master MGMT",
    },
  },
  {
    name: "assets",
    list: "/dashboard/assets/list",
    create: "/dashboard/assets/create",
    edit: "/dashboard/assets/edit",
    show: "/dashboard/assets/show",
    meta: {
      canDelete: true,
      label: "Licenses",
      parent: "mastermgmt",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "assets_details",
    list: "/assets/show",
    create: "/assets/show/:assetid/assets_details/create",
    edit: "/assets/show/:assetid/assets_details/edit/:detailsid",
    show: "/assets/show/:assetid/assets_details/show/:detailsid",
    meta: {
      canDelete: true,
      label: "License Details",
      parent: "assets",
      hide: true,
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "products",
    list: "/dashboard/products/list",
    create: "/dashboard/products/create",
    edit: "/dashboard/products/edit",
    show: "/dashboard/products/show",
    meta: {
      canDelete: true,
      label: "Products",
      parent: "mastermgmt",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "reports",
    list: "/dashboard/reports/list",
    create: "/dashboard/reports/create",
    meta: {
      canDelete: true,
      label: "Reports",
      parent: "mastermgmt",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "references",
    list: "/dashboard/references/list",
    create: "/dashboard/references/create",
    edit: "/dashboard/references/edit",
    show: "/dashboard/references/show",
    meta: {
      canDelete: true,
      label: "References",
      parent: "mastermgmt",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "partners",
    list: "/dashboard/partners/list",
    create: "/dashboard/partners/create",
    edit: "/dashboard/partners/edit",
    show: "/dashboard/partners/show",
    meta: {
      label: "Partners",
      parent: "mastermgmt",
      disabled: true,
      hide: true,
    },
  },
  {
    name: "maintenance",
    meta: {
      label: "Maintenance",
      disabled: true,
      hide: true,
    },
  },
  {
    name: "lookups",
    list: "/dashboard/lookups/list",
    create: "/dashboard/lookups/create",
    edit: "/dashboard/lookups/edit",
    show: "/dashboard/lookups/show",
    meta: {
      label: "Lookups",
      canDelete: true,
      parent: "maintenance",
      warnWhenUnsavedChanges: true,
    },
  },
  {
    name: "licensecode",
    list: "/dashboard/maintenance/license-code",
    meta: {
      label: "License Code",
      parent: "maintenance",
    },
  },
  {
    name: "email-templates",
    list: "/dashboard/email-templates/list",
    create: "/dashboard/email-templates/create",
    edit: "/dashboard/email-templates/edit",
    meta: {
      label: "Email Templates",
      parent: "maintenance",
    },
  },
  {
    name: "schedule",
    list: "/dashboard/notification-schedules/list",
    create: "/dashboard/notification-schedules/create",
    edit: "/dashboard/notification-schedules/edit",
    show: "/dashboard/notification-schedules/show",

    meta: {
      label: "Notification Schedules",
      parent: "maintenance",
    },
  },
  {
    name: "unsubscribe",
    list: "/dashboard/maintenance/unsubscribe",
    meta: {
      label: "Unsubscribe",
      parent: "maintenance",
    },
  },
  {
    name: "reports",
    meta: {
      label: "Reports",
      disabled: true,
      hide: true,
    },
  },
  {
    name: "business",
    list: "/reports/business",
    meta: {
      label: "Business",
      parent: "reports",
    },
  },
  {
    name: "logs",
    list: "/reports/logs",
    meta: {
      label: "Logs",
      parent: "reports",
    },
  },
  {
    name: "scheduleview",
    list: "/reports/schedule-view",
    meta: {
      label: "Schedule View",
      parent: "reports",
    },
  },
  {
    name: "settings",
    meta: {
      label: "Settings",
      disabled: true,
      hide: true,
    },
  },
  {
    name: "profile",
    list: "/dashboard/settings/profile",
    meta: {
      label: "Profile",
      parent: "settings",
    },
  },
  {
    name: "user-account",
    list: "/dashboard/settings/user-account",
    meta: {
      label: "User Account",
      parent: "settings",
    },
  },
  {
    name: "organizations",
    list: "/dashboard/settings/organizations",
    meta: {
      label: "User Account",
      parent: "settings",
    },
  },
  {
    name: "roles",
    list: "/dashboard/roles/list",
    create: "/dashboard/roles/create",
    edit: "/dashboard/roles",
    meta: {
      label: "Roles",
      parent: "settings",
    },
  },
  {
    name: "users",
    list: "/dashboard/users/list",
    create: "/dashboard/users/create",
    edit: "/dashboard/users/edit",
    meta: {
      label: "User",
      parent: "settings",
    },
  },
  {
    name: "orgs",
    list: "/dashboard/orgs/list",
    create: "/dashboard/orgs/create",
    edit: "/dashboard/orgs/edit",
    meta: {
      label: "Organizations",
      parent: "settings",
      warnWhenUnsavedChanges: true,
      canDelete: true,
    },
  },
  {
    name: "orgs/key/api-keys",
    list: "/dashboard/api-keys",
    create: "/dashboard/api-keys/create",
    edit: "/dashboard/api-keys/edit",
    meta: {
      label: "API Keys",
      parent: "settings",
      warnWhenUnsavedChanges: true,
      canDelete: true,
    },
  },
];
