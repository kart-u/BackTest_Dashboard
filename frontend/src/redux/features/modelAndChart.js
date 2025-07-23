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
            value:"",
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
            value:"",
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
            value:"",
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
            value:"",
            relation:""
        },
        condition:""
    },
    emaSmall:"",
    emaLarge:"",
    rsi:"",
    macdSignal:""
  },
  executionParams:{
    leverage:"",
    feeBps:"",
    portfolio:""
  },
  riskParams:{
    stopLoss:"",
    takeProfit:""
  },
}

export const modelAndChart = createSlice({
  name: 'modelAndChart',
  initialState,
  reducers: {
    setExchange:(state,action) => {
        state.exchange=action.payload.exchange;
    },
    setStrategy: (state,action) => {
        let ref=state.strategyParams
        for(let i=0;i<action.payload.length-2;i++){
            ref=ref[action.payload[i]]
        }
        ref[action.payload[action.payload.length - 2]]=action.payload[action.payload.length-1];
    },
    setExecutionParams: (state, action) => {
      let ref=state.executionParams
        for(let i=0;i<action.payload.length-2;i++){
            ref=ref[action.payload[i]]
        }
        ref[action.payload[action.payload.length - 2]]=action.payload[action.payload.length-1];
    },
    setRiskParams: (state, action) => {
      let ref=state.riskParams
        for(let i=0;i<action.payload.length-2;i++){
            ref=ref[action.payload[i]]
        }
        ref[action.payload[action.payload.length - 2]]=action.payload[action.payload.length-1];
    },

  },
})

export const { setExchange, setStrategy, setExecutionParams, setRiskParams} = modelAndChart.actions

export default modelAndChart.reducer