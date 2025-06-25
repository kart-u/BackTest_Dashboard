import pytest
import pandas as pd
import numpy as np
from fastapi import HTTPException
from Model.strategyGraph import EMA, MACD, RSI, tradeType, strategyParams, riskParams, executionParams
from API.Strategy.backtest import (
    checkRelation,
    checkingConditionParsing,
    parseCondition,
    verifyStrategy,
    compare,
    recurCheck,
    returnSignal,
    checkCondition,
    calculateRsi,
    calculateIndicator,
    atindex,
    backtestParallel
)

df_ind = pd.DataFrame([
    {'emaSmall': 10, 'emaLarge': 20, 'macd': 1.1, 'macdSignal': 1.0, 'rsi': 25},
    {'emaSmall': 22, 'emaLarge': 18, 'macd': 0.8, 'macdSignal': 1.1, 'rsi': 72}
])

exampleStrategy = strategyParams(
    longEnter=tradeType(
        ema=EMA(relation=">"),
        macd=MACD(relation=">"),
        rsi=RSI(value=30, relation="<"),
        condition="(EMAC && MACDC) || RSIC"
    ),
    longExit=tradeType(condition=""),
    shortEnter=tradeType(
        ema=EMA(relation="<"),
        macd=MACD(relation="<"),
        rsi=RSI(value=70, relation=">"),
        condition="EMAC || (MACDC AND RSIC)"
    ),
    shortExit=tradeType(condition=""),
    emaSmall=None, emaLarge=None, macdSignal=None, rsi=None
)

# def test_check_relation():
#     assert checkRelation(">") is True
#     assert checkRelation("<=") is True
#     assert checkRelation("invalid") is False

# def test_parse_condition_and_checkingParsing():
#     cond = parseCondition("EMAC AND (MACDC OR RSIC)")
#     assert checkingConditionParsing(cond) is True

# def test_verify_strategy():
#     assert verifyStrategy(exampleStrategy) is True

# def test_compare():
#     assert compare(5, 10, "<") is True
#     assert compare(10, 5, ">") is True
#     assert compare(5, 5, "==") is True
#     with pytest.raises(HTTPException):
#         compare(1, 2, "!=")

# def test_recur_check():
#     cond = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
#     m1 = {"EMAC": True, "MACDC": False, "RSIC": True}
#     m2 = {"EMAC": False, "MACDC": False, "RSIC": True}
#     assert recurCheck(cond, m1) is True
#     assert recurCheck(cond, m2) is False

# def test_return_signal_true_and_error():
#     parsed1 = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
#     parsed2 = ['EMAC', 'AND', ['!', 'MACDC', 'OR', '!', 'RSIC']]
#     parsed3 = "(EMAC AND MACDC AND (AND(!RSIC))"
#     value = {
#         'ema': {'relation': '<'},
#         'macd': {'relation': '>'},
#         'rsi': {'value': 20, 'relation': '<'},
#         'condition': parsed1
#     }
#     sig1 = returnSignal(value, 0, df_ind, 1)
#     value['condition'] = parsed2
#     sig2 = returnSignal(value, 0, df_ind, 1)
#     value['condition'] = parsed3
#     assert sig1 == 1
#     assert sig2 == 1
#     with pytest.raises(HTTPException):
#         returnSignal(value, 0, df_ind, 1)

# def test_return_signal_false():
#     parsed = ['EMAC', 'AND', ['MACDC', 'OR', 'RSIC']]
#     value = {
#         'ema': {'relation': '>'},
#         'macd': {'relation': '<'},
#         'rsi': {'value': 80, 'relation': '>'},
#         'condition': parsed
#     }
#     sig = returnSignal(value, 0, df_ind, 1)
#     assert sig == 0

# def test_check_condition():
#     assert checkCondition(exampleStrategy, df_ind, 0) == [1, -2]
#     assert checkCondition(exampleStrategy, df_ind, 1) == [-2]

# def test_calculate_rsi_length_and_range():
#     df = pd.DataFrame({'close': np.arange(1, 11, dtype=float)})
#     rsi = calculateRsi(df, period=5)
#     assert len(rsi) == 10
#     assert rsi[:4].isna().all()
#     assert rsi[~rsi.isna()].between(0, 100).all()

# def test_calculate_indicator_adds_columns():
#     strat = strategyParams(
#         emaSmall=3, emaLarge=5, macdSignal=4, rsi=3,
#         longEnter=None, longExit=None, shortEnter=None, shortExit=None
#     )
#     df = df_ind.copy()
#     df2 = pd.DataFrame({'close': np.arange(1, 6, dtype=float)})
#     calculateIndicator(strat, df2)
#     for col in ('emaSmall','emaLarge','macd','macdSignal','rsi'):
#         assert col in df2.columns
#         assert len(df2[col]) == len(df2)

# def test_atindex_simple_entry_and_exit(monkeypatch):
#     df = pd.DataFrame({
#     'close': [100.0, 110.0],
#     'emaSmall': [9.0, 11.0],
#     'emaLarge': [10.0, 10.0],
#     'macd': [1.0, 1.2],
#     'macdSignal': [1.1, 1.1],
#     'rsi': [20, 25]
#     })
#     strat = exampleStrategy
#     risk = riskParams(stopLoss=None, takeProfit=None)
#     execp = executionParams(leverage=1, feeBps=0, portfolio=1000)
#     key = ('ex','sym','d1')
#     flag = {key:{'check':0,'prevPrice':0.0,'returns':0.0,'tot':0,'win':0}}
#     atindex(0, df, risk, execp, flag, strat, key, port=1000)
#     assert flag[key]['check'] == 1
#     assert flag[key]['prevPrice'] == 100.0
#     def fakeReturn(value,i,df_,signal): return -1 if i==1 else 0
#     monkeypatch.setattr('API.Strategy.backtest.returnSignal', fakeReturn)
#     atindex(1, df, risk, execp, flag, strat, key, port=1000)
#     assert flag[key]['check'] == 0
#     assert pytest.approx(flag[key]['returns'], rel=1e-3) == 100.0

def test_backtest_parallel_end_to_end(monkeypatch):
    df_in = pd.DataFrame({'close': [100, 105, 110]})
    dataframes = {('ex','sym','1d'): df_in}
    strat = exampleStrategy
    monkeypatch.setattr('API.Strategy.backtest.checkCondition', lambda s,df,i: [1, -1])
    risk = riskParams(stopLoss=None, takeProfit=None)
    execp = executionParams(leverage=1, feeBps=0, portfolio=1000)
    result = backtestParallel(dataframes, len(df_in), strat, execp, risk)
    assert 'equity' in result.columns
    assert 'maxDrawdown' in result.columns
    assert 'totalTrades' in result.columns
    assert 'winTrades' in result.columns
    assert list(result['equity']) == [1000, 1050, 1050]
    assert result['totalTrades'].iloc[-1] == 3
    assert result['winTrades'].iloc[-1] == 3
    assert 'sharpe' in result.columns
