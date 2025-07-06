import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Expense item shape
 */
export interface Expense {
  /** Unique identifier */
  id: string | number
  /** Localised (or plain) description of the transaction */
  description: string
  /** Transaction amount – positive for debit, negative for credit */
  amount: number
  /** ISO 4217 currency code – defaults to ILS (₪) */
  currency?: string
  /** Date the transaction was (or will be) billed */
  billedAt: Date,

  creditId: string
}

export interface ExpenseListProps {
  /** Array of expenses to render */
  expenses: Expense[]
  /** Optional className to extend component styling */
  className?: string
}

/**
 * Utility: Format amount using Intl – falls back to he-IL currency rules.
 */
const formatAmount = (value: number, currency = 'ILS', locale = 'he-IL') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value)

/**
 * Utility: Format billing date as dd.MM.yyyy (mobile hides by default).
 */
const formatDate = (date: Date, locale = 'he-IL') =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)

function ExpenseList({ expenses, className = '' }: ExpenseListProps) {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')

  // Derive filtered list once per render
  const filteredExpenses = useMemo(() => {
    if (!query.trim()) return expenses
    const lower = query.toLowerCase()
    return expenses.filter((e) => e.description.toLowerCase().includes(lower))
  }, [expenses, query])

  const locale = i18n.language === 'he' ? 'he-IL' : i18n.language
  const direction = i18n.dir()

  return (
    <section dir={direction} className={`w-full max-w-md md:max-w-2xl mx-auto ${className}`.trim()}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('expenseList.title', 'פירוט עסקאות')}
        </h2>

        <input
          type="search"
          placeholder={t('expenseList.searchPlaceholder', 'חיפוש')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white/70 p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Subtitle */}
      <p className="mb-3 text-xs text-gray-600">
        {t('expenseList.subtitle', 'עסקאות שאושרו וטרם נקלטו בארץ או בח"ול')}
      </p>

      {/* Expense list */}
      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredExpenses.length === 0 && (
          <li className="p-4 text-sm text-gray-500 text-center">
            {t('expenseList.noResults', 'לא נמצאו עסקאות')}
          </li>
        )}

        {filteredExpenses.map(({ id, description, amount, currency, billedAt }) => (
          <li key={id} className="flex items-center justify-between gap-2 p-4">
            {/* Description + date (desktop) */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[12rem] md:max-w-none">
                {description}
              </span>
              {/* Billing date visible on medium screens */}
              <span className="hidden md:inline text-xs text-gray-500">
                {formatDate(billedAt, locale)}
              </span>
            </div>

            {/* Amount */}
            <span
              className={`text-sm font-semibold ${
                amount >= 0 ? 'text-gray-800' : 'text-green-600'
              }`}
            >
              {formatAmount(amount, currency ?? 'ILS', locale)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExpenseList 