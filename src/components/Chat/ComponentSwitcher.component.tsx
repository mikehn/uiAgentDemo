import React from 'react'
import { AgentSelectorResponse } from '../../services/AI/jsonSchema.lib'
import CartdStatus from '../BankStatus/CartdStatus.component'
import LoanRequest from '../LoanRequest/LoanRequst.component'
import LostCredit from '../LostCredit/LostCredit.component'
import InfoActions from '../Info/Info.component'
import { Expense } from '../BankStatus/ExpenseList.component'

// Import mock data from JSON files located under src/mockData
import expensesJson from '@/mockData/expensses.json'
import creditCardsJson from '@/mockData/creditInfo.json'

// Transform imported JSON into the shapes required by our components
const mockExpenses: Expense[] = (expensesJson as any[]).map((item, idx) => ({
  id: idx + 1,
  description: item.description,
  amount: item.amount,
  billedAt: new Date(item.date),
  creditId: item.creditId
}))

const mockCards = (creditCardsJson as any[]).map((card) => ({
  creditName: card.creditName,
  creditId: card.creditId,
  last4Digits: card.last4Digits,
  imageLink: card.imageLink,
  billingDate: new Date(card.billingDate), // ensure valid Date object
  creditLimit: card.creditLimit
}))

export interface ComponentSwitcherProps {
  response: AgentSelectorResponse
  onComplete?: (result: any) => void
  className?: string
}

const ComponentSwitcher: React.FC<ComponentSwitcherProps> = ({
  response,
  onComplete,
  className = ''
}) => {
  const handleComplete = (result: any) => {
    onComplete?.(result)
  }

  switch (response.callType) {
    case 'expense':
      console.log(">>>",response.expense)
      const defaultCard = mockCards[0]
      const card =
        mockCards.find((c) => c.creditId === response.expense?.card) ||
        defaultCard
      return (
        <div className={className}>
          <CartdStatus
            cardType="Credit"
            cardBrand={card.creditName}
            last4={card.last4Digits}
            nextChargeDate={card.billingDate} // 30 days from now
            creditLimit={card.creditLimit}
            expenses={mockExpenses}
            fromDate={
              response.expense?.dates?.[0]
                ? new Date(response.expense.dates[0])
                : undefined
            }
            toDate={
              response.expense?.dates?.[1]
                ? new Date(response.expense.dates[1])
                : undefined
            }
            creditId={card.creditId}
            className="max-w-2xl mx-auto"
          />
        </div>
      ) 

    case 'loan':
      return (
        <div className={className}>
          <LoanRequest
            minAmount={1000}
            maxAmount={50000}
            sliderStep={1000}
            onSuccess={handleComplete}
            className="max-w-2xl mx-auto"
          />
        </div>
      )

    case 'lost':
      return (
        <div className={className}>
          <LostCredit
            cards={mockCards}
            onComplete={handleComplete}
            className="max-w-2xl mx-auto"
          />
        </div>
      )

    case 'info':
      return (
        <div className={className}>
          <InfoActions className="max-w-2xl mx-auto" />
        </div>
      )

    case 'followup':
      return (
        <div className={`${className} max-w-2xl mx-auto`}>
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  I need more information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {response.followup}
                </p>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className={`${className} max-w-2xl mx-auto`}>
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  I need clarification
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I'm not sure how to help with that. Please try rephrasing your
                  request or be more specific about what you need assistance
                  with.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

export default ComponentSwitcher
