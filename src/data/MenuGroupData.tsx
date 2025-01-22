
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
// Define types for menu items and groups
type MenuItem = {
  icon: React.ReactNode;
  label: string;
  route: string;
  children?: Array<{
    label: string;
    route: string;
    is_superuser?: boolean;
    is_commonuser?: boolean;
  }>;
};

type MenuGroup = {
  name: string;
  menuItems: MenuItem[];
};

// Define menu groups
export const menuGroups: MenuGroup[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <GridViewRoundedIcon />,
        label: "Dashboard",
        route: "/",
      },
      {
        icon: <ChangeCircleIcon />,
        label: "Transaction",
        route: "#",
        children: [
          { label: "Open", route: "/dashboard/recent-transactions" },
          { label: "Transaction History", route: "/dashboard/transactions/list" },
        ]
      },
      {
        icon: <HomeRepairServiceIcon />,
        label: "Master",
        route: "#",
        children: [
          { label: "Licenses", route: "/dashboard/assets/list" },
          { label: "Products", route: "/dashboard/products/list" },
          { label: "Partners", route: "/dashboard/partners/list" },
          { label: "Reference Code", route: "/dashboard/references/list" }
        ],
      },
      {
        icon: <SettingsIcon />,
        label: "Setups",
        route: "#",
        children: [
          { label: "Lookups", route: "/dashboard/lookups/list" },
          { label: "Notification Templates", route: "/dashboard/email-templates/list" },
          { label: "Notification Schedules", route: "/dashboard/notification-schedules/list",is_superuser: true },
          { label: "Organizations", route: "/dashboard/orgs/list", is_superuser: true },
          { label: "Users", route: "/dashboard/users/list", is_superuser: true },
          { label: "API Keys", route: "/dashboard/api-keys", is_superuser: true },
        ],
      },
      {
        icon: <ControlCameraIcon />,
        label: "Control",
        route: "#",
        children: [
          { label: "User profile", route: "/dashboard/user-profile", is_commonuser: true },
          { label: "Roles & Permissions", route: "/dashboard/roles/list", is_superuser: true },
        ],
      },
      {
        icon: <BarChartIcon />,
        label: "Reports",
        route: "#",
        children: [
          { label: "Run Report", route: "/dashboard/reports/list" },
          { label: "Report History", route: "#" },
          // { label: "Log History", route: "#" },
        ],
      },
    ],
  }
];

// Helper function to filter menu items
const filterMenuItems = (groups: MenuGroup[], filterKey: 'is_superuser' | 'is_commonuser'): MenuGroup[] => {
  return groups.map(group => ({
    ...group,
    menuItems: group.menuItems
      .map(item => ({
        ...item,
        children: item.children?.filter(child => !child[filterKey])
      }))
      .filter(item => item.children?.length !== 0 || !item.children)
  }));
};

export const CommonMenu = filterMenuItems(menuGroups, 'is_superuser');
export const AdminMenu = filterMenuItems(menuGroups, 'is_commonuser');