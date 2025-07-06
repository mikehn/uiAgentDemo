import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface LoanRequestProps {
  /** Minimum loan amount */
  minAmount: number
  /** Maximum loan amount */
  maxAmount: number
  /** Optional className for styling */
  className?: string
  /** Callback when loan is successfully approved */
  onSuccess?: (amount: number) => void
}

type LoanStep = 'request' | 'details' | 'pin' | 'loading' | 'success'

function LoanRequest({ minAmount, maxAmount, className = '', onSuccess }: LoanRequestProps) {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState<LoanStep>('request')
  const [loanAmount, setLoanAmount] = useState(minAmount + (maxAmount - minAmount) / 2)
  const [pin, setPin] = useState('')

  const direction = i18n.dir()
  const isRTL = direction === 'rtl'

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(isRTL ? 'he-IL' : 'en-US', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value))
  }

  const handleContinue = () => {
    setStep('details')
  }

  const handleConfirm = () => {
    setStep('pin')
  }

  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      setStep('loading')
      setTimeout(() => {
        setStep('success')
        onSuccess?.(loanAmount)
      }, 2000)
    }
  }

  const handleClose = () => {
    setStep('request')
    setPin('')
  }

  const sliderPercentage = ((loanAmount - minAmount) / (maxAmount - minAmount)) * 100

  return (
    <div dir={direction} className={`w-full max-w-md mx-auto ${className}`.trim()}>
      {step === 'request' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {t('loanRequest.title', 'הלוואה מהירה למזומן')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('loanRequest.subtitle', 'על איזה סכום חשבתם?')}
            </p>
          </div>

          {/* Amount display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-sm text-gray-500">
                {t('loanRequest.editable', 'ניתן להתאים לכם את הצעה הטובה ביותר')}
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatCurrency(loanAmount)}
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min={minAmount}
                max={maxAmount}
                value={loanAmount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, #f59e0b 0%, #f59e0b ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`
                }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full shadow-lg pointer-events-none"
                style={{
                  [isRTL ? 'right' : 'left']: `calc(${sliderPercentage}% - 12px)`
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatCurrency(minAmount)}</span>
              <span>{formatCurrency(maxAmount)}</span>
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            {t('loanRequest.continue', 'בחרתי, אפשר להמשיך')}
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {t('loanRequest.disclaimer', 'כפוף לאישור ותנאי הקלטות ישראכרט מיקום בע"מ, אי עמידה בפרעון ההלוואה או הישראלי עלול לגרור חיוב בריבית פיגורים והליכי הוצאה לפועל')}
          </p>
        </div>
      )}

      {step === 'details' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Header with close */}
          <div className="flex items-center justify-between">
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {t('loanRequest.details.title', 'פרטי ההלוואה')}
            </h2>
            <div className="w-6" />
          </div>

          {/* Loan details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('loanRequest.details.amount', 'סכום הלוואה')}</span>
                <span className="font-semibold">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('loanRequest.details.monthlyPayment', 'תשלום חודשי')}</span>
                <span className="font-semibold">{formatCurrency(Math.round(loanAmount / 12))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('loanRequest.details.period', 'תקופה')}</span>
                <span className="font-semibold">{t('loanRequest.details.months', '12 חודשים')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('loanRequest.details.interestRate', 'ריבית שנתית')}</span>
                <span className="font-semibold">2.9%</span>
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            {t('loanRequest.details.confirm', 'אישור וקבלת ההלוואה')}
          </button>
        </div>
      )}

      {step === 'pin' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {t('loanRequest.pin.title', 'הזינו קוד PIN')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('loanRequest.pin.subtitle', 'לביטחון, אנא הזינו את קוד ה-PIN שלכם')}
            </p>
          </div>

          {/* PIN input */}
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-2xl font-bold py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              maxLength={6}
            />
            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('loanRequest.pin.submit', 'אישור')}
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('loanRequest.loading.title', 'מעבדים את הבקשה')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('loanRequest.loading.subtitle', 'אנא המתינו...')}
            </p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('loanRequest.success.title', 'ההלוואה אושרה!')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('loanRequest.success.subtitle', 'הכסף יועבר לחשבונכם תוך 24 שעות')}
            </p>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(loanAmount)}
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              {t('loanRequest.success.close', 'סגירה')}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default LoanRequest