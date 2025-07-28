from http.server import BaseHTTPRequestHandler
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        # Mendapatkan query parameter dari URL
        query_params = parse_qs(urlparse(self.path).query)
        keyword = query_params.get('keyword', [None])[0]

        if not keyword:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Keyword is required"}).encode('utf-8'))
            return

        try:
            # URL target untuk scraping Shopee
            url = f"https://shopee.co.id/search?keyword={keyword.replace(' ', '+')}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://shopee.co.id/'
            }

            response = requests.get(url, headers=headers)
            response.raise_for_status() # Cek jika ada error HTTP

            soup = BeautifulSoup(response.text, 'html.parser')

            # Selector bisa berubah, sesuaikan jika Shopee mengubah struktur HTML-nya
            # Ini adalah contoh selector umum, mungkin perlu penyesuaian
            products = soup.find_all('div', class_='col-xs-2-4 shopee-search-item-result__item')
            
            results = []
            for item in products[:5]: # Ambil 5 produk pertama
                try:
                    name = item.find('div', class_='ie3A+n bM+7UW Cve6sh').get_text(strip=True)
                    price = item.find('div', class_='vioxXd rVLWG6').get_text(strip=True)
                    link_element = item.find('a')
                    product_link = "https://shopee.co.id" + link_element['href'] if link_element else 'No link'
                    img_element = item.find('img', class_='_7DTg4s')
                    image_url = img_element['src'] if img_element else 'No image'

                    results.append({
                        "name": name,
                        "price": price,
                        "link": product_link,
                        "image": image_url,
                    })
                except Exception as e:
                    # Skip produk jika ada error parsing
                    continue
            
            # Kirim response sukses dengan data JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"products": results}).encode('utf-8'))

        except Exception as e:
            # Kirim response error jika scraping gagal
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            
        return
