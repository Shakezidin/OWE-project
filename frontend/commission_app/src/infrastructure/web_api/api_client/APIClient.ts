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
import {ResponseModel} from "../../../core/models/api_models/ResponseModel";


export const httpRequest = async <T>(req: RequestModel): Promise<ResponseModel<T>> => {
    console.log('API REQUEST:: ', req);

    //---- API URL ----
    console.log('Config:: ', Config.instance.config);
    let urlStr = Config.instance.config.apiBaseUrl + req.endPoint;
    let url = urlStr; //new URL('', urlStr);

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
        headers: defaultHeaders,
        method: req.method,
        body: req.body
    });


    console.log('API RESPONSE:: ', res);
    console.log('API RESULT:: ', await res.json());

    if (res.status === HTTP_STATUS.OK) {
        //Success
        let json = await res.json();

        console.log('API RESULT:: ' + url, json)
        if (json.status === HTTP_STATUS.OK) {
            return {
                status: json.status,
                message: json.message,
                data: json.data as T
            };
        } else {
            throw new Error('Error ' + json.status + ' : ' + json.message);
        }
    }

    if (res.status === HTTP_STATUS.UN_AUTHORIZED) {
        //Navigate to Login Page and reset data

    }

    throw new Error('HTTP Error ' + res.status);
}
