import React from 'react'
import ChartAreaInteractive from '../components/chart'
import SectionCards from '../components/SectionCard'
function Result() {

  return (
    <div className='min-h-lvw'>

      <div className='pt-20 pl-2 pr-2'>
        <SectionCards />
        <SectionCards />
        <ChartAreaInteractive/>
      </div>
    </div>
  )
}

export default Result
