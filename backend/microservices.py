from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, Float, select
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI() 
RECSYS_TOKEN = os.getenv("RECSYS_SECRET")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # untuk development, nanti bisa diganti spesifik origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT")

DATABASE_URL = "mysql+aiomysql://root@localhost:3307/db_nyisa"

Base = declarative_base()
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class FoodRecommendation(Base):
    __tablename__ = "recommendation_data"
    
    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer)
    name = Column(String)
    type = Column(String)
    price = Column(Float)
    restaurant = Column(String)
    restaurant_type = Column(String)
    rating = Column(Float)
    longitude = Column(Float)
    latitude = Column(Float)

df = None
similarity = None

async def build_recommendation_model():
    global df, similarity
    async with async_session() as session:
        result = await session.execute(select(FoodRecommendation))
        records = result.scalars().all()
        data = [r.__dict__ for r in records]
        
        for row in data:
            row.pop('_sa_instance_state', None)
            
        df = pd.DataFrame(data)
        
        df['price_scaled'] = StandardScaler().fit_transform(df[['price']])
        df['rating_scaled'] = StandardScaler().fit_transform(df[['rating']])
        df['combined_features'] = df.apply(lambda x: ' '.join(x.astype(str)), axis=1)
        tfidf_matrix = TfidfVectorizer(stop_words='english').fit_transform(df['combined_features'])
        similarity = cosine_similarity(tfidf_matrix)

@app.on_event("startup")
async def on_startup():
    await build_recommendation_model()
    
@app.post("/api/foods/recommend/refresh")
async def refresh_data(authorization: str = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or Invalid Header")
    
    token = authorization.split(" ")[1]
    if token != RECSYS_TOKEN:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    await build_recommendation_model()
    return {"message": "Recommendation Data Refreshed!"}

@app.get("/")
def root():
    return {"message": "HALO API FROM MICROSEVICE!"}

@app.get('/api/foods/recommend/{id}')
async def recommend(id: int):
    global df, similarity
    
    if id not in df['food_id'].values:
        return {"error": "Invalid food_id"}
    
    food_id = df.index[df['food_id'] == id].tolist()[0]
    
    sim_scores = list(enumerate(similarity[food_id]))
    
    sim_scores = [i for i in sim_scores if i[0] != food_id]
    top_indices = [i[0] for i in sim_scores[:10]]
    
    recommendations = df.iloc[top_indices][[
        'food_id', 'name', 'type', 'price', 'restaurant', 'restaurant_type', 'rating'
    ]]
    
    return recommendations.to_dict(orient="records")