import ccxt
import pandas as pd
from Model.Home import exchangesSymbolData
from fastapi import HTTPException


async def getData(inputData:exchangesSymbolData):
    for ex in inputData.exchanges:
        for sym in inputData.symbols:
            options = {'defaultType': inputData.market} if (inputData.market.lower()!='spot') else {} 
            symbol=sym.upper()+"/USDT"
            exchange=getattr(ccxt,ex.lower())({
                'enableRateLimit': True,
                'options':options
            })
            exchange.load_markets()
            if symbol not in exchange.symbols:
                print(f"{symbol} not present in {ex}")
                continue

            try:
                ohlcv=exchange.fetch_ohlcv(symbol, timeframe='1d', limit=inputData.limit)
                df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
                filename:str = f"{sym.upper()}_{inputData.market}_{ex}.csv"
                df.to_csv(filename, index=False)
                print(f"Data for saved on {filename}:\n")
            
            except Exception as error:
                raise HTTPException(status_code=400,detail="Error while fetching data")


