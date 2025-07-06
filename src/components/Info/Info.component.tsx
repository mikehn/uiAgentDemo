import React from 'react'
import { useTranslation } from 'react-i18next'

export interface InfoAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  color?: 'default' | 'primary' | 'warning' | 'danger'
}

export interface InfoProps {
  /** List of action buttons to display. If omitted, default actions will be used */
  actions?: InfoAction[]
  /** Optional additional class name */
  className?: string
  /** Title for the actions section */
  title?: string
}

const defaultActionIds = ['lockCard', 'replaceCard', 'increaseLimit', 'statements', 'installments', 'support'] as const

type DefaultActionId = (typeof defaultActionIds)[number]

function buildDefaultActions(t: (k: string, d?: string) => string): InfoAction[] {
  const makeIcon = (id: DefaultActionId) => {
    switch (id) {
      case 'lockCard':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )
      case 'replaceCard':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      case 'increaseLimit':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'statements':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'installments':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'support':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 1021.75 12 9.75 9.75 0 0012 2.25zM15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
          </svg>
        )
      default:
        return null
    }
  }

  const actionColors: Record<DefaultActionId, InfoAction['color']> = {
    lockCard: 'warning',
    replaceCard: 'primary',
    increaseLimit: 'primary',
    statements: 'default',
    installments: 'default',
    support: 'default'
  }

  return defaultActionIds.map((id) => ({
    id,
    label: t(`info.actions.${id}`, id),
    icon: makeIcon(id),
    color: actionColors[id]
  }))
}

function getButtonClasses(color: InfoAction['color'] = 'default') {
  const baseClasses = 'group relative flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  switch (color) {
    case 'primary':
      return `${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 focus:ring-blue-500 shadow-sm hover:shadow-md`
    case 'warning':
      return `${baseClasses} bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 hover:from-amber-100 hover:to-orange-100 hover:border-amber-200 focus:ring-amber-500 shadow-sm hover:shadow-md`
    case 'danger':
      return `${baseClasses} bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-100 hover:from-red-100 hover:to-rose-100 hover:border-red-200 focus:ring-red-500 shadow-sm hover:shadow-md`
    default:
      return `${baseClasses} bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-100 hover:from-gray-100 hover:to-slate-100 hover:border-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md`
  }
}

function getIconClasses(color: InfoAction['color'] = 'default') {
  switch (color) {
    case 'primary':
      return 'text-blue-600 group-hover:text-blue-700'
    case 'warning':
      return 'text-amber-600 group-hover:text-amber-700'
    case 'danger':
      return 'text-red-600 group-hover:text-red-700'
    default:
      return 'text-gray-600 group-hover:text-gray-700'
  }
}

const InfoActions: React.FC<InfoProps> = ({ actions, className = '', title }) => {
  const { t, i18n } = useTranslation()
  const direction = i18n.dir()
  const actionList = actions && actions.length ? actions : buildDefaultActions(t)
  const displayTitle = title || t('info.title', 'Quick Actions')

  return (
    <div dir={direction} className={`w-full max-w-2xl mx-auto ${className}`.trim()}>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            {displayTitle}
          </h2>
        </div>
        
        {/* Actions Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {actionList.map(({ id, label, icon, onClick, color }) => (
              <button
                key={id}
                type="button"
                onClick={onClick}
                className={getButtonClasses(color)}
              >
                <div className="flex items-center justify-center">
                  <span className={getIconClasses(color)}>{icon}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 text-center leading-tight">
                  {label}
                </span>
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoActions 