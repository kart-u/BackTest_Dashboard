import React from "react";
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
import { TestTube } from "lucide-react";

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    console.log("Submitted data:", errors);
    console.log("Submitted data:", register('kartu.king'));
  };

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
          {...register("coinName", { required: "Coin name is required" })}
        />
        {errors.coinName && (
          <p className="text-sm text-red-500">{errors.coinName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="market">Select Market</Label>
        <Select onValueChange={(value) => setValue("market", value)}>
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
        {errors.market && (
          <p className="text-sm text-red-500">Market is required</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
