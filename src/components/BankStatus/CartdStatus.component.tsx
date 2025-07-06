import React from 'react'
import { useTranslation } from 'react-i18next'

import CreditStat from 'components/BankStatus/CreditStat.component'
import ExpenseList, { Expense } from 'components/BankStatus/ExpenseList.component'

export interface CartdStatusProps {
  // Credit card display props
  cardType: string
  cardBrand: string
  last4: string
  nextChargeDate: Date
  creditLimit: number
  /** List of expenses used to derive the current debt */
  expenses: Expense[]
  /** Optional extra className */
  className?: string
}

/**
 * CartdStatus – combines a credit-card utilisation “stat” with a list of recent expenses.
 *
 * ┌──────────────────────┐
 * │  CreditStat          │
 * ├──────────────────────┤
 * │  ExpenseList         │
 * └──────────────────────┘
 */
function CartdStatus({
  cardType,
  cardBrand,
  last4,
  nextChargeDate,
  creditLimit,
  expenses,
  className = ''
}: CartdStatusProps) {
  const { i18n } = useTranslation()

  const direction = i18n.dir()

  // Compute current debt from expenses (positive amounts add, negative amounts subtract)
  const currentDebt = expenses.reduce((sum, { amount }) => sum + amount, 0)
  // Derive available based on credit limit
  const available = creditLimit - currentDebt

  return (
    <div dir={direction} className={`space-y-6 ${className}`.trim()}>
      {/* Stat */}
      <CreditStat
        cardType={cardType}
        cardBrand={cardBrand}
        last4={last4}
        nextChargeDate={nextChargeDate}
        currentDebt={currentDebt}
        creditLimit={creditLimit}
        available={available}
      />

      {/* Expenses */}
      <ExpenseList expenses={expenses} />
    </div>
  )
}

export default CartdStatus 