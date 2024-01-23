/**
 * Created by satishazad on 23/01/24
 * File Name: MenuItemModel
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/models/data_models
 */
import {JSONObject} from "../../common/CustomDataTypes";
import {ICONS} from "../../../ui/icons/Icons";


interface MenuItem {
    name: string
    label: string
    //icon: any
}


class MenuItemModel implements MenuItem {
    name: string;
    label: string;
    //icon: string

    constructor(json: JSONObject) {
        this.name = json.name;
        this.label = json.label;
        //this.icon = require(ICONS.MENU_1)
    }
}


export {
    MenuItemModel
}
