import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreditStat from 'components/BankStatus/CreditStat.component'

function CreditStatControls({
  cardType,
  setCardType,
  cardBrand,
  setCardBrand,
  last4,
  setLast4,
  nextChargeDate,
  setNextChargeDate,
  currentDebt,
  setCurrentDebt,
  creditLimit,
  setCreditLimit,
  available,
  setAvailable
}: {
  cardType: string
  setCardType: (v: string) => void
  cardBrand: string
  setCardBrand: (v: string) => void
  last4: string
  setLast4: (v: string) => void
  nextChargeDate: string
  setNextChargeDate: (v: string) => void
  currentDebt: number
  setCurrentDebt: (v: number) => void
  creditLimit: number
  setCreditLimit: (v: number) => void
  available: number
  setAvailable: (v: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {t('creditStat.controls', 'CreditStat props')}
      </h3>

      <div className="grid gap-4">
        <label className="flex flex-col text-sm font-medium">
          Card type
          <select
            className="rounded border p-2"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="classic">Classic</option>
            <option value="business">Business</option>
          </select>
        </label>

        <label className="flex flex-col text-sm font-medium">
          Card brand
          <select
            className="rounded border p-2"
            value={cardBrand}
            onChange={(e) => setCardBrand(e.target.value)}
          >
            <option value="mastercard">Mastercard</option>
            <option value="visa">Visa</option>
            <option value="americanExpress">American Express</option>
            <option value="isracard">Isracard</option>
          </select>
        </label>

        <label className="flex flex-col text-sm font-medium">
          Last 4 digits
          <input
            className="rounded border p-2"
            type="text"
            maxLength={4}
            value={last4}
            onChange={(e) => setLast4(e.target.value)}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Next charge date
          <input
            className="rounded border p-2"
            type="date"
            value={nextChargeDate}
            onChange={(e) => setNextChargeDate(e.target.value)}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Current debt (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="0.01"
            value={currentDebt}
            onChange={(e) => setCurrentDebt(parseFloat(e.target.value))}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Credit limit (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="0.01"
            value={creditLimit}
            onChange={(e) => setCreditLimit(parseFloat(e.target.value))}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Available (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="0.01"
            value={available}
            onChange={(e) => setAvailable(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}

function CreditStatDemo() {
  const [cardType, setCardType] = useState('gold')
  const [cardBrand, setCardBrand] = useState('mastercard')
  const [last4, setLast4] = useState('4481')
  const [nextChargeDate, setNextChargeDate] = useState('2024-08-02')
  const [currentDebt, setCurrentDebt] = useState(0)
  const [creditLimit, setCreditLimit] = useState(12000)
  const [available, setAvailable] = useState(11866.66)

  return (
    <section className="space-y-6">
      {/* Preview */}
      <div className="flex items-start justify-center">
        <CreditStat
          cardType={cardType}
          cardBrand={cardBrand}
          last4={last4}
          nextChargeDate={new Date(nextChargeDate)}
          currentDebt={currentDebt}
          creditLimit={creditLimit}
          available={available}
        />
      </div>

      {/* Controls */}
      <CreditStatControls
        cardType={cardType}
        setCardType={setCardType}
        cardBrand={cardBrand}
        setCardBrand={setCardBrand}
        last4={last4}
        setLast4={setLast4}
        nextChargeDate={nextChargeDate}
        setNextChargeDate={setNextChargeDate}
        currentDebt={currentDebt}
        setCurrentDebt={setCurrentDebt}
        creditLimit={creditLimit}
        setCreditLimit={setCreditLimit}
        available={available}
        setAvailable={setAvailable}
      />
    </section>
  )
}

export default CreditStatDemo 