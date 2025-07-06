import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ExpenseList, { Expense } from 'components/BankStatus/ExpenseList.component'

function ExpenseControls({ addExpense }: { addExpense: (e: Expense) => void }) {
  const { t } = useTranslation()
  const [desc, setDesc] = useState('')
  const [amt, setAmt] = useState('')
  const [curr, setCurr] = useState('ILS')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const handleAdd = () => {
    if (!desc || !amt) return
    addExpense({
      id: Date.now(),
      description: desc,
      amount: parseFloat(amt),
      currency: curr,
      billedAt: new Date(date)
    })
    setDesc('')
    setAmt('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{t('expenseList.controls', 'Add expense')}</h3>
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

function ExpenseListDemo() {
  const { t } = useTranslation()
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

  const addExpense = (exp: Expense) => setExpenses((prev) => [...prev, exp])

  return (
    <section className="space-y-6">
      {/* Preview */}
      <ExpenseList expenses={expenses} />

      {/* Controls */}
      <ExpenseControls addExpense={addExpense} />
    </section>
  )
}

export default ExpenseListDemo 