"use client";

import useStore from "@hooks/globalStore";
import { AuthProvider } from "@refinedev/core";
import { Organization, Permission, Role, User } from "@/types/types";
import crypto from "crypto";
const realAPI_URL = "https://calmtpy.pfuapps.com/api";
const API_URL = process.env.API_URL;

export interface LoginResponse {
  temp_access: string;
  user_id: string;
  organizations: Organization[];
}

export interface CustomAuthProvider extends AuthProvider {
  validateInviteToken: (token: string) => Promise<any>;
}

const aggregatePermissionsByCodename = (
  roles: Role[],
  codename: string
): Permission | null => {
  const aggregatedPermission: Permission = {
    codename: codename,
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  roles.forEach((role) => {
    role.permissions?.forEach((permission) => {
      if (permission.codename === codename) {
        aggregatedPermission.create =
          aggregatedPermission.create || !!permission.create;
        aggregatedPermission.read =
          aggregatedPermission.read || !!permission.read;
        aggregatedPermission.update =
          aggregatedPermission.update || !!permission.update;
        aggregatedPermission.delete =
          aggregatedPermission.delete || !!permission.delete;
      }
    });
  });

  return aggregatedPermission;
};

const getCurrentUser = async (): Promise<User | null> => {
  const user = useStore.getState().user;

  if (user) {
    return user;
  }

  return new Promise((resolve) => {
    const unsubscribe = useStore.subscribe((state) => {
      if (state.user) {
        resolve(state.user);
        unsubscribe();
      }
    });
  });
};

const getRamdonToken = () => {
  return crypto.randomBytes(64).toString("hex");
};
export const authProvider: AuthProvider = {
  login: async ({ email, password, username }) => {
    let loginUrl = "login";
    if (username) {
      loginUrl = "admin-login";
    }
    const response = await fetch(`${API_URL ?? realAPI_URL}/${loginUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        paicalm: getRamdonToken(),
      },
      body: JSON.stringify({ email, password, username }),
    });
    if (response.ok) {
      const data: LoginResponse = await response.json();
      localStorage.setItem("tempToken", data.temp_access);
      useStore.getState().setOrganizations(data.organizations);
      if (data.organizations.length == 1) {
        const response = await fetch(`${API_URL ?? realAPI_URL}/authenticate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tempToken")}`,
          },
          body: JSON.stringify({
            organization: data.organizations[0].organization_code,
          }),
        });
        if (response.ok) {
          const data: any = await response.json();
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          return {
            success: true,
            redirectTo: "/dashboard",
          };
        }
      }
      return {
        success: true,
        redirectTo: "/auth/organization",
      };
    } else {
      return Promise.reject(new Error("Invalid username or password"));
    }
  },
  register: async ({ token, username, password, first_name, last_name }) => {
    const response = await fetch(`${API_URL ?? realAPI_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        paicalm: getRamdonToken(),
      },
      body: JSON.stringify({
        token,
        username,
        password,
        first_name,
        last_name,
      }),
    });
    if (response.ok) {
      return {
        success: true,
        redirectTo: "/auth/signin",
      };
    } else {
      return {
        success: false,
      };
    }
  },
  updatePassword: async ({ token, new_password }) => {
    const response = await fetch(`${API_URL ?? realAPI_URL}/password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        paicalm: getRamdonToken(),
      },
      body: JSON.stringify({ token, new_password }),
    });
    if (response.ok) {
      return {
        success: true,
        redirectTo: "/auth/signin",
        successNotification: {
          message: "Password has been reset.",
        },
      };
    } else {
      return {
        success: false,
      };
    }
  },
  forgotPassword: async ({ email }) => {
    const response = await fetch(`${API_URL ?? realAPI_URL}/password-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        paicalm: getRamdonToken(),
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      return {
        success: true,
        successNotification: {
          message: "Password reset email has been sent.",
        },
      };
    } else {
      return {
        success: false,
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tempToken");
    useStore.getState().setUser(null);
    return {
      success: true,
      redirectTo: "/auth/signin",
      successNotification: {
        message: "You have successfully logged out",
        description: "You will be redirected to the login page",
      },
    };
  },
  check: async () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("accept_license_token")) {
      // const token = queryParams.get("accept_license_token");
      // const response = await fetch(`${API_URL ?? realAPI_URL}/validate-token`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // if (response.ok) {
      //   return {
      //     authenticated: false,
      //     redirectTo:
      //       "/terms-conditions?token=" +
      //       queryParams.get("accept_license_token"),
      //   };
      // } else {
      //   return {
      //     authenticated: false,
      //     redirectTo: "/link-expired",
      //   };
      // }
      return {
        authenticated: false,
        redirectTo:
          "/terms-conditions?token=" +
          queryParams.get("accept_license_token"),
      };
    }
    if (queryParams.get("token")) {
      return {
        authenticated: false,
        redirectTo: "/auth/signup?token=" + queryParams.get("token"),
      };
    }
    if (queryParams.get("reset")) {
      return {
        authenticated: false,
        redirectTo: "/auth/reset-password?reset=" + queryParams.get("reset"),
      };
    }
    const response = await fetch(`${API_URL ?? realAPI_URL}/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        paicalm: getRamdonToken(),
      },
      body: JSON.stringify({ refresh: localStorage.getItem("refreshToken") }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      return {
        authenticated: true,
      };
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tempToken");
      useStore.getState().setUser(null);
      return {
        authenticated: false,
        redirectTo: "/auth/signin",
      };
    }
  },
  onError: async () => {
    return {};
  },
  getIdentity: async () => {
    const user: User | null = useStore.getState().user ?? null;
    if (!user) {
      const response = await fetch(`${API_URL ?? realAPI_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          paicalm: getRamdonToken(),
        },
      });
      if (response.ok) {
        const data: User = await response.json();
        useStore.getState().setUser(data);
        return data;
      } else {
        return null;
      }
    } else {
      return user;
    }
  },
  getPermissions: async (params) => {
    const user: User | null = await getCurrentUser();
    return aggregatePermissionsByCodename(user?.roles || [], params?.codename);
  },
};
