import pandas as pd
from fastapi import APIRouter,File,UploadFile,Body,status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Annotated,List
from io import StringIO
from API.Home import linkProcess


router=APIRouter()

class exchangesSymbolData(BaseModel):
    exchanges:List[str]
    symbols:List[str]
    timeframe:str
    market:str
    limit:int



@router.post("/selectionWithLink")
def selectLink(exchange:Annotated[exchangesSymbolData,Body()]):
    linkProcess.getData(exchange)

    return JSONResponse(
        content={"message": "Data Processed Successfully"},
        status_code=status.HTTP_200_OK
    )


@router.post("/selectionWithFile")
async def selectFile(csv:Annotated[UploadFile,File()]):
    content=await csv.read()
    decoded = content.decode('utf-8')
    df = pd.read_csv(StringIO(decoded)) 
    groups=df.groupby(['symbol','market','exchange'])
    for (symbol,market,exchange),group in groups:
        filename:str = f"{symbol.upper()}_{market.lower()}_{exchange}.csv"
        group.to_csv(filename,index=False)

    return JSONResponse(
        content={"message": "File Processed Successfully"},
        status_code=status.HTTP_200_OK
    )
