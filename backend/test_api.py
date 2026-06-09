# test_api.py
import urllib.request
import json

def call_api(url, method='GET', data=None, token=None):
    headers = {
        'Content-Type': 'application/json'
    }
    if token:
        headers['Authorization'] = f'Bearer {token}'
        
    req_data = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return json.loads(res_data) if res_data else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("--- Testing Backend API ---")
    
    # 1. Login
    login_url = "http://localhost:8080/api/auth/login"
    login_payload = {
        "username": "admin",
        "password": "admin123"
    }
    print(f"Logging in to {login_url}...")
    login_res = call_api(login_url, 'POST', login_payload)
    if not login_res:
        print("Login failed!")
        return
        
    token = login_res.get('token')
    print(f"Login successful! Token retrieved: {token[:20]}...")
    
    # 2. Get Stats
    stats_url = "http://localhost:8080/api/dashboard/stats"
    print(f"Fetching stats from {stats_url}...")
    stats_res = call_api(stats_url, 'GET', token=token)
    print("Stats Response:", json.dumps(stats_res, indent=2))
    
    # 3. Get Recent Orders
    orders_url = "http://localhost:8080/api/dashboard/recent-orders"
    print(f"Fetching recent orders from {orders_url}...")
    orders_res = call_api(orders_url, 'GET', token=token)
    print("Recent Orders Response:", json.dumps(orders_res, indent=2))
    
    # 4. Get Parts
    parts_url = "http://localhost:8080/api/parts"
    print(f"Fetching parts from {parts_url}...")
    parts_res = call_api(parts_url, 'GET', token=token)
    print("Parts Count:", len(parts_res) if parts_res else 0)

if __name__ == '__main__':
    main()
