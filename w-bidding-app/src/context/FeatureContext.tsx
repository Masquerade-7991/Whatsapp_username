import React, { createContext, useContext, useState } from 'react'

type ReachEstimateState = 'loading' | 'success' | 'no-history' | 'error'

interface FeatureContextValue {
  metaEnabled: boolean
  setMetaEnabled: (v: boolean) => void
  reachEstimateState: ReachEstimateState
  setReachEstimateState: (v: ReachEstimateState) => void
  whatsappUsernamesEnabled: boolean
  setWhatsappUsernamesEnabled: (v: boolean) => void
}

const FeatureContext = createContext<FeatureContextValue | null>(null)

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [metaEnabled, setMetaEnabled] = useState(true)
  const [reachEstimateState, setReachEstimateState] = useState<ReachEstimateState>('success')
  const [whatsappUsernamesEnabled, setWhatsappUsernamesEnabled] = useState(false)

  return (
    <FeatureContext.Provider value={{ metaEnabled, setMetaEnabled, reachEstimateState, setReachEstimateState, whatsappUsernamesEnabled, setWhatsappUsernamesEnabled }}>
      {children}
    </FeatureContext.Provider>
  )
}

export function useFeature() {
  const ctx = useContext(FeatureContext)
  if (!ctx) throw new Error('useFeature must be used inside FeatureProvider')
  return ctx
}
