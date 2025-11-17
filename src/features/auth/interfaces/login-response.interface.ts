export interface LoginResponse {
    readonly user?:          User;
    readonly role?:          Company;
    readonly company?:       Company;
    readonly access_token?:  string;
    readonly refresh_token?: string;
    readonly session_id?:    string;
    readonly navigation?:    Navigation[];
}

export interface Company {
    readonly id?:   string;
    readonly name?: string;
}

export interface Navigation {
    readonly label?:       string;
    readonly route?:       null;
    readonly icon?:        null;
    readonly order?:       number;
    readonly permissions?: Permissions;
}

export interface Permissions {
    readonly canCreate?: boolean;
    readonly canRead?:   boolean;
    readonly canUpdate?: boolean;
    readonly canDelete?: boolean;
}

export interface User {
    readonly id?:        string;
    readonly email?:     string;
    readonly firstName?: string;
    readonly lastName?:  string;
}
