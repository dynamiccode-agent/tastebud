export const REWARDS = {
  POINTS_PER_DOLLAR: 10,
  REDEMPTION_RATE: 100,   // 100 pts = $1
  MIN_POINTS: 500,         // minimum to redeem ($5 value)
  MAX_DISCOUNT_PCT: 0.5,   // max 50% of order total
} as const

export function calcPointsEarned(paidDollars: number): number {
  return Math.floor(paidDollars * REWARDS.POINTS_PER_DOLLAR)
}

export function pointsToDollars(points: number): number {
  return Math.floor(points / REWARDS.REDEMPTION_RATE * 100) / 100
}

export function dollarsToPoints(dollars: number): number {
  return Math.floor(dollars * REWARDS.REDEMPTION_RATE)
}

export function calcMaxRedeemablePoints(balance: number, orderTotalDollars: number): number {
  const maxByPercent = dollarsToPoints(orderTotalDollars * REWARDS.MAX_DISCOUNT_PCT)
  return Math.min(balance, maxByPercent)
}
