import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { setExchange } from "../redux/features/modelAndChart";
import { useNavigate } from "react-router";

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isloading,setLoading]=useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate();

  const onSubmit = async (data) => {
    setLoading(true)
    dispatch(setExchange(data.formData));
    axios.post("http://127.0.0.1:8000/api/linkMethod",data.formData).then(
      (res)=>{
        console.log(res.status)
        navigate('/strategy')
      }
    ).catch((err)=>{setLoading(false);console.log(err)})
  };


  if(isloading){
    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto p-4"
    >
      <div className="space-y-2">
        <Label htmlFor="coinName">Coin Name</Label>
        <Input
          id="coinName"
          placeholder="e.g., BTC"
          {...register("formData.symbols.0", { required: "Coin name is required" })}
        />

        {(errors.formData?.symbols) && (
          <p className="text-sm text-red-500">{errors.formData?.symbols.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="market">Select Exchange</Label>
        <Select required onValueChange={(value) => {setValue("formData.exchanges.0", value);}}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="binance">Binance</SelectItem>
            <SelectItem value="coinbase">Coinbase</SelectItem>
            <SelectItem value="kraken">Kraken</SelectItem>
            <SelectItem value="bybit">Bybit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="market">Select Market</Label>
        <Select required onValueChange={(value) => {setValue("formData.market", value);}}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spot">Spot</SelectItem>
            <SelectItem value="futures">Futures</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
