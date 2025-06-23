from fastapi import FastAPI
from API.Home import main


app=FastAPI()

app.include_router(main.router,prefix="",tags=['HOME'])