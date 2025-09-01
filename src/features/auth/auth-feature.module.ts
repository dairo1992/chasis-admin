import { FeatureConfig, FeatureFactory, FeatureModule } from "../../common/factories/feature.factory";

export class AuthFeatureModule extends FeatureModule {
    getConfig(): FeatureConfig {
        return {
            name: 'auth',
            displayName: 'Authentication',
            version: '1.0.0',
            routes: [
                {
                    path: 'auth',
                    children: []
                }
            ],
            menuItems: []
        };
    }
}


const authFeature = new AuthFeatureModule();
FeatureFactory.registerFeature(authFeature.getConfig());