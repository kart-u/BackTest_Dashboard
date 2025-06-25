import pandas as pd
from fastapi import APIRouter,File,UploadFile,Body,status,Query,HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Annotated,Dict,List,Tuple
from Model.strategyGraph import graphParams,strategyParams,executionParams,riskParams
from Model.Home import exchangesSymbolData
import os,glob,re
from datetime import datetime
from API.Strategy.backtest import verifyStrategy,calculateIndicator

router=APIRouter()



@router.post("/graphOHLCV")
async def graph(data:graphParams,From:Annotated[datetime|None,Query()],To:Annotated[datetime|None,Query()]):

    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../",
            f"{data.symbol.upper()}_{data.market.lower()}_{data.exchange.lower()}.csv"
            ))
    
    if not os.path.isfile(path):
        return JSONResponse(
            content={"message":"File Not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    print(From, To)
    df=pd.DataFrame()
    df = pd.read_csv(path) 

    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')

    if df['timestamp'].isnull().any():
        raise HTTPException(status_code=400,detail="Some timestamps could not be parsed into datetime.")
    
    df = df[(df["timestamp"] >= From) & (df["timestamp"] <= To)]
    
    df['timestamp'] = df['timestamp'].astype(str)

    return JSONResponse(
            content=df.to_dict(orient="records"),
            status_code=status.HTTP_200_OK
        )





@router.post("/dataOptions")
async def dataOptions():
    baseDir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    csvFiles = glob.glob(os.path.join(baseDir, "*.csv"))

    options:Dict[str, List[str]]={
        'symbols':list(),
        'market':list(),
        'exchange':list()
    }
    for path in csvFiles:
        filename=os.path.basename(path)
        match = re.match(r"([^_]+)_([^_]+)_([^_]+)\.csv", filename)
        if match:
            symbol, market, exchange = match.groups()
            options["symbols"].append(symbol)
            options["market"].append(market)
            options["exchange"].append(exchange)
        else:
            continue

    options["exchange"]=list(set(options["exchange"]))
    options["market"]=list(set(options["market"]))
    options["symbols"]=list(set(options["symbols"]))

    return JSONResponse(
        content=options,
        status_code=status.HTTP_200_OK
    )

 
@router.post("/backtest")
async def backtest(strategyParams:Annotated[strategyParams,Body()],
                   executionParams:Annotated[executionParams,Body()],
                   riskParams:Annotated[riskParams,Body()],
                   selected:Annotated[exchangesSymbolData,Body()]
                   ):
    
    if not verifyStrategy(strategyParams):
        raise HTTPException(status_code=400,detail="Wrong Strategy Format")
    

    dataframe:Dict[Tuple[str,str,str],]=dict()
    len=None
    for exchange in selected.exchanges:
        for symbol in selected.symbols:
            market=selected.market
            path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../",
                    f"{symbol.upper()}_{market.lower()}_{exchange.lower()}.csv"
                    ))
            if not os.path.isfile(path):
                raise HTTPException(status_code=400,detail="File not found")
            df=pd.read_csv(path)
            calculateIndicator(strategyParams,df)
            length=len(df)
            dataframe[(symbol.upper(),market.lower(),exchange.lower())]=df
    


    return {"google"}

