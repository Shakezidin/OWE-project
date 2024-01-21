/**
 * Created by satishazad on 21/01/24
 * File Name: AuthModel
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/core/models/api_models
 */


export interface AuthModel {
    email_id: string
    role: string
    isPasswordChangeRequired: boolean
    accessToken: string
}
