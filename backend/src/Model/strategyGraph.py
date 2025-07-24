from pydantic import BaseModel, validator
from typing import List, Optional

class graphParams(BaseModel):
    exchange: str
    symbol: str
    market: str

class EMA(BaseModel):
    relation: Optional[str] = None

class MACD(BaseModel):
    relation: Optional[str] = None

class RSI(BaseModel):
    value: Optional[int] = None
    relation: Optional[str] = None

    @validator("value", "relation", pre=True, always=True)
    def empty_to_none(cls, v):
        if v in ("", None):
            return None
        return int(v) if isinstance(v, str) and v.isdigit() else v

class tradeType(BaseModel):
    ema: Optional[EMA] = None
    macd: Optional[MACD] = None
    rsi: Optional[RSI] = None
    condition: Optional[str] = None

    @validator("ema", "macd", "rsi", "condition", pre=True, always=True)
    def empty_to_none(cls, v):
        if v in ("", {}, None):
            return None
        return v

class strategyParams(BaseModel):
    longEnter: Optional[tradeType] = None
    longExit: Optional[tradeType] = None
    shortEnter: Optional[tradeType] = None
    shortExit: Optional[tradeType] = None
    emaSmall: Optional[int] = None
    emaLarge: Optional[int] = None
    rsi: Optional[int] = None
    macdSignal: Optional[int] = None

    @validator("emaSmall", "emaLarge", "rsi", "macdSignal", pre=True)
    def empty_string_to_none(cls, v):
        if v == "" or v is None:
            return None
        return int(v) if isinstance(v, str) and v.isdigit() else v

    @validator("longEnter", "longExit", "shortEnter", "shortExit", pre=True, always=True)
    def nullify_empty_tradeType(cls, v):
        # Handle raw dicts before Pydantic converts them
        if isinstance(v, dict) and all(not v.get(k) for k in v.keys()):
            return None
        return v

class executionParams(BaseModel):
    leverage: int = 1
    feeBps: Optional[int] = None
    portfolio: Optional[int] = None

    @validator("feeBps", "portfolio", pre=True)
    def empty_string_to_none(cls, v):
        if v == "" or v is None:
            return None
        return int(v) if isinstance(v, str) and v.isdigit() else v

class riskParams(BaseModel):
    stopLoss: Optional[int] = None
    takeProfit: Optional[int] = None

    @validator("stopLoss", "takeProfit", pre=True)
    def empty_string_to_none(cls, v):
        if v == "" or v is None:
            return None
        return int(v) if isinstance(v, str) and v.isdigit() else v
