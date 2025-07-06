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
  /** Filter expenses from this date (inclusive) */
  fromDate?: Date
  /** Filter expenses to this date (inclusive) */
  toDate?: Date
  /** Filter expenses by credit ID */
  creditId: string
  /** Optional extra className */
  className?: string
}

/**
 * CartdStatus – combines a credit-card utilisation "stat" with a list of recent expenses.
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
  fromDate,
  toDate,
  creditId,
  className = ''
}: CartdStatusProps) {
  const { i18n } = useTranslation()

  const direction = i18n.dir()
  console.log("Date range",fromDate,toDate)

  // Filter expenses based on date range and credit ID
  const filteredExpenses = expenses.filter(expense => {
    // Filter by credit ID
    if (expense.creditId !== creditId) {
      return false
    }

    // Filter by date range
    if (fromDate && expense.billedAt < fromDate) {
      return false
    }
    if (toDate && expense.billedAt > toDate) {
      return false
    }

    return true
  })

  // Compute current debt from filtered expenses (positive amounts add, negative amounts subtract)
  const currentDebt = filteredExpenses.reduce((sum, { amount }) => sum + amount, 0)
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
        from={fromDate}
        to={toDate}
      />

      {/* Expenses */}
      <ExpenseList expenses={filteredExpenses} />
    </div>
  )
}

export default CartdStatus 