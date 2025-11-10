import { BaseApiModel } from "../../../../common/interfaces/base-api-model.interface";

export const ApiAuth: Record<string, BaseApiModel> = {
    login: {
        name: 'login',
        path: 'auth'
    },
    refresh: {
        name: 'refresh',
        path: 'auth/refresh'
    },
    logout: {
        name: 'logout',
        path: 'auth/logout'
    }
}