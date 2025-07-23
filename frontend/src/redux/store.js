import { configureStore } from '@reduxjs/toolkit'
import modelAndChartReducer from "./features/modelAndChart"
export const store = configureStore({
  reducer:modelAndChartReducer,
})
