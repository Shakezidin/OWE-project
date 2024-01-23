/**
 * Created by satishazad on 21/01/24
 * File Name: AuthService
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/infrastructure/web_api/services
 */

import {HTTP_METHOD, HTTP_STATUS, RequestModel} from "../../../core/models/api_models/RequestModel";
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

    // let res = await fetch('https://dummyjson.com/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //
    //         username: 'kminchelle',
    //         password: '0lelplR',
    //         // expiresInMins: 60, // optional
    //     })
    // });
    //
    // if (res.status === HTTP_STATUS.OK) {
    //     return {
    //         email_id: 'admin@test.com',
    //         role: 'admin',
    //         isPasswordChangeRequired: true,
    //         accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGlkIjoiYWRtaW5AdGVzdC5jb20iLCJyb2xlbmFtZSI6ImFkbWluIiwiZXhwIjoxNzA1ODQ5OTI0fQ.uWfjWKM1xGTeUFtozcSrXfL1C7dJaQCGneDSO2Cfp7E'
    //     }
    // }
    //
    // throw new Error('Error ' + res.status);
}
