import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from "./redux/store"
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router";
import Result from './pages/Result'
import Home from './pages/Home'
import BuildStrategy from './pages/BuildStrategy'
import axios from 'axios'
import { Key } from 'lucide-react'

const strategyLoader = async () => {
  const state = store.getState().exchange;
  if(!check(state)){
    console.log("Invalid State")
    return redirect("/");
  }
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/graphOHLCV?Limit=99", {
      exchange: state.exchanges[0],
      symbol: state.symbols[0],
      market: state.market,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load chart data", { status: 500 });
  }
};
const check = (state) => {
  let ck = true;
  for (let key in state) {
    const value = state[key];
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        if (value.length === 0) return false;
        for (let item of value) {
          ck = ck && check(item);
        }
      } else {
        ck = ck && check(value);
      }
    } else {
      if (value === "") return false;
    }
  }
  return ck;
};

const resultLoader=async()=>{
  const state = store.getState();
  if(!check(state)){
    console.log("Invalid state")
    return redirect("/")
  }
  try {
      const res = await axios.post("http://localhost:8000/api/backtest", state);
      return res.data;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load chart data", { status: 500 });
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: 'strategy',
        Component: BuildStrategy,
        loader: strategyLoader,
      },
      { 
        path: 'result', Component: Result,
        loader:resultLoader
       },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
