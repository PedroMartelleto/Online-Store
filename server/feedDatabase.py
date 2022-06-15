import pandas as pd
import requests
import json
import sys
from tqdm import tqdm

def camelCase(s):
    return ''.join(word.title() if i else word for i, word in enumerate(s.split('_')))

df = pd.read_csv('goodreads_books.csv')
df.drop_duplicates(inplace=True)
df.reset_index(drop=True, inplace=True)
df = df.replace(float('nan'), '')
df = df.rename(columns={'id': '_id'})
df['price'] = 1
df['quantity'] = 1
df.columns = [camelCase(col) for col in df.columns]


authenticationData = {'email': sys.argv[1], 'password': sys.argv[2]}
token = requests.post('http://127.0.0.1:8080/api/auth/login', data=json.dumps(authenticationData), headers={'content-type': 'application/json'}).json()['accessToken']

def postBook(book):
    url = 'http://127.0.0.1:8080/api/product/'
    headers = {'content-type': 'application/json', 'Token': 'Bearer ' + token}
    r = requests.post(url, data=json.dumps(book), headers=headers)

for index, row in tqdm(df.iterrows()):
    postBook(row.to_dict())