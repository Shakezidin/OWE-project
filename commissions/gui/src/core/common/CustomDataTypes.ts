/**
 * Created by satishazad on 16/01/24
 * File Name: CustomDataTypes
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/common
 */


export type JSONObject = {[key: string]: any};

export type JSONArray = JSONObject[] | string[] | number[];

export type JSONData = JSONObject | JSONArray | string | number | boolean
