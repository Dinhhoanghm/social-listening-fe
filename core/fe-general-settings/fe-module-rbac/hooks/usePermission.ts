import { appSelector } from "@/fe-cores/reducers";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const getMenu: any = (menus: any, router: string) => {
  return menus.reduce((result: any, menu: any) => {
    if (menu?.link === router) {
      return result.concat([menu]);
    }
    if (!!menu?.children) {
      return result.concat(getMenu(menu.children, router));
    }
    return result;
  }, []);
};

export const useHookPermissions = (router: string) => {
  const menus = useSelector(appSelector.getItemsMenu);
  return useMemo(() => {
    const result = getMenu(menus, router);
    const menu = result.length === 1 ? result[0] : {};
    const permissions: any = {};
    (menu?.permissions || []).forEach((permission: any) => {
      permissions[permission.action] = !!permission.isCheck;
    });
    return permissions;
  }, [menus]);
};
