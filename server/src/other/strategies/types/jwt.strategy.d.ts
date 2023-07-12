export interface IJWTStrategyValidate {
  userId: string;
}

export interface IJWTStrategyPayload {
  sub: string;
  otp: boolean;
}
