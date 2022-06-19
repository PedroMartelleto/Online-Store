import time
import pandas as pd
import requests
import json
import sys
from tqdm import tqdm

df = pd.read_csv('import/processed_no_dups.csv', encoding="utf-8")
df.drop_duplicates(inplace=True)
df.reset_index(drop=True, inplace=True)
df = df.replace(float('nan'), '')
df = df.rename(columns={'id': '_id'})

df['votes'] = df['votes'].map(json.loads)
df['genres'] = df['genres'].map(lambda s: s.replace("'", '"')).map(json.loads)
assert (df['votes'].map(len) == df['genres'].map(len)).all()

assert df['_id'].nunique() == df.shape[0]

authenticationData = {'email': sys.argv[1], 'password': sys.argv[2]}
token = requests.post('http://localhost:3333/api/auth/login',
                      data=json.dumps(authenticationData),
                      headers={'Content-Type': 'application/json'})
token = token.json()['accessToken']

products = []
products = df.to_dict('records')

url = 'http://localhost:3333/api/product/batch/'
headers = {'content-type': 'application/json', 'Token': 'Bearer ' + token}

print("Making request...")

dataToSend = json.dumps({ "products": products })
r = requests.post(url, data=dataToSend, headers=headers)