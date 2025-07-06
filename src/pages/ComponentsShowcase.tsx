import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreditStat from 'components/BankStatus/CreditStat.component'
import { Tab } from '@headlessui/react'
import ExpenseList, { Expense } from 'components/BankStatus/ExpenseList.component'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function ComponentsShowcase() {
  const { t } = useTranslation()

  /* ----------------------- CreditStat demo state ----------------------- */
  const [cardType, setCardType] = useState('gold')
  const [cardBrand, setCardBrand] = useState('mastercard')
  const [last4, setLast4] = useState('4481')
  const [nextChargeDate, setNextChargeDate] = useState('2024-08-02')
  const [currentDebt, setCurrentDebt] = useState(0)
  const [creditLimit, setCreditLimit] = useState(12000)
  const [available, setAvailable] = useState(11866.66)

  /* ----------------------- ExpenseList sample data --------------------- */
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      description: t('demo.expenses.groceries', 'קניות בסופר'),
      amount: 250.9,
      billedAt: new Date('2024-07-15'),
      currency: 'ILS'
    },
    {
      id: 2,
      description: t('demo.expenses.coffee', 'קפה ומאפה'),
      amount: 18.5,
      billedAt: new Date('2024-07-18'),
      currency: 'ILS'
    },
    {
      id: 3,
      description: t('demo.expenses.online', 'Amazon Online'),
      amount: 120.99,
      billedAt: new Date('2024-07-20'),
      currency: 'USD'
    },
    {
      id: 4,
      description: t('demo.expenses.gas', 'תדלוק תחנת דלק'),
      amount: 220,
      billedAt: new Date('2024-07-22'),
      currency: 'ILS'
    }
  ])

  /* ----------------------- ExpenseControls component ------------------- */
  function ExpenseControls() {
    const [desc, setDesc] = useState('')
    const [amt, setAmt] = useState('')
    const [curr, setCurr] = useState('ILS')
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

    const handleAdd = () => {
      if (!desc || !amt) return
      const newExpense: Expense = {
        id: Date.now(),
        description: desc,
        amount: parseFloat(amt),
        currency: curr,
        billedAt: new Date(date)
      }
      setExpenses((prev) => [...prev, newExpense])
      setDesc('')
      setAmt('')
    }

    return (
      <div className="space-y-4 md:order-first">
        <h3 className="text-xl font-semibold">Add expense</h3>
        <div className="grid gap-4">
          <label className="flex flex-col text-sm font-medium">
            Description
            <input
              className="rounded border p-2"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              type="text"
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            Amount
            <input
              className="rounded border p-2"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              type="number"
              step="0.01"
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            Currency
            <select
              className="rounded border p-2"
              value={curr}
              onChange={(e) => setCurr(e.target.value)}
            >
              <option value="ILS">ILS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium">
            Billed date
            <input
              className="rounded border p-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!desc || !amt}
          >
            {t('expenseList.add', 'הוסף')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page header */}
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">{t('componentsShowcase')}</h2>
        <p className="text-gray-600 max-w-2xl">{t('componentsShowcaseDesc')}</p>
      </header>

      {/* Tabs for each component demo */}
      <Tab.Group>
        <Tab.List className="flex gap-2 rounded-xl bg-gray-100 p-1 w-full sm:w-auto">
          {[
            { id: 'credit', label: 'CreditStat' },
            { id: 'expense', label: 'ExpenseList' }
          ].map(({ id, label }) => (
            <Tab key={id} className={({ selected }) =>
              classNames(
                'flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg focus:outline-none',
                selected ? 'bg-white shadow text-gray-900' : 'text-gray-700 hover:bg-white/[0.6]')
            }>
              {label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {/* CreditStat Panel */}
          <Tab.Panel className="space-y-6 focus:outline-none">
            <section className="grid gap-8 md:grid-cols-2">
              {/* Live preview – first on mobile */}
              <div className="flex items-start justify-center md:order-last">
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

              {/* Controls – appear below on mobile, left on desktop */}
              <div className="space-y-4 md:order-first">
                <h3 className="text-xl font-semibold">CreditStat props</h3>

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
            </section>
          </Tab.Panel>

          {/* ExpenseList Panel */}
          <Tab.Panel className="space-y-6 focus:outline-none">
            <section className="grid gap-8 md:grid-cols-2">
              {/* Preview first on mobile */}
              <ExpenseList expenses={expenses} className="md:order-last" />

              {/* Controls */}
              <ExpenseControls />
            </section>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ComponentsShowcase 