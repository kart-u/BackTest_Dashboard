from pydantic import BaseModel
from typing import List

class exchangesSymbolData(BaseModel):
    exchanges:List[str]
    symbols:List[str]
    timeframe:str
    market:str
    limit:int