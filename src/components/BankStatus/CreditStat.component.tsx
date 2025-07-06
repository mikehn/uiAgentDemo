import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * CreditStat – displays credit-card utilisation & next charge information.
 */
export interface CreditStatProps {
  /** Card type key for translation (e.g. "gold", "platinum") */
  cardType: string
  /** Card brand key for translation (e.g. "mastercard", "visa") */
  cardBrand: string
  /** Last four digits of the card (e.g. "4481") */
  last4: string
  /** Upcoming statement date */
  nextChargeDate: Date
  /** Current outstanding amount */
  currentDebt: number
  /** Total credit limit */
  creditLimit: number
  /** Available amount */
  available: number
  /** Optional date range start - if provided, shows billing period view */
  from?: Date
  /** Optional date range end - if provided, shows billing period view */
  to?: Date
}

/**
 * Utility: Format a number as ILS (₪) with two decimals.
 */
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2
  }).format(value)

/**
 * Utility: Format date as dd.MM (e.g. 02.08)
 */
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit'
  }).format(date)

/**
 * Utility: Check if the date range starts at the beginning of the current month
 * and ends today or any day after today (in the same or a future month).
 */
const isCurrentMonthRange = (from?: Date, to?: Date): boolean => {
  console.log('FROM:::', from, 'TO:::', to, '!FROM :::', !from, '!TO :::', !to)
  if (!from || !to) return false

  const today = new Date()
  
  // Normalize dates to remove time components for accurate comparison
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const fromDateOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const currentMonthStartOnly = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth(), currentMonthStart.getDate())
  
  console.log('currentMonthStart::::::::::::::::::::::::::::', currentMonthStart.getTime(),from.getTime())
  
  // 'from' must be the first day of the current month (ignoring time)
  if (fromDateOnly.getTime() !== currentMonthStartOnly.getTime()) return false

  // 'to' must be today or after today (any date >= today)
  // Remove time part for comparison
  const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  console.log(
    'toDate::::::::::::::::::::::::::::',
    toDate.getTime(),
    todayDate.getTime(),
    toDate.getTime() >= todayDate.getTime()
  )
  return toDate.getTime() >= todayDate.getTime()
}

/**
 * Utility: Format date range as "dd.MM - dd.MM"
 */
const formatDateRange = (from: Date, to: Date) => {
  const fromStr = formatDate(from)
  const toStr = formatDate(to)
  return `${fromStr} - ${toStr}`
}

function CreditStat({
  cardType,
  cardBrand,
  last4,
  nextChargeDate,
  currentDebt,
  creditLimit,
  available,
  from,
  to
}: CreditStatProps) {
  const { t, i18n } = useTranslation()

  // Determine direction based on current language
  const isRTL = i18n.language === 'he'
  const direction = isRTL ? 'rtl' : 'ltr'

  // Build translated card label
  const cardLabel = `${cardType} - ${cardBrand}`

  // Clamp percentage between 0-100 to avoid overflowing bar
  const percentageUsed =
    Math.min(Math.max(currentDebt / creditLimit, 0), 1) * 100

  // Determine if we should show date range view or normal credit limit view
  const showDateRangeView = from && to && !isCurrentMonthRange(from, to)

  return (
    <div
      dir={direction}
      className="w-full max-w-sm aspect-[1.586/1] rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 50%, rgba(241,245,249,0.9) 100%),
          radial-gradient(circle at 20% 80%, rgba(99,102,241,0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168,85,247,0.03) 0%, transparent 50%)
        `
      }}
    >
      {/* Header – card title */}
      <div className="flex items-center justify-between">
        <h3 className="truncate text-sm font-semibold text-gray-800">
          {cardLabel}
          <span className="mx-1 text-gray-400">|</span>
          <span className="text-gray-600">{last4}</span>
        </h3>
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm px-3 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200"
        >
          {t('creditStat.actions')}
        </button>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Bottom section with debt info */}
      {showDateRangeView ? (
        /* Date range view - show billing period and total sum */
        <div className="space-y-3">
          {/* Total sum */}
          <div
            className={`flex items-end gap-2 ${
              isRTL ? 'rtl:gap-2' : 'ltr:gap-2'
            }`}
          >
            <span className="text-2xl font-bold leading-none text-gray-900">
              {formatCurrency(currentDebt)}
            </span>
            <span className="mb-1 text-xs text-gray-500">
              {t('creditStat.totalAmount', 'סה״כ')}
            </span>
          </div>

          {/* Billing period */}
          <div className="text-center">
            <div className="text-sm text-gray-600 font-medium">
              {t('creditStat.billingPeriod', 'תקופת חיוב')}:{' '}
              {formatDateRange(from!, to!)}
            </div>
          </div>
        </div>
      ) : (
        /* Normal credit limit view */
        <div className="space-y-3">
          {/* Debt summary */}
          <div
            className={`flex items-end gap-2 ${
              isRTL ? 'rtl:gap-2' : 'ltr:gap-2'
            }`}
          >
            <span className="text-2xl font-bold leading-none text-gray-900">
              {formatCurrency(currentDebt)}
            </span>
            <span className="mb-1 text-xs text-gray-500">
              {t('creditStat.nextChargeIn')} {formatDate(nextChargeDate)}
            </span>
          </div>

          {/* Utilisation bar */}
          <div className="h-1.5 w-full rounded-full bg-gray-200/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm transition-all duration-500 ease-out"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          {/* Limit & available */}
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>
              {t('creditStat.creditLimitPrefix')} {formatCurrency(creditLimit)}
            </span>
            <span>
              {t('creditStat.availablePrefix')} {formatCurrency(available)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreditStat
