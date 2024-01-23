/**
 * Created by satishazad on 23/01/24
 * File Name: SideMenuList
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/resources/static_data
 */

import {MenuItemModel} from "../../core/models/data_models/MenuItemModel";


export const getMenuList = (): MenuItemModel[] => {
    let items = new Array<MenuItemModel>()

    items.push(new MenuItemModel({ name: 'dashboard', label: 'Dashboard' }));
    items.push(new MenuItemModel({ name: 'configure', label: 'Configure' }));
    items.push(new MenuItemModel({ name: 'on_boarding', label: 'On Boarding' }));
    items.push(new MenuItemModel({ name: 'projects', label: 'Projects' }));
    items.push(new MenuItemModel({ name: 'reports', label: 'Reports' }));
    items.push(new MenuItemModel({ name: 'database_controller', label: 'Database Controller' }));
    items.push(new MenuItemModel({ name: 'user_management', label: 'User Management' }));
    items.push(new MenuItemModel({ name: 'contact_support', label: 'Contact Support' }));
    items.push(new MenuItemModel({ name: 'my_account', label: 'My_Account' }));
    items.push(new MenuItemModel({ name: 'logout', label: 'Logout' }));

    return items;
}
