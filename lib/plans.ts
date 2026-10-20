// Client-safe plan catalog. Stripe price ids stay in lib/checkout.ts.
export const INDIVIDUAL_PLAN = { id: 'individual_monthly', name: 'Individual', price: '29.99' }

export const SQUAD_PLANS = [
  { id: 'pilot_annual', name: 'Pilot', blurb: 'Small crews', price: '1,000', charts: 500, overage: '$2.50' },
  { id: 'small_squad_annual', name: 'Small Squad', blurb: 'Volunteer + small services', price: '3,000', charts: 2000, overage: '$1.90', popular: true },
  { id: 'large_squad_annual', name: 'Large Squad', blurb: 'City + county', price: '6,000', charts: 5000, overage: '$1.40' },
  { id: 'high_volume_annual', name: 'High Volume', blurb: 'Regional + 911', price: '10,000', charts: 10000, overage: '$1.15' },
]

export const SQUAD_PLAN_TYPES = SQUAD_PLANS.map((p) => p.id)

export function planLabel(planType: string) {
  if (planType === INDIVIDUAL_PLAN.id) return `${INDIVIDUAL_PLAN.name}, $${INDIVIDUAL_PLAN.price} / month`
  const p = SQUAD_PLANS.find((plan) => plan.id === planType)
  return p ? `${p.name}, $${p.price} / year · ${p.charts.toLocaleString('en-US')} charts` : ''
}

export function squadCharts(planType: string) {
  return SQUAD_PLANS.find((p) => p.id === planType)!.charts
}
