import { BaseApiModel } from "../../../../common/interfaces/base-api-model.interface";

export const ApiAuth: Record<string, BaseApiModel> = {
    login: {
        name: 'login',
        path: 'auth',
        version: 'v1'
    },
    refresh: {
        name: 'refresh',
        path: 'auth/refresh',
        version: 'v1'
    },
    logout: {
        name: 'logout',
        path: 'auth/logout',
        version: 'v1'
    }
}