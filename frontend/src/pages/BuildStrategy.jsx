import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChartAreaInteractive from "../components/Chart";
import { useSelector, useDispatch } from 'react-redux'
import { setStrategy, setExecutionParams, setRiskParams } from "../redux/features/modelAndChart";
import { useLoaderData, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

export default function BuildStrategy() {
    const chartData = useLoaderData()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isloading,setLoading]=useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = () => {
        try{
            setLoading(true)
            navigate("/result");
        }
        catch(err){
            setLoading(false)
            console.log(err);
        }
    };
    if(isloading){
        return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
        )
    }
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-2xl font-bold">
                    Closing Price
                    <ChartAreaInteractive chartData={chartData} x="close" y="timestamp" key={chartData.length} />
                </h1>
                <h1 className="text-2xl font-bold">Strategy Builder</h1>

                {/* Indicators */}
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="text-lg font-semibold">Indicators</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                ["emaSmall", "EMA Small (span)"],
                                ["emaLarge", "EMA Large (span)"],
                                ["rsi", "RSI Period"],
                                ["macdSignal", "MACD Signal Period"],
                            ].map(([field, label]) => {
                                const fieldRegister = register(field, { required: "Required" });
                                return (
                                    <div key={field}>
                                        <Label className="p-1">{label}</Label>
                                        <Input
                                            type="number"
                                            {...fieldRegister}
                                            onChange={(e) => {
                                                fieldRegister.onChange(e);
                                                dispatch(setStrategy([field, e.target.value]));
                                            }}
                                        />
                                        {errors[field] && (
                                            <p className="text-red-500 text-sm">{errors[field]?.message}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Define Conditions */}
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="text-lg font-semibold">Define Conditions</h2>
                        <div className="grid grid-cols-4 gap-6 p-4">
                            {['longEnter', 'longExit', 'shortEnter', 'shortExit'].map((tp) => (
                                <div key={tp} className="space-y-4">
                                    <h3 className="text-center text-lg font-semibold border-b pb-2">
                                        {tp.replace(/([a-z])([A-Z])/g, "$1 $2")
                                            .split(" ")
                                            .map((str) => str[0].toUpperCase() + str.slice(1).toLowerCase())
                                            .join(" ")}
                                    </h3>

                                    {["EMAC", "MACDC", "RSIC"].map((rule) => (
                                        <div key={rule} className="space-y-2 border rounded-lg p-3 shadow-sm">
                                            <h4 className="text-sm font-medium">{rule} :</h4>
                                            {(rule === "EMAC" || rule === "MACDC") ? (
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label className="text-sm">{rule.slice(0, rule.length - 1)} Small</Label>
                                                    <Input
                                                        className="w-16"
                                                        {...register(`${tp}.${rule}.relation`, { required: "Required" })}
                                                        onChange={(e) => {
                                                            dispatch(setStrategy([
                                                                tp, rule.slice(0, rule.length - 1).toLowerCase(), 'relation', e.target.value
                                                            ]));
                                                        }}
                                                    />
                                                    <Label className="text-sm">{rule.slice(0, rule.length - 1)} Large</Label>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label className="text-sm">{rule.slice(0, rule.length - 1)}</Label>
                                                    <Input
                                                        className="w-16"
                                                        {...register(`${tp}.${rule}.relation`, { required: "Required" })}
                                                        onChange={(e) => {
                                                            dispatch(setStrategy([
                                                                tp, rule.slice(0, rule.length - 1).toLowerCase(), 'relation', e.target.value
                                                            ]));
                                                        }}
                                                    />
                                                    <Input
                                                        className="w-20"
                                                        type="number"
                                                        {...register(`${tp}.${rule}.value`, { required: "Required" })}
                                                        onChange={(e) => {
                                                            dispatch(setStrategy([
                                                                tp, rule.slice(0, rule.length - 1).toLowerCase(), 'value', e.target.value
                                                            ]));
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Trade Rules */}
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="text-lg font-semibold">Trade Rules</h2>
                        {["longEnter", "longExit", "shortEnter", "shortExit"].map((tp) => {
                            const fieldRegister = register(`${tp}.condition`, { required: "Required" });
                            return (
                                <div key={tp} className="space-y-2">
                                    <Label className="capitalize">
                                        {tp.replace(/([a-z])([A-Z])/g, "$1 $2")
                                            .split(" ")
                                            .map((str) => str[0].toUpperCase() + str.slice(1).toLowerCase())
                                            .join(" ")}
                                    </Label>
                                    <Input
                                        placeholder="Condition (e.g., EMAC && RSIC)"
                                        {...fieldRegister}
                                        onChange={(e) => {
                                            fieldRegister.onChange(e);
                                            dispatch(setStrategy([tp, 'condition', e.target.value]));
                                        }}
                                    />
                                    {errors?.[tp]?.condition && (
                                        <p className="text-red-500 text-sm">{errors?.[tp]?.condition?.message}</p>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Execution & Risk */}
                <Card>
                    <CardContent className="space-y-4">
                        <h2 className="text-lg font-semibold">Execution & Risk</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                ["leverage", "Leverage", setExecutionParams],
                                ["feeBps", "Fee (bps)", setExecutionParams],
                                ["portfolio", "Portfolio Size", setExecutionParams],
                                ["stopLoss", "Stop Loss (%)", setRiskParams],
                                ["takeProfit", "Take Profit (%)", setRiskParams],
                            ].map(([field, label, action]) => {
                                const fieldRegister = register(field, { required: "Required" });
                                return (
                                    <div key={field}>
                                        <Label className="p-1">{label}</Label>
                                        <Input
                                            type="number"
                                            {...fieldRegister}
                                            onChange={(e) => {
                                                fieldRegister.onChange(e);
                                                dispatch(action([field, e.target.value]));
                                            }}
                                        />
                                        {errors[field] && (
                                            <p className="text-red-500 text-sm">{errors[field]?.message}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Button className="w-full" type="submit">
                    Run Backtest
                </Button>
            </form>
        </div>
    );
}
