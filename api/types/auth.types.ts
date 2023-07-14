export interface LoginReturnProps {
    token: string;
}

export interface SignupReturnProps {
    token: string;
}

export interface OAuthReturnProps { }

export interface OAuthProps {
    code: string;
    app: string;
}

export interface SetPasswordRequestProps {
    token: string;
    password: string;
}

export interface SetPasswordReturnProps {
    token: string;
}

export interface CompleteSignupRequestProps {
    token: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface CompleteSignupReturnProps extends SetPasswordReturnProps { }
