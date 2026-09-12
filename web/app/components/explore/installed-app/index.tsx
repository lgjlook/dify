'use client'
import * as React from 'react'
import AppUnavailable from '../../base/app-unavailable'

const InstalledAppFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full bg-background-body pt-2 pl-2">{children}</div>
)

// Installed apps have been removed from the simplified backend (the
// `/console/api/installed-apps` endpoints no longer exist). Keep this
// component so any stale `/installed/[id]` link renders an unavailable page
// instead of issuing requests to the removed endpoints.
const InstalledApp = ({ id }: { id: string }) => {
  void id

  return (
    <InstalledAppFrame>
      <div className="flex h-full items-center justify-center">
        <AppUnavailable code={404} isUnknownReason />
      </div>
    </InstalledAppFrame>
  )
}
export default React.memo(InstalledApp)