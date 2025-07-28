# api/scrape.py
import os, json
from urllib.parse import urlencode
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Query
from starlette.responses import JSONResponse

app = FastAPI()

# Mapping kategori → match_id Shopee (update sesuai kebutuhan)
CATEGORY_MAP = {
    "elektronik": 110,       # Contoh: Elektronik
    "fashion": 100,          # Fashion
    "rumah-tangga": 123,     # Home & Living
    # …tambahkan sesuai dokumentasi Shopee
}

@app.get("/")
def scrape(
    query: str = Query(..., min_length=1, description="Kata kunci pencarian"),
    category: str = Query(..., description="Slug kategori, misal 'elektronik'")
):
    if category not in CATEGORY_MAP:
        return JSONResponse({"error": "Kategori tidak valid"}, status_code=400)

    match_id = CATEGORY_MAP[category]
    params = {
        "by": "sales",
        "limit": 20,
        "match_id": match_id,
        "newest": 0,
        "order": "desc",
        "keyword": query
    }
    url = "https://shopee.co.id/api/v4/search/search_items?" + urlencode(params)
    res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    data = res.json()

    items = []
    for x in data.get("items", []):
        it = x.get("item_basic", {})
        items.append({
            "name": it.get("name"),
            "price": it.get("price")/100000,  # Shopee API price in raw cents
            "image": "https://cf.shopee.co.id/file/" + it.get("image"),
            "url": f"https://shopee.co.id/{it.get('name').replace(' ', '-')}-i.{it.get('shopid')}.{it.get('itemid')}"
        })

    return {"products": items}
