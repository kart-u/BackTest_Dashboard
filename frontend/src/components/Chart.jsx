import React from "react"
import { useState, useRef } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"




const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Close",
    color: "var(--chart-1)",
  }
}

export default function ChartAreaInteractive(props) {
  const chartData=props.chartData
  const VISIBLE_COUNT = 50;
  const [mousedown, setMouseDown] = useState(false)
  const [visibleDate, setVisibleDate] = useState(chartData.length - VISIBLE_COUNT)
  
  const flag = useRef(null)
  const visibleDateRef = useRef(visibleDate)
  const startx = useRef(null)
  
  
  
  const handleMouseDown = (e) => {
    setMouseDown(true)
    startx.current = e.clientX;
  }
  const handleMouseUp = () => {
    setMouseDown(false)
    startx.current = null;
    flag.current = null
  }
  const handleMouseMove = (e) => {
    if (mousedown) {
      if (flag.current || startx.current == null) return
      flag.current = requestAnimationFrame(() => {
        let shift = e.clientX - startx.current
        const senstivity = 10
        shift = -Math.floor(shift / senstivity)
        if (shift !== 0) {
          let mx = Math.min(visibleDate + shift, chartData.length - VISIBLE_COUNT);
          mx = Math.max(0, mx);
          if (mx !== visibleDateRef.current) {
            visibleDateRef.current = mx;
            setVisibleDate(mx);
            startx.current=e.clientX
          }
        }
        flag.current = null
      })
    }
    return
  }
  const filteredData = chartData.slice(visibleDate, visibleDate + VISIBLE_COUNT)

  return (
    <Card className="p-4 m-4">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div
          className={`w-full h-full select-none chartWrapperDiv`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] min-w-auto"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="green"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="green"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric"
                  })
                }}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="close"
                type="linear"
                fill="url(#fillDesktop)"
                stroke="green"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
            
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
