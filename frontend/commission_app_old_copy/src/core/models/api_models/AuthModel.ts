/**
 * Created by satishazad on 21/01/24
 * File Name: AuthModel
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/models/api_models
 */


export interface AuthModel {
    emailId: string
    role: string
    isPasswordChangeRequired: boolean
    accessToken: string
}


export interface Credentials {
    username: string
    password: string
}


export interface AuthContextDataModel {
    auth: AuthModel | null
    login?: (username: string, password: string) => Promise<void>
    logout?: () => Promise<void>
}
