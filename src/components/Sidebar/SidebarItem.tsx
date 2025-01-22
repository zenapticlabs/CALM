import React, { useEffect, useState } from "react";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (pageName === item.label.toLowerCase()) {
      setOpen(true);
    }
  }, [pageName, item.label]);
  const isItemActive = isActive(item);

  return (
    <>
      <li>
        <Button
          href={item.route}
          onClick={handleClick}
          className={`flex items-center justify-start gap-2.5 px-4 py-2 rounded-md relative ${isItemActive ? "text-[#e3ebff]" : "text-[#7184ab]"} transition-colors duration-300 ease-in-out`}
          sx={{
            textTransform: 'none',
          }}
        >
          {item.icon}
          <span className={`${isItemActive ? "font-medium" : "font-normal"}`}>
            {item.label}
          </span>
          {item.children && (
            <svg
              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${pageName === item.label.toLowerCase() ? " rotate-180" : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                fill=""
              />
            </svg>
          )}
        </Button>

        {item.children && (
          <div
            className={`sidebar-dropdown ${pageName === item.label.toLowerCase() ? "show" : ""}`}
          >
            <SidebarDropdown item={item.children} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
