import React, { useState } from 'react'
import Onboarding from './components/Onboarding'
import Desktop from './components/Desktop'

export default function App() {
  const [profile, setProfile] = useState<{name?:string, timezone?:string, avatarDataUrl?:string}>({})
  const [isOnboarded, setIsOnboarded] = useState(false)

  return (
    <div className="app">
      {!isOnboarded ? (
        <Onboarding
          onComplete={(data) => {
            setProfile(data)
            setIsOnboarded(true)
          }}
        />
      ) : (
        <Desktop profile={profile} />
      )}
    </div>
  )
}