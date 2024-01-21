/**
 * Created by satishazad on 21/01/24
 * File Name: AuthService
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/infrastructure/web_api/services
 */

import {HTTP_METHOD, RequestModel} from "../../../core/models/api_models/RequestModel";
import {httpRequest} from "../api_client/APIClient";
import {AuthModel} from "../../../core/models/api_models/AuthModel";
import {EndPoints} from "../api_client/EndPoints";


/**
 * Login API Service
 * */
export const loginAPI = async (credential: { username: string, password: string }): Promise<AuthModel> => {
    let request: RequestModel = {
        endPoint: EndPoints.AUTH.LOGIN,
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
            emailid: credential.username,
            password: credential.password
        })
    }

    let result = await httpRequest<AuthModel>(request);

    console.log('loginAPI:: ', result);
    return result.data;
}
