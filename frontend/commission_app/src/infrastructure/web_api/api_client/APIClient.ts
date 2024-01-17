/**
 * Created by satishazad on 16/01/24
 * File Name: APIClient
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/infrastructure/web_api/api_client
 */
import {HTTP_STATUS, RequestModel} from "../../../core/models/api_models/RequestModel";
import Config from "../../../config/Config";
import {getAuthorizationHeader, HttpHeadersDefault} from "./RequestConstants";


export const httpRequest = async (req: RequestModel) => {

    //---- API URL ----
    let url = new URL(req.endPoint, Config.instance.config.apiBaseUrl)

    //---- Headers ----
    let headers = new Headers();

    //Append Default Headers
    let defaultHeaders = { ...HttpHeadersDefault };
    for(let key in defaultHeaders) {
        headers.append(key, defaultHeaders[key]);
    }

    //Append provided external headers
    if (req.headers) {
        for(let key in req.headers) {
            headers.append(key, req.headers[key]);
        }
    }

    //Append Authorization Headers
    let auth = await getAuthorizationHeader();
    for(let key in auth) {
        headers.append(key, auth[key]);
    }

    //---- Make Request ----
    let res = await fetch(url, {
        headers: headers,
        body: req.body
    });

    if (res.status === HTTP_STATUS.OK) {
        //Success
        let json = await res.json();
        console.log('API RESULT:: ' + url, json)
        return json
    }

    if (res.status === HTTP_STATUS.UN_AUTHORIZED) {
        //Navigate to Login Page and reset data

    }

    throw new Error('HTTP Error ' + res.status);
}
