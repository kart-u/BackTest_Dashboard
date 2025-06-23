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
    long:tradeType|None
    short:tradeType|None
    

class executionParams(BaseModel):
    orderType:str
    feeBps:int
    slipBps:int
    percentPortfolioToTrade:int


class riskParams(BaseModel):
    stopLoss:int
    takeProfit:int




# Examples
exampleStrategy = strategyParams(
    long=tradeType(
        ema=EMA(
            emaSmallPeriod=9,
            emaLargePeriod=21,
            relation="=="
        ),
        macd=MACD(
            signalPeriod=9,
            relation="=="
        ),
        rsi=RSI(
            signalPeriod=14,
            value=30,
            relation="=="
        ),
        condition="(EMA AND MECD) || RSI"
    ),
    short=tradeType(
        ema=EMA(
            emaSmallPeriod=9,
            emaLargePeriod=21,
            relation="crosses_below"
        ),
        macd=MACD(
            signalPeriod=9,
            relation="less_than"
        ),
        rsi=RSI(
            signalPeriod=14,
            value=70,
            relation="greater_than"
        ),
        condition="EMA && (MACD || RSI)"
    )
)