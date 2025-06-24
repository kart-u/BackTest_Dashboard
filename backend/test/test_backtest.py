import pytest
import pandas as pd

from Model.strategyGraph import EMA,MACD,RSI,tradeType,strategyParams
from API.Strategy.backtest import (
    checkRelation,
    checkingConditionParsing,
    parseCondition,
    verifyStrategy,
    compare,
    recurCheck,
    returnSignal,
    checkCondition
)

df = pd.DataFrame([
    {
        'emaSmall': 10,
        'emaLarge': 20,
        'macd': 1.1,
        'macdSignal': 1.0,
        'rsi': 25
    },
    {
        'emaSmall': 22,
        'emaLarge': 18,
        'macd': 0.8,
        'macdSignal': 1.1,
        'rsi': 72
    }
])


# Examples
exampleStrategy = strategyParams(
    longEnter=tradeType(
        ema=EMA(
            emaSmallPeriod=9,
            emaLargePeriod=21,
            relation=">"
        ),
        macd=MACD(
            signalPeriod=9,
            relation=">"
        ),
        rsi=RSI(
            signalPeriod=14,
            value=30,
            relation="<"
        ),
        condition="(EMAC && MACDC) || RSIC"
    ),
    longExit=tradeType(
        ema=None,
        macd=None,
        rsi=None,
        condition=""
    ),
    shortEnter=tradeType(
        ema=EMA(
            emaSmallPeriod=5,
            emaLargePeriod=20,
            relation="<"
        ),
        macd=MACD(
            signalPeriod=12,
            relation="<"
        ),
        rsi=RSI(
            signalPeriod=14,
            value=70,
            relation=">"
        ),
        condition="EMAC || (MACDC AND RSIC)"
    ),
    shortExit=tradeType(
        ema=None,
        macd=None,
        rsi=None,
        condition=""
    )
)



def test_check_relation():
    assert checkRelation(">") is True
    assert checkRelation("<=") is True
    assert checkRelation("invalid") is False


def test_parse_condition():
    condition = parseCondition("EMAC AND (MACDC OR RSIC)")
    assert checkingConditionParsing(condition) is True


def test_verify_strategy():
    assert verifyStrategy(exampleStrategy) is True


def test_compare():
    assert compare(5, 10, "<") is True
    assert compare(10, 5, ">") is True
    assert compare(5, 5, "==") is True
    with pytest.raises(ValueError):
        compare(1, 2, "!=")


def test_recur_check():
    condition = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
    value_map_1 = {
        "EMAC": True,
        "MACDC": False,
        "RSIC": True
    }
    value_map_2 = {
        "EMAC": False,
        "MACDC": False,
        "RSIC": True
    }
    assert recurCheck(condition, value_map_1) is True
    assert recurCheck(condition, value_map_2) is False


def test_return_signal_true():
    parsed_condition = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
    parsed_condition2 = ['EMAC', 'AND', ['!','MACDC', 'OR', '!','RSIC']]
    parsed_condition3 = '(EMAC AND MACDC AND (AND(!RSIC))'
    value = {
        'ema': {
            'relation': '<'
        },
        'macd': {
            'relation': '>'
        },
        'rsi': {
            'value': 20,
            'relation': '<'
        },
        'condition': parsed_condition
    }
    signal = returnSignal(value, 0, df, 1)
    value['condition']=parsed_condition2
    signal2 = returnSignal(value, 0, df, 1)
    value['condition']=parsed_condition3

    assert signal == 1
    assert signal2 == 1
    with pytest.raises(ValueError):
        returnSignal(value, 0, df, 1)


def test_return_signal_false():
    parsed_condition = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
    value = {
        'ema': {
            'relation': '>'
        },
        'macd': {
            'relation': '<'
        },
        'rsi': {
            'value': 80,
            'relation': '>'
        },
        'condition': parsed_condition
    }
    signal = returnSignal(value, 0, df, 1)
    assert signal == 0


def test_check_condition():

    assert checkCondition(exampleStrategy, df, index=0) == [1,-2]
    assert checkCondition(exampleStrategy, df, index=1) == [-2]
