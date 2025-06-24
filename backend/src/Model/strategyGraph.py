from pydantic import BaseModel
from typing import List

class graphParams(BaseModel):
    exchange:str
    symbol:str
    market:str

class EMA(BaseModel):
    emaSmallPeriod:int
    emaLargePeriod:int
    relation:str

class MACD(BaseModel):
    signalPeriod:int
    relation:str

class RSI(BaseModel):
    signalPeriod:int
    value:int
    relation:str

class tradeType(BaseModel):
    ema:EMA|None
    macd:MACD|None
    rsi:RSI|None
    condition:str

class strategyParams(BaseModel):
    longEnter:tradeType|None
    longExit:tradeType|None
    shortEnter:tradeType|None
    shortExit:tradeType|None
    
class orderType(BaseModel):
    order:str
    longOrder:str|None
    shortOrder:str|None
class executionParams(BaseModel):
    orderType:orderType
    feeBps:int
    slipBps:int
    percentPortfolioToTrade:int


class riskParams(BaseModel):
    stopLoss:int
    takeProfit:int


