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

// Card icon component
const CreditCardIcon: React.FC<{ cardName: string; isSelected: boolean }> = ({ cardName, isSelected }) => {
  const getCardColor = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('visa') || lowerName.includes('ויזה')) {
      return isSelected ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-500'
    }
    if (lowerName.includes('mastercard') || lowerName.includes('מאסטרקארד')) {
      return isSelected ? 'from-red-500 to-orange-500' : 'from-red-400 to-orange-400'
    }
    if (lowerName.includes('american') || lowerName.includes('amex') || lowerName.includes('אמריקן')) {
      return isSelected ? 'from-green-500 to-green-600' : 'from-green-400 to-green-500'
    }
    return isSelected ? 'from-gray-600 to-gray-700' : 'from-gray-500 to-gray-600'
  }

  return (
    <div className={`w-14 h-10 rounded-lg bg-gradient-to-br ${getCardColor(cardName)} flex items-center justify-center shadow-md`}>
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    </div>
  )
}

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

  const getReasonIcon = (reasonType: 'lost' | 'stolen' | 'payments') => {
    switch (reasonType) {
      case 'lost':
        return (
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'stolen':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'payments':
        return (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div dir={direction} className={`w-full max-w-lg mx-auto ${className}`.trim()}>
      {/* Step 1 – Select card */}
      {step === 'select' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('lostCredit.title', 'דיווח על כרטיס אבוד או גנוב')}
              </h2>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {t('lostCredit.subtitle', 'החליקו ובחרו את הכרטיס שברצונכם לדווח עליו')}
            </p>
          </div>

          <div className="p-6">
            {/* Card slider */}
            <div className="flex overflow-x-auto gap-4 py-4 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory">
              {cards.map((card, idx) => (
                <button
                  key={card.creditId}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group flex-none w-72 sm:w-80 snap-center rounded-2xl p-5 border-2 transition-all duration-200 transform hover:scale-105 ${
                    selectedIndex === idx 
                      ? 'border-red-500 bg-red-50 shadow-lg' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <CreditCardIcon cardName={card.creditName} isSelected={selectedIndex === idx} />
                    <div className="text-left flex-1">
                      <div className="font-bold text-gray-900 truncate text-lg">
                        {card.creditName}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">•••• {card.last4Digits}</div>
                    </div>
                    {selectedIndex === idx && (
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectContinue}
              disabled={selectedIndex === null}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform ${
                selectedIndex === null
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 active:scale-95 shadow-lg'
              }`}
            >
              {t('lostCredit.continue', 'המשך')}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 – Choose reason */}
      {step === 'reason' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-5 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              {t('lostCredit.reasonTitle', 'מה קרה?')}
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {(['lost', 'stolen', 'payments'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReason(option)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    reason === option 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getReasonIcon(option)}
                  </div>
                  <span className="font-semibold text-gray-900 text-lg flex-1 text-left">
                    {t(`lostCredit.reasons.${option}`, option)}
                  </span>
                  {reason === option && (
                    <svg
                      className="w-6 h-6 text-blue-500 flex-shrink-0"
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
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform mt-6 ${
                !reason 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 active:scale-95 shadow-lg'
              }`}
            >
              {t('lostCredit.continue', 'המשך')}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 – Confirmation */}
      {step === 'confirm' && selectedCard && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('lostCredit.confirmTitle', 'הדיווח התקבל')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('lostCredit.confirmSubtitle', 'נחסום את הכרטיס וננפיק כרטיס חלופי בקרוב. נעדכן אתכם בהמשך.')}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3">
                <CreditCardIcon cardName={selectedCard.creditName} isSelected={false} />
                <div>
                  <div className="font-semibold text-gray-900">{selectedCard.creditName}</div>
                  <div className="text-sm text-gray-500 font-mono">•••• {selectedCard.last4Digits}</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-2xl font-bold text-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {t('lostCredit.done', 'סיום')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LostCredit 