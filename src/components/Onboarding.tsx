import React, { useState } from 'react'

type Props = {
  onComplete: (data: {name?:string, timezone?:string, avatarDataUrl?:string}) => void
}

export default function Onboarding({ onComplete }: Props) {
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')

  const handleComplete = () => {
    onComplete({ name, timezone })
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <div className="mb-3">
        <label className="block text-sm">Name</label>
        <input className="mt-1 w-full rounded px-3 py-2 text-black" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="mb-3">
        <label className="block text-sm">Timezone</label>
        <input className="mt-1 w-full rounded px-3 py-2 text-black" value={timezone} onChange={e => setTimezone(e.target.value)} />
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-indigo-600 rounded" onClick={handleComplete}>Continue</button>
      </div>
      <p className="mt-3 text-sm">Optional: add webcam avatar later in Profile settings.</p>
    </div>
  )
}