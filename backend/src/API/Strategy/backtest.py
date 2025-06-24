from Model.strategyGraph import strategyParams,riskParams,executionParams
from Model.Home import exchangesSymbolData
from pyparsing import Word, alphas, Literal, infixNotation, opAssoc
from typing import List,Dict,Tuple
import pandas as pd,os,glob
from fastapi import HTTPException

def checkRelation(relation:str):
    return (
        relation==(">=") or
        relation==("<=") or
        relation==(">") or
        relation==("<") or
        relation==("==")
    )


# checking parsed conditon
def checkingConditionParsing(condition:List):
    k=True
    for value in condition:
        if isinstance(value, list):
            k=k and checkingConditionParsing(value)
        else:
            if not value in {
                "MACDC",
                "RSIC",
                "EMAC",
                "AND","&&","OR","||","NOT","!"
            }:
                return False
    return k


# Parsing string
def parseCondition(value:str):
    if len(value)==0:
        return list()
    operand = Word(alphas)

    AND = Literal("AND")|Literal("&&")
    OR = Literal("OR")|Literal("||")
    NOT = Literal("NOT")|Literal("!")

    boolExpr = infixNotation(operand, [
    (NOT, 1, opAssoc.RIGHT),
    (AND, 2, opAssoc.LEFT),
    (OR, 2, opAssoc.LEFT),
    ])
    try:
        condition=boolExpr.parseString(value,parseAll=True).asList()
    except Exception as e:
        raise HTTPException(status_code=400,detail="Wrong format string")
    return condition



# verifying whether a legit strategy given or not
def verifyStrategy(strategy:strategyParams):
    if not strategy.model_dump():
        return False   

    for tradeType,indicators in strategy.model_dump().items():
        if indicators==None:
                continue
        for key,value in indicators.items():
            if value==None:
                continue
            if key=="condition":
                try:
                    condition = parseCondition(value)
                    if not checkingConditionParsing(condition):
                        return False
                except Exception as e:
                    return False
                
            else:
                relation=value['relation']
                if not checkRelation(relation):
                    return False
                
    return True



# evaluation condition
def recurCheck(condition:List,map:Dict):
    previousOperation = None
    previousBoolean = None
    NOT=0
    for value in condition:
        if isinstance(value,list):
            if previousBoolean==None:
                previousBoolean=recurCheck(value,map)
                if NOT==1:
                    previousBoolean= not previousBoolean
                    NOT=0
            else:
                if previousOperation=="AND" or previousOperation=="&&":
                    previousBoolean=previousBoolean and (not recurCheck(value,map) if NOT==1 else recurCheck(value,map))
                    NOT=0
                else:
                    previousBoolean=previousBoolean or (not recurCheck(value,map) if NOT==1 else recurCheck(value,map))
                    NOT=0
                
        else:
            if value in{"AND","&&","OR","||"}:
                previousOperation=value
                NOT=0

            elif value not in {"NOT","!"}:

                if value not in map.keys():
                    raise HTTPException(status_code=400,detail="Relation not defined correctly")
                
                if previousBoolean==None:
                    previousBoolean=map[value]
                    if NOT==1:
                        previousBoolean= not previousBoolean
                        NOT=0

                else:
                    if previousOperation=="AND" or previousOperation=="&&":
                        previousBoolean=previousBoolean and (not map[value] if NOT==1 else map[value])
                        NOT=0
                    else:
                        previousBoolean=previousBoolean or (not map[value] if NOT==1 else map[value])
                        NOT=0

            else:
                NOT=1

    return previousBoolean


# comparing relation
def compare(val1: float, val2: float, relation: str) -> bool:
    if relation in ["<"]:
        return val1 < val2
    elif relation in [">"]:
        return val1 > val2
    elif relation in ["=="]:
        return val1 == val2
    elif relation in ["<="]:
        return val1 <= val2
    elif relation in [">="]:
        return val1 >= val2
    else:
        raise HTTPException(status_code=400,detail=f"Unsupported relation: {relation}")
    

# returning signal according to conditon
def returnSignal(value,index:int,df:pd.DataFrame,signal:int):
    map=dict()
    for key2,value2 in value.items():

        if value2==None:
            continue

        if key2=="condition":
            # print(value2)
            if isinstance(value2,str):
                value2=parseCondition(value2)

            condition=recurCheck(value2,map)
            if condition:
                return signal
            
        else:
            key3=key2.upper()+'C'
            if key2=="ema":
                map[key3]=compare(df.iloc[index]['emaSmall'],df.iloc[index]['emaLarge'],value2['relation'])
            elif key2=="macd":
                map[key3]=compare(df.iloc[index]['macd'],df.iloc[index]['macdSignal'],value2['relation'])
            else:
                map[key3]=compare(df.iloc[index]['rsi'],value2['value'],value2['relation'])
    return 0




#checking for a all possible entry exits 
def checkCondition(strategy:strategyParams,df:pd.DataFrame,index:int):
    # +1 -1 long buy,exit , +2 -2 short sell,exit
    signals=list()
    for key,value in strategy.model_dump().items():
        if value==None:
            continue
        if key=='longEnter':
            sig=returnSignal(value,index,df,1)
            if sig!=0:
                signals.append(sig) 
        elif key=='longExit':
            sig=returnSignal(value,index,df,-1)
            if sig!=0:
                signals.append(sig)

        elif key=='shortEnter':
            sig=returnSignal(value,index,df,-2)
            if sig!=0:
                signals.append(sig)
        elif key=='shortExit':
            sig=returnSignal(value,index,df,2)
            if sig!=0:
                signals.append(sig)
        else:
            continue

    return signals 
    

def calculateRsi(df:pd.DataFrame, period:int):
    delta = df['close'].diff()

    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi


def calculateIndicator(strategy:strategyParams,df:pd.DataFrame):
    for key,value in strategy.model_dump().items():
        if key not in ['longEnter','longExit','shortEnter','shortExit']:
            if key in ['emaSmall','emaLarge']:
                df[key] = df["close"].ewm(span=value, adjust=False).mean()
            elif key=='macdSignal':
                short_ema = df["close"].ewm(span=12, adjust=False).mean()
                long_ema = df["close"].ewm(span=26, adjust=False).mean()
                df["macd"] = short_ema - long_ema
                df[key] = df["macd"].ewm(span=value, adjust=False).mean()
            else:
                df[key]=calculateRsi(df,value)
    return

# Actuall backtesting accross all symbols and exchange
# def backtestParallel(dataframes:Dict[Tuple[str,str,str],pd.DataFrame],len:int,
#                      strategy:strategyParams,execution:executionParams,risk:riskParams
#                     ):
#     for index in range(len):







            
                    


                





