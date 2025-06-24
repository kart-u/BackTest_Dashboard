from pydantic import BaseModel
from typing import List

class graphParams(BaseModel):
    exchange:str
    symbol:str
    market:str

class EMA(BaseModel):
    relation:str

class MACD(BaseModel):
    relation:str

class RSI(BaseModel):
    value:int
    relation:str

class tradeType(BaseModel):
    ema:EMA|None=None
    macd:MACD|None=None
    rsi:RSI|None=None
    condition:str


class strategyParams(BaseModel):
    longEnter:tradeType|None=None
    longExit:tradeType|None=None
    shortEnter:tradeType|None=None
    shortExit:tradeType|None=None
    emaSmall:int|None=None
    emaLarge:int|None=None
    rsi:int|None=None
    macdSignal:int|None=None
    
class orderType(BaseModel):
    order:str  #Market or limit
    longOrder:str|None=None
    shortOrder:str|None=None
class executionParams(BaseModel):
    orderType:orderType
    feeBps:int
    slipBps:int
    percentPortfolioToTrade:int


class riskParams(BaseModel):
    stopLoss:int|None=None
    takeProfit:int|None=None


