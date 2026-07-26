export type AuthenticatedUser = {
  displayName: string
  email: string
  id: string
}

export type AuthSession = {
  token: string
  user: AuthenticatedUser
}

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = SignInInput & {
  displayName: string
}

export type PasswordRecoveryInput = {
  email: string
}

export type PasswordResetInput = {
  password: string
  token: string
}
