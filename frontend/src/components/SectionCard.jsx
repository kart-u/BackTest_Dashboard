import React from "react"
import Cards from "./Card"


export default function SectionCards(props) {
  return (
    <div className="flex justify-center p-2">
      <Cards content={props.state.maxDrawdown} dis="Max Drawdown"/>
      <Cards content={props.state.totalTrades} win={props.state.winTrades} dis="Trades"/>
      <Cards content={props.state.sharpe} dis="Sharpe"/>
      <Cards content={props.state.pnl} dis="Pnl"/>
    </div>
  )
}
