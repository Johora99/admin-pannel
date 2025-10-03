import React from 'react'
import bgImg from '../assets/Mass Circles.svg'
export default function SideBg() {
  return (
      <div className="hidden lg:block w-full h-full">
      <img src={bgImg} alt="Mass Circles" className="w-full h-full object-cover" />
      </div>
  )
}
