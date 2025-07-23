import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import ChartAreaInteractive from "../components/Chart";
import { useSelector, useDispatch } from 'react-redux'
import { setStrategyTradeType } from "../redux/features/modelAndChart";

export default function BuildStrategy() {
    const [chartData, setChartData] = useState([])
    const state = useSelector((state) => state)
    useEffect(() => {
        axios.post("http://127.0.0.1:8000/api/graphOHLCV?Limit=99", {
            exchange: "kraken",
            symbol: "BTC",
            market: "spot",
        }).then((res) => {
            setChartData(res.data)
        })
    }, []);
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Closing Price
                <ChartAreaInteractive chartData={chartData} key={chartData.length} />
            </h1>
            <h1 className="text-2xl font-bold">Strategy Builder</h1>

            {/* Indicators */}
            <Card>
                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Indicators</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className='p-1'>EMA Small (span)</Label>
                            <Input
                                type="number"
                                value={state.strategyParams.emaSmall}
                                onChange={(e) => setStrategyTradeType(['emaSmall',e.target.value])}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>EMA Large (span)</Label>
                            <Input
                                type="number"
                                value={state.strategyParams.emaLarge}
                                onChange={(e) => setStrategyTradeType(['emaLarge',e.target.value])}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>RSI Period</Label>
                            <Input
                                type="number"
                                value={state.strategyParams.rsi}
                                onChange={(e) => setStrategyTradeType(['rsi',e.target.value])}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>MACD Signal Period</Label>
                            <Input
                                type="number"
                                value={state.strategyParams.macdSignal}
                                onChange={(e) => setStrategyTradeType(['rsi',e.target.value])}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Define Conditions</h2>
                    <div className="grid grid-cols-4 gap-6 p-4">
                        {['Long Entry', 'Long Exit', 'Short Entry', 'Short Exit'].map((tp) => (
                            <div key={tp} className="space-y-4">
                                
                                <h3 className="text-center text-lg font-semibold border-b pb-2">{tp}</h3>

                                {["EMAC", "MACDC", "RSIC"].map((rule) => (
                                    <div key={rule} className="space-y-2 border rounded-lg p-3 shadow-sm">
                                        <h4 className="text-sm font-medium">{rule} :</h4>
                                        {(rule === "EMAC"|| rule==="MACDC") ? (
                                            <div className="flex items-center justify-between space-x-2">
                                                <Label className="text-sm">{rule.slice(0,rule.length-1)} Small</Label>
                                                <Input className="w-16" />
                                                <Label className="text-sm">{rule.slice(0,rule.length-1)} Large</Label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between space-x-2">
                                                <Label className="text-sm">{rule.slice(0, rule.length - 1)}</Label>
                                                <Input className="w-16" />
                                                <Input className="w-20" type="number"/>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Trade Rules</h2>
                    {["longEnter", "longExit", "shortEnter", "shortExit"].map((rule) => (
                        <div key={rule} className="space-y-2">
                            <Label className="capitalize">{rule.replace(/([A-Z])/g, " $1")}</Label>
                            <Input
                                placeholder="Condition (e.g., EMA && RSI)"
                                value={strategy[rule].condition}
                                onChange={(e) =>
                                    setStrategy({
                                        ...strategy,
                                        [rule]: { ...strategy[rule], condition: e.target.value },
                                    })
                                }
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Execution & Risk */}
            <Card>
                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Execution & Risk</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className='p-1'>Leverage</Label>
                            <Input
                                type="number"
                                value={execution.leverage}
                                onChange={(e) => setExecution({ ...execution, leverage: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Fee (bps)</Label>
                            <Input
                                type="number"
                                value={execution.feeBps}
                                onChange={(e) => setExecution({ ...execution, feeBps: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Portfolio Size</Label>
                            <Input
                                type="number"
                                value={execution.portfolio}
                                onChange={(e) => setExecution({ ...execution, portfolio: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Stop Loss (%)</Label>
                            <Input
                                type="number"
                                value={risk.stopLoss}
                                onChange={(e) => setRisk({ ...risk, stopLoss: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Take Profit (%)</Label>
                            <Input
                                type="number"
                                value={risk.takeProfit}
                                onChange={(e) => setRisk({ ...risk, takeProfit: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={handleSubmit}>
                Run Backtest
            </Button>
        </div>
    );
}
