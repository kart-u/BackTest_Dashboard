import pandas as pd
from fastapi import APIRouter,File,UploadFile,Body,status
from fastapi.responses import JSONResponse
from typing import Annotated
from io import StringIO
from API.Home import linkProcess
from Model.Home import exchangesSymbolData
import os,glob

router=APIRouter()


@router.post("/linkMethod")
async def selectLink(exchange:Annotated[exchangesSymbolData,Body()]):

    baseDir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    csvFiles = glob.glob(os.path.join(baseDir, "*.csv"))

    for filepath in csvFiles:
        os.remove(filepath)

    await linkProcess.getData(exchange)
    
    return JSONResponse(
        content={"message": "Data Processed Successfully"},
        status_code=status.HTTP_200_OK
    )


@router.post("/fileMethod")
async def selectFile(csv:Annotated[UploadFile,File()]):

    baseDir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    csvFiles = glob.glob(os.path.join(baseDir, "*.csv"))

    for filepath in csvFiles:
        os.remove(filepath)

    content=await csv.read()
    decoded = content.decode('utf-8')
    df = pd.read_csv(StringIO(decoded)) 
    try:
        groups=df.groupby(['symbol','market','exchange'])
        for (symbol,market,exchange),group in groups:
            filename:str = f"{symbol.upper()}_{market.lower()}_{exchange}.csv"
            group.to_csv(filename,index=False)

        return JSONResponse(
            content={"message": "File Processed Successfully"},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        raise ValueError("File in wrong format")
