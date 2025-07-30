from fastapi import FastAPI
from API.Home import main as home
from API.Strategy import main as strategy
from fastapi.middleware.cors import CORSMiddleware


app=FastAPI()


app.include_router(home.router,prefix="/api",tags=['HOME'])
app.include_router(strategy.router,prefix="/api",tags=['STRATEGY'])