import { Routes } from '@angular/router';
import { LayoutComponent } from './presentation/layout/layout.component';
import { HomeComponent } from './presentation/home/home.component';

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
