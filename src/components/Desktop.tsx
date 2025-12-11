import React from 'react'

export default function Desktop({ profile }: { profile: any }) {
  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <div className="text-lg font-semibold">Virtual Desktop — Welcome {profile?.name ?? 'Guest'}</div>
        <div className="text-sm">{new Date().toLocaleTimeString()}</div>
      </header>

      <main className="mt-6">
        <div className="flex gap-3">
          <button className="px-3 py-2 bg-gray-800 rounded">Messages</button>
          <button className="px-3 py-2 bg-gray-800 rounded">Mini Games</button>
          <button className="px-3 py-2 bg-gray-800 rounded">Profile</button>
        </div>

        <section className="mt-6">
          <p>This is the desktop shell. Windows will be draggable/resizable here.</p>
        </section>
      </main>
    </div>
  )
}