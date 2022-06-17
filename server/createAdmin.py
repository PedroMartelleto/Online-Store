import pandas as pd
import requests
import json

r = requests.post('http://localhost:3333/api/INTERNAL_USE/createAdmin',
                  data="",
                  headers={'Content-Type': 'application/json'})

print(r.status_code)