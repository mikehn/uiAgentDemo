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

function CreditStat({
  cardType,
  cardBrand,
  last4,
  nextChargeDate,
  currentDebt,
  creditLimit,
  available
}: CreditStatProps) {
  const { t, i18n } = useTranslation()
  
  // Determine direction based on current language
  const isRTL = i18n.language === 'he'
  const direction = isRTL ? 'rtl' : 'ltr'
  
  // Build translated card label
  const cardLabel = `${t(`cardTypes.${cardType}`)} - ${t(`cardBrands.${cardBrand}`)}`
  
  // Clamp percentage between 0-100 to avoid overflowing bar
  const percentageUsed = Math.min(Math.max(currentDebt / creditLimit, 0), 1) * 100

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
      <div className="space-y-3">
        {/* Debt summary */}
        <div className={`flex items-end gap-2 ${isRTL ? 'rtl:gap-2' : 'ltr:gap-2'}`}>
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
          <span>{t('creditStat.creditLimitPrefix')} {formatCurrency(creditLimit)}</span>
          <span>{t('creditStat.availablePrefix')} {formatCurrency(available)}</span>
        </div>
      </div>
    </div>
  )
}

export default CreditStat