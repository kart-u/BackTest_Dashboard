import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import ChartAreaInteractive from "../components/Chart";
import { useSelector, useDispatch } from 'react-redux'
import { setStrategy,setExecutionParams,setRiskParams } from "../redux/features/modelAndChart";
import { useLoaderData } from "react-router";

export default function BuildStrategy() {
    const chartData=useLoaderData()
    const dispatch=useDispatch();
    const handleSubmit=()=>{
        console.log(state)
    }
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
                                onChange={(e) => (dispatch(setStrategy(['emaSmall',e.target.value])))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>EMA Large (span)</Label>
                            <Input
                                type="number"
                                onChange={(e) => (dispatch(setStrategy(['emaLarge',e.target.value])))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>RSI Period</Label>
                            <Input
                                type="number"
                                onChange={(e) => (dispatch(setStrategy(['rsi',e.target.value])))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>MACD Signal Period</Label>
                            <Input
                                type="number"
                                onChange={(e) => (dispatch(setStrategy(['macdSignal',e.target.value])))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Define Conditions</h2>
                    <div className="grid grid-cols-4 gap-6 p-4">
                        {['longEnter', 'longExit', 'shortEnter', 'shortExit'].map((tp) => (
                            <div key={tp} className="space-y-4">
                                
                                <h3 className="text-center text-lg font-semibold border-b pb-2">{
                                        tp.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((str)=>(str[0].toUpperCase()+str.slice(1).toLowerCase())).join(" ")
                                    }</h3>

                                {["EMAC", "MACDC", "RSIC"].map((rule) => (
                                    <div key={rule} className="space-y-2 border rounded-lg p-3 shadow-sm">
                                        <h4 className="text-sm font-medium">{rule} :</h4>
                                        {(rule === "EMAC"|| rule==="MACDC") ? (
                                            <div className="flex items-center justify-between space-x-2">
                                                <Label className="text-sm">{rule.slice(0,rule.length-1)} Small</Label>
                                                <Input className="w-16" onChange={(e)=>(dispatch(setStrategy([
                                                    tp,rule.slice(0,rule.length-1).toLowerCase(),'relation',e.target.value
                                                ])))}/>
                                                <Label className="text-sm">{rule.slice(0,rule.length-1)} Large</Label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between space-x-2">
                                                <Label className="text-sm">{rule.slice(0, rule.length - 1)}</Label>
                                                <Input className="w-16" onChange={(e)=>(dispatch(setStrategy([
                                                    tp,rule.slice(0,rule.length-1).toLowerCase(),'relation',e.target.value
                                                ])))} />
                                                <Input className="w-20" type="number" onChange={(e)=>(dispatch(setStrategy([
                                                    tp,rule.slice(0,rule.length-1).toLowerCase(),'value',e.target.value
                                                ])))}/>
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
                    {["longEnter", "longExit", "shortEnter", "shortExit"].map((tp) => (
                        <div key={tp} className="space-y-2">
                            <Label className="capitalize">{tp.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((str)=>(str[0].toUpperCase()+str.slice(1).toLowerCase())).join(" ")}</Label>
                            <Input
                                placeholder="Condition (e.g., EMAC && RSIC)"
                                onChange={(e)=>(dispatch(setStrategy([tp,'condition',e.target.value])))}
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
                                onChange={(e) => dispatch(setExecutionParams(['leverage',e.target.value]))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Fee (bps)</Label>
                            <Input
                                type="number"
                                onChange={(e) => dispatch(setExecutionParams(['feeBps',e.target.value]))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Portfolio Size</Label>
                            <Input
                                type="number"
                                onChange={(e) => dispatch(setExecutionParams(['portfolio',e.target.value]))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Stop Loss (%)</Label>
                            <Input
                                type="number"
                                onChange={(e) => dispatch(setRiskParams(['stopLoss',e.target.value]))}
                            />
                        </div>
                        <div>
                            <Label className='p-1'>Take Profit (%)</Label>
                            <Input
                                type="number"
                                onChange={(e) => dispatch(setRiskParams(['takeProfit',e.target.value]))}
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
