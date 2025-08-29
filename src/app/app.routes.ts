import { Routes } from '@angular/router';
import { LayoutComponent } from '../../common/layout/layout.component';
import { HomeComponent } from '../../features/home/presentation/home.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];
