import { RouterModule, Routes } from "@angular/router";
import { AppURL } from "./app.url";
import { LoginComponent } from "./components/login/login.component";
import { AuthenticationModule } from "./authentication/authentication.module"
import { UnauthenticationGuard } from "./guards/unauthentication.guard";
import { AuthenticationGuard } from "./guards/authentication.guard";


const RouteLists: Routes = [
    { path: '', redirectTo: AppURL.Login, pathMatch: 'full' },
    { path: AppURL.Login, component: LoginComponent, canActivate: [UnauthenticationGuard] },
    { 
        path: AppURL.Authen, loadChildren:() => {
            return AuthenticationModule;
        },
        canActivate:[AuthenticationGuard]
    },
];

export const AppRouting = RouterModule.forRoot(RouteLists);