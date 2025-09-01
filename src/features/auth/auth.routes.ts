import { FeatureRoute } from "../../common/services/route-config.service";

export const authRoutes: FeatureRoute[] = [
    {
        path: 'auth',
        loadComponent: () => import('./auth.component')
    }
];

export function registerAuthRoutes() {
    return authRoutes;
}