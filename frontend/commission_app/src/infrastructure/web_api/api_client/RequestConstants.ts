/**
 * Created by satishazad on 16/01/24
 * File Name: RequestConstants
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/infrastructure/web_api/api_client
 */


export const HTTP_HEADERS_DEFAULT: Record<string, string> = {
    'Content-Type': 'application/json'
}


export const AuthorizationHeader = async (): Promise<Record<string, string>> => {
    //ToDo:- Return Authorization
    return {}
}
