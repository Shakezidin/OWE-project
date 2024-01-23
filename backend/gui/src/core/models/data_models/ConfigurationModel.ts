/**
 * Created by satishazad on 16/01/24
 * File Name: ConfigurationModel
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/models/data_models
 */
import {JSONObject} from "../../common/CustomDataTypes";


export interface ConfigurationModel {
    envName: string
    apiBaseUrl: string
}


export const creatConfigModelFromJSON = (json: JSONObject): ConfigurationModel => {
    return {
        envName: json.env_name,
        apiBaseUrl: json.api_base_url
    }
}
