import ccxt
import pandas as pd
from pydantic import BaseModel
from typing import List

class exchangesSymbolData(BaseModel):
    exchanges:List[str]
    symbols:List[str]
    timeframe:str
    market:str
    limit:int

def getData(inputData:exchangesSymbolData):
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
                ohlcv=exchange.fetch_ohlcv(symbol, timeframe=inputData.timeframe, limit=inputData.limit)
                df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
                filename:str = f"{sym.upper()}_{inputData.market}_{ex}.csv"
                df.to_csv(filename, index=False)
                print(f"Data for saved on {filename}:\n", df.head())
            
            except Exception as error:
                print(f"Error while fetching data {error}")

      
            
# Testing Patch:-
# class inputData(exchangesSymbolData):
#     exchanges:List[str]=['binance','bybit']
#     symbols:List[str]=['btc','eth']
#     timeframe:str='1d'
#     market:str='spot'
#     limit:int=100

# getData(inputData())