import { Tab } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import CreditStatDemo from './ComponentsShowcase/CreditStatDemo'
import ExpenseListDemo from './ComponentsShowcase/ExpenseListDemo'
import LoanRequestDemo from './ComponentsShowcase/LoanRequestDemo'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function ComponentsShowcase() {
  const { t } = useTranslation()

  const tabs = [
    { id: 'credit', label: 'CreditStat', element: <CreditStatDemo /> },
    { id: 'expense', label: 'ExpenseList', element: <ExpenseListDemo /> },
    { id: 'loan', label: 'LoanRequest', element: <LoanRequestDemo /> }
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Page header */}
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">{t('componentsShowcase')}</h2>
        <p className="text-gray-600 max-w-2xl">{t('componentsShowcaseDesc')}</p>
      </header>

      <Tab.Group>
        {/* Mobile-friendly horizontally scrollable tab list */}
        <Tab.List className="flex gap-2 rounded-xl bg-gray-100 p-1 w-full overflow-x-auto whitespace-nowrap">
          {tabs.map(({ id, label }) => (
            <Tab
              key={id}
              className={({ selected }) =>
                classNames(
                  'px-4 py-2 text-sm font-medium rounded-lg focus:outline-none',
                  selected ? 'bg-white shadow text-gray-900' : 'text-gray-700 hover:bg-white/[0.6]'
                )
              }
            >
              {label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6">
          {tabs.map(({ id, element }) => (
            <Tab.Panel key={id} className="focus:outline-none">
              {element}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ComponentsShowcase 