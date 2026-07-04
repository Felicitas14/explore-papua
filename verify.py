import urllib.request
import json
import sys

BASE_URL = 'http://127.0.0.1:5001'

def test_endpoint(path, is_json=True):
    url = f"{BASE_URL}{path}"
    print(f"Testing {url} ...", end=" ")
    try:
        response = urllib.request.urlopen(url, timeout=5)
        status = response.getcode()
        
        if status != 200:
            print(f"FAILED (Status: {status})")
            return False
            
        if is_json:
            data = json.loads(response.read().decode('utf-8'))
            if isinstance(data, dict) and "error" in data:
                print(f"FAILED (API error: {data['error']})")
                return False
            print(f"PASSED (Received {len(data)} items)")
        else:
            content = response.read().decode('utf-8')
            if "Explore" not in content:
                print("FAILED (Incorrect HTML content)")
                return False
            print("PASSED (HTML valid)")
        return True
    except Exception as e:
        print(f"FAILED (Error: {e})")
        return False

def run_tests():
    success = True
    # Test html shell
    success &= test_endpoint('/', is_json=False)
    
    # Test APIs
    success &= test_endpoint('/api/destinations')
    success &= test_endpoint('/api/culture')
    success &= test_endpoint('/api/food')
    success &= test_endpoint('/api/leaderboard')
    
    # Test leaderboard submit
    try:
        url = f"{BASE_URL}/api/leaderboard"
        print("Testing POST /api/leaderboard ...", end=" ")
        req = urllib.request.Request(
            url, 
            data=json.dumps({"player_name": "Test Runner", "score": 90}).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        response = urllib.request.urlopen(req, timeout=5)
        res_data = json.loads(response.read().decode('utf-8'))
        if res_data.get('status') == 'success' and res_data.get('rank') is not None:
            print(f"PASSED (Saved score, rank: {res_data.get('rank')})")
        else:
            print("FAILED (Invalid response)")
            success = False
    except Exception as e:
        print(f"FAILED (Error: {e})")
        success = False
        
    if success:
        print("\nAll endpoints are operating successfully!")
        sys.exit(0)
    else:
        print("\nSome endpoints encountered errors!")
        sys.exit(1)

if __name__ == '__main__':
    run_tests()
