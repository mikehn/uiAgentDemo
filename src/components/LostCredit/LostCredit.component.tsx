import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface CreditCardInfo {
  creditName: string
  creditId: string
  last4Digits: string
  imageLink?: string
}

export interface LostCreditProps {
  /** Cards available for reporting */
  cards: CreditCardInfo[]
  /** Optional additional class name */
  className?: string
  /** Callback after the user finishes the flow */
  onComplete?: (cardId: string, reason: 'lost' | 'stolen' | 'payments') => void
}

/** Internal steps for the flow */
type LostCreditStep = 'select' | 'reason' | 'confirm'

const LostCredit: React.FC<LostCreditProps> = ({ cards, className = '', onComplete }) => {
  const { t, i18n } = useTranslation()
  const direction = i18n.dir()
  const isRTL = direction === 'rtl'

  const [step, setStep] = useState<LostCreditStep>('select')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [reason, setReason] = useState<'lost' | 'stolen' | 'payments' | null>(null)

  const selectedCard = selectedIndex !== null ? cards[selectedIndex] : null

  const handleSelectContinue = () => {
    if (selectedIndex !== null) {
      setStep('reason')
    }
  }

  const handleReasonContinue = () => {
    if (reason && selectedCard) {
      setStep('confirm')
      onComplete?.(selectedCard.creditId, reason)
    }
  }

  const handleDone = () => {
    // Reset flow for potential reuse
    setStep('select')
    setSelectedIndex(null)
    setReason(null)
  }

  return (
    <div dir={direction} className={`w-full max-w-md mx-auto ${className}`.trim()}>
      {/* Step 1 – Select card */}
      {step === 'select' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-center text-gray-900">
            {t('lostCredit.title', 'דיווח על כרטיס אבוד או גנוב')}
          </h2>
          <p className="text-sm text-gray-600 text-center">
            {t('lostCredit.subtitle', 'החליקו ובחרו את הכרטיס שברצונכם לדווח עליו')}
          </p>

          {/* Card slider */}
          <div className="flex overflow-x-auto gap-4 py-4 no-scrollbar snap-x snap-mandatory">
            {cards.map((card, idx) => (
              <button
                key={card.creditId}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex-none w-64 snap-center bg-gray-50 rounded-xl p-4 border-2 transition-colors ${
                  selectedIndex === idx ? 'border-amber-500' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {card.imageLink ? (
                    <img src={card.imageLink} alt={card.creditName} className="w-12 h-8 object-contain" />
                  ) : (
                    <div className="w-12 h-8 bg-gray-200 rounded" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 truncate max-w-[8rem]">
                      {card.creditName}
                    </div>
                    <div className="text-sm text-gray-500">•••• {card.last4Digits}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSelectContinue}
            disabled={selectedIndex === null}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              selectedIndex === null
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
          >
            {t('lostCredit.continue', 'המשך')}
          </button>
        </div>
      )}

      {/* Step 2 – Choose reason */}
      {step === 'reason' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-center text-gray-900">
            {t('lostCredit.reasonTitle', 'מה קרה?')}
          </h2>

          <div className="space-y-4">
            {(['lost', 'stolen', 'payments'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setReason(option)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                  reason === option ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                }`}
              >
                <span className="font-medium text-gray-900">
                  {t(`lostCredit.reasons.${option}`, option)}
                </span>
                {reason === option && (
                  <svg
                    className="w-6 h-6 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleReasonContinue}
            disabled={!reason}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              !reason ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {t('lostCredit.continue', 'המשך')}
          </button>
        </div>
      )}

      {/* Step 3 – Confirmation */}
      {step === 'confirm' && selectedCard && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 text-center">
          <svg
            className="w-16 h-16 mx-auto text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">
            {t('lostCredit.confirmTitle', 'הדיווח התקבל')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('lostCredit.confirmSubtitle', 'נחסום את הכרטיס וננפיק כרטיס חלופי בקרוב. נעדכן אתכם בהמשך.')}
          </p>

          <button
            onClick={handleDone}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            {t('lostCredit.done', 'סיום')}
          </button>
        </div>
      )}
    </div>
  )
}

export default LostCredit 