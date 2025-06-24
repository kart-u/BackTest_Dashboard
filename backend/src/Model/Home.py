from pydantic import BaseModel
from typing import List

class exchangesSymbolData(BaseModel):
    exchanges:List[str]
    symbols:List[str]
    market:str
    limit:int
    leverage:int|None=None

    