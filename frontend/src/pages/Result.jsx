import React from 'react'
import ChartAreaInteractive from '../components/Chart'
import SectionCards from '../components/SectionCard'
import { Card } from '@/components/ui/card'
import { useLoaderData } from 'react-router'
const chartData=[]
function Result() {
  const chartData=useLoaderData();
  const state={
    maxDrawdown:chartData.at(-1).maxDrawdown,
    totalTrades:chartData.at(-1).totalTrades,
    winTrades:chartData.at(-1).winTrades,
    sharpe:chartData.at(-1).sharpe,
    pnl:chartData.at(-1).pnl
  }
  return (
      <div>
        <Card>
          <SectionCards state={state} />
          <ChartAreaInteractive chartData={chartData} x="returns" y="timestamp" key={chartData.length}/>
        </Card>
      </div>
  )
}

export default Result
