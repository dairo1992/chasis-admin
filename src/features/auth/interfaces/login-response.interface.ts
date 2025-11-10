export interface LoginResponse {
    readonly user?:          string;
    readonly role?:          string;
    readonly company?:       string;
    readonly access_token?:  string;
    readonly refresh_token?: string;
    readonly session_id?:    string;
    readonly permissions?:   Permission[];
}

export interface Permission {
    readonly uuid?:     string;
    readonly name?:     string;
    readonly code?:     string;
    readonly resource?: string;
    readonly action?:   string;
}
