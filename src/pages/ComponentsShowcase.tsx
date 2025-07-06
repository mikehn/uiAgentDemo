import { Tab } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
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
    <Layout title={t('componentsShowcase')}>
      <div className="space-y-6">
        {/* Description */}
        <div className="text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">{t('componentsShowcaseDesc')}</p>
        </div>

        <Tab.Group>
          {/* Mobile-friendly horizontally scrollable tab list */}
          <Tab.List className="flex gap-2 rounded-xl bg-white p-1 w-full overflow-x-auto whitespace-nowrap shadow-sm border border-gray-200">
            {tabs.map(({ id, label }) => (
              <Tab
                key={id}
                className={({ selected }) =>
                  classNames(
                    'px-4 py-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200',
                    selected ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-50'
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
    </Layout>
  )
}

export default ComponentsShowcase 