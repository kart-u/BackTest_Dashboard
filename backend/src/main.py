from fastapi import FastAPI
from API.Home import main as home
from API.Strategy import main as strategy
from fastapi.middleware.cors import CORSMiddleware

origins=[
    "http://localhost:5173"
]

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {'goofball'}

app.include_router(home.router,prefix="/api",tags=['HOME'])
app.include_router(strategy.router,prefix="/api",tags=['STRATEGY'])