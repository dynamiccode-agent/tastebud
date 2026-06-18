export const REWARDS = {
  POINTS_PER_DOLLAR: 1,   // $1 spent = 1 point
  REDEMPTION_RATE: 1,      // 1 point = $1 off
  MIN_POINTS: 5,            // minimum $5 in points to redeem
  MAX_DISCOUNT_PCT: 0.5,   // max 50% of order total
} as const

export function calcPointsEarned(paidDollars: number): number {
  return Math.floor(paidDollars * REWARDS.POINTS_PER_DOLLAR)
}

export function pointsToDollars(points: number): number {
  return points / REWARDS.REDEMPTION_RATE
}

export function dollarsToPoints(dollars: number): number {
  return Math.floor(dollars * REWARDS.REDEMPTION_RATE)
}

export function calcMaxRedeemablePoints(balance: number, orderTotalDollars: number): number {
  const maxByPercent = dollarsToPoints(orderTotalDollars * REWARDS.MAX_DISCOUNT_PCT)
  return Math.min(balance, maxByPercent)
}
