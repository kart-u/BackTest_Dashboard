from Model.strategyGraph import strategyParams,exampleStrategy
from pyparsing import Word, alphas, Literal, infixNotation, opAssoc
from typing import List


def checkRelation(relation:str):
    return (
        relation==(">=") or
        relation==("<=") or
        relation==(">") or
        relation==("<") or
        relation==("==")
    )

def checkCondition(condition:List):
    k=True
    for value in condition:
        # print(value)
        if isinstance(value, list):
            k=k and checkCondition(value)
        else:
            if not value in {
                "MACD",
                "RSI",
                "EMA",
                "AND","&&","OR","||","NOT","!"
            }:
                return False
    return k

def parseCondition(value:str):
    operand = Word(alphas)

    AND = Literal("AND")|Literal("&&")
    OR = Literal("OR")|Literal("||")
    NOT = Literal("NOT")|Literal("!")

    boolExpr = infixNotation(operand, [
    (NOT, 1, opAssoc.RIGHT),
    (AND, 2, opAssoc.LEFT),
    (OR, 2, opAssoc.LEFT),
    ])
    condition=boolExpr.parseString(value,parseAll=True).asList()
    return condition


def verifyStrategy(strategy:strategyParams):
    if not strategy.model_dump():
        return False   

    for tradeType,indicators in strategy.model_dump().items():
        for key,value in indicators.items():

            if key=="condition":
                try:
                    condition = parseCondition(value)
                    if not checkCondition(condition):
                        return False
                except Exception as e:
                    print("Parse error:", e)
                    return False
                
            else:
                relation=value['relation']
                if not checkRelation(relation):
                    return False
                
    return True



