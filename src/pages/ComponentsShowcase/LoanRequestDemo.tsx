import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LoanRequest from 'components/LoanRequest/LoanRequst.component'

function LoanRequestControls({
  minAmount,
  maxAmount,
  sliderStep,
  setMinAmount,
  setMaxAmount,
  setSliderStep
}: {
  minAmount: number
  maxAmount: number
  sliderStep: number
  setMinAmount: (v: number) => void
  setMaxAmount: (v: number) => void
  setSliderStep: (v: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{t('loanRequest.controls', 'LoanRequest props')}</h3>
      <div className="grid gap-4">
        <label className="flex flex-col text-sm font-medium">
          Min amount (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="1000"
            value={minAmount}
            onChange={(e) => setMinAmount(parseInt(e.target.value, 10))}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Max amount (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="1000"
            value={maxAmount}
            onChange={(e) => setMaxAmount(parseInt(e.target.value, 10))}
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Slider step (₪)
          <input
            className="rounded border p-2"
            type="number"
            step="1000"
            value={sliderStep}
            onChange={(e) => setSliderStep(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
    </div>
  )
}

function LoanRequestDemo() {
  const [minAmount, setMinAmount] = useState(5000)
  const [maxAmount, setMaxAmount] = useState(200000)
  const [sliderStep, setSliderStep] = useState(1000)

  return (
    <section className="space-y-6">
      {/* Preview */}
      <div>
        <LoanRequest
          minAmount={minAmount}
          maxAmount={maxAmount}
          sliderStep={sliderStep}
          onSuccess={(amount) => console.log('Loan approved:', amount)}
        />
      </div>

      {/* Controls */}
      <LoanRequestControls
        minAmount={minAmount}
        maxAmount={maxAmount}
        sliderStep={sliderStep}
        setMinAmount={setMinAmount}
        setMaxAmount={setMaxAmount}
        setSliderStep={setSliderStep}
      />
    </section>
  )
}

export default LoanRequestDemo 