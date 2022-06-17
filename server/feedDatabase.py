import time
import pandas as pd
import requests
import json
import sys
from tqdm import tqdm

df = pd.read_csv('import/processed.csv')
df.drop_duplicates(inplace=True)
df.reset_index(drop=True, inplace=True)
df = df.replace(float('nan'), '')
df = df.rename(columns={'id': '_id'})

assert df['_id'].nunique() == df.shape[0]

authenticationData = {'email': sys.argv[1], 'password': sys.argv[2]}
token = requests.post('http://localhost:3333/api/auth/login',
                      data=json.dumps(authenticationData),
                      headers={'Content-Type': 'application/json'})
print(token, token.content)
token = token.json()['accessToken']

products = []

for index, row in tqdm(df.iterrows()):
    products.append(row.to_dict())

url = 'http://localhost:3333/api/product/batch/'
headers = {'content-type': 'application/json', 'Token': 'Bearer ' + token}

print("Making request...")

# Splits the products list into 2000-element chunks
frags = []
last_i = 0
chk = 2000
for i in range(0, len(products), chk):
    frags.append(products[i:i+chk if i+chk <= len(products) else len(products)])

for frag in tqdm(frags):
    dataToSend = json.dumps({ "products": frag })
    print(len(dataToSend)/1000/1000, "MB")

    r = requests.post(url, data=dataToSend, headers=headers)
    print(r)

    assert r.status_code == 201