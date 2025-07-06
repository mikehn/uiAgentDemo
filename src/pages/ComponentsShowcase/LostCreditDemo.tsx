import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LostCredit, { CreditCardInfo } from 'components/LostCredit/LostCredit.component'

// Default cards sample (taken from mockData/creditInfo.json)
const defaultCards: CreditCardInfo[] = [
  {
    creditName: 'ויזה כ.א.ל',
    creditId: '12345678',
    last4Digits: '1234',
    imageLink: 'https://example.com/images/visa.png'
  },
  {
    creditName: 'מאסטרקארד ישראכרט',
    creditId: '87654321',
    last4Digits: '5678',
    imageLink: 'https://example.com/images/mastercard.png'
  },
  {
    creditName: 'אמריקן אקספרס',
    creditId: '11223344',
    last4Digits: '9012',
    imageLink: 'https://example.com/images/amex.png'
  }
]

function LostCreditControls({ numCards, setNumCards, maxCards }: { numCards: number; setNumCards: (n: number) => void; maxCards: number }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{t('lostCredit.controls', 'LostCredit props')}</h3>
      <div className="grid gap-4 max-w-xs">
        <label className="flex flex-col text-sm font-medium">
          {t('lostCredit.cardsToShow', 'Cards to show')}
          <input
            className="rounded border p-2"
            type="number"
            min={1}
            max={maxCards}
            value={numCards}
            onChange={(e) => setNumCards(Math.max(1, Math.min(maxCards, parseInt(e.target.value || '1', 10))))}
          />
        </label>
      </div>
    </div>
  )
}

function LostCreditDemo() {
  const maxCards = defaultCards.length
  const [numCards, setNumCards] = useState(maxCards)

  const cards = defaultCards.slice(0, numCards)

  return (
    <section className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center">
        <LostCredit
          cards={cards}
          onComplete={(cardId, reason) => console.log('LostCredit report:', { cardId, reason })}
        />
      </div>

      {/* Controls */}
      <LostCreditControls numCards={numCards} setNumCards={setNumCards} maxCards={maxCards} />
    </section>
  )
}

export default LostCreditDemo 