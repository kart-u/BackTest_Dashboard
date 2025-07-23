import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  exchange:{
    exchanges:[],
    symbols:[],
    market:"",
  },
  strategyParams:{
    longEnter:{
        ema:{
            relation:""
        },
        macd:{
            relation:""
        },
        rsi:{
            value:0,
            relation:""
        },
        condition:""
    },
    longExit:{
        ema:{
            relation:""
        },
        macd:{
            relation:""
        },
        rsi:{
            value:0,
            relation:""
        },
        condition:""
    },
    shortEnter:{
        ema:{
            relation:""
        },
        macd:{
            relation:""
        },
        rsi:{
            value:0,
            relation:""
        },
        condition:""
    },
    shortExit:{
        ema:{
            relation:""
        },
        macd:{
            relation:""
        },
        rsi:{
            value:0,
            relation:""
        },
        condition:""
    },
    emaSmall:0,
    emaLarge:0,
    rsi:0,
    macdSignal:0
  },
  executionParams:{
    leverage:0,
    feeBps:0,
    portfolio:0
  },
  riskParams:{
    stopLoss:0,
    takeProfit:0
  },
}

export const modelAndChart = createSlice({
  name: 'modelAndChart',
  initialState,
  reducers: {
    setExchange:(state,action) => {
        state.exchange=action.payload.exchange;
    },
    setStrategyTradeType: (state,action) => {
        let ref=state.strategyParams
        for(let i=0;i<action.payload.length-1;i++){
            ref=ref[action.payload[i]]
        }
        ref[action.payload[action.payload.length - 2]]=action.payload[action.payload.length-1];
    },
    setStrategyIndicators: (state, action) => {
      state[action.payload[0]] = action.payload[1];
    },
    setExecutionParams: (state, action) => {
      state[action.payload[0]] = action.payload[1];
    },
    setRiskParams: (state, action) => {
      state[action.payload[0]] = action.payload[1];
    },

  },
})

export const { setExchange, setStrategyTradeType, setStrategyIndicators, setExecutionParams, setRiskParams} = modelAndChart.actions

export default modelAndChart.reducer