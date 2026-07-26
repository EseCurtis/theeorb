export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
};

export type JwtPayload = {
  email: string;
  id: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = SignInPayload & {
  displayName: string;
};

export type PasswordRecoveryPayload = {
  email: string;
};

export type PasswordResetPayload = {
  password: string;
  token: string;
};

export type AuthSession = {
  token: string;
  user: AuthenticatedUser;
};
