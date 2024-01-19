/**
 * Created by satishazad on 16/01/24
 * File Name: ResponseModel
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/models/api_models
 */
import {JSONData} from "../../common/CustomDataTypes";


export interface ResponseModel {
    status: boolean
    message: string
    data: JSONData
}
