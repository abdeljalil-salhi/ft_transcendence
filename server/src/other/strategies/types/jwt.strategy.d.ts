export interface IJWTStrategyValidate {
  userId: number;
}

export interface IJWTStrategyPayload {
  sub: number;
  otp: boolean;
}
