# Pre-processes csv to import into MongoDB

import numpy as np
import pandas as pd
from tqdm import tqdm

books = pd.read_csv("raw.csv")

def convert(word):
    converted = ''.join(x.capitalize() or '_' for x in word.split('_'))
    return converted[0].lower() + converted[1:]

columns_map = {}

for col in books.columns:
    columns_map[col] = convert(col)

books.rename(columns=columns_map, inplace=True)

probs = np.array([ 80, 10, 10, 20, 10, 30, 20, 10, 10, 85 ])
probs = probs / probs.sum()
decimal = np.random.choice([ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 ], p=probs, size=books.shape[0]) - 0.01
price = np.round(np.maximum(np.random.normal(loc=10.236, scale=8.2356, size=books.shape[0]), np.random.uniform(1, 2, size=books.shape[0]))) + decimal 
quantity = np.round(np.maximum(np.random.normal(loc=10.236, scale=25.2356, size=books.shape[0]), np.random.uniform(1, 2, size=books.shape[0])))
quantity = np.asarray(quantity, dtype=np.int32)

books["price"] = price
books["quantity"] = quantity
books["genres"] = None
books["votes"] = None

genre_count = {}

# Splits votes and genres
for index, row in tqdm(books['genreAndVotes'].iteritems()):
    if not isinstance(row, str):
        books.at[index, 'genres'] = []
        books.at[index, 'votes'] = []
    else:
        total_votes = 0
        genres_array = []
        votes_array = []

        for genre in row.split(','):
            g_count = genre.split(' ')[-1]
            if g_count.endswith("user"):
                g_count = g_count[:-4]
            total_votes += int(g_count)

        total_votes = float(total_votes)

        for genre in row.split(','):
            g_split = genre.split(' ')
            if g_split[-1].endswith("user"):
                g_split[-1] = g_split[-1][:-4]

            g_name = ""

            for g in g_split[:-1]:
                g_name = g_name + " " + g

            g_name = g_name.strip().split("-")[-1]

            if total_votes > 0 and float(g_split[-1]) / total_votes >= 0.05:
                genres_array.append(g_name)
                votes_array.append(int(g_split[-1]))
                
                if not g_name in genre_count:
                    genre_count[g_name] = 0
                
                genre_count[g_name] += int(g_split[-1])
        
        books.at[index, 'genres'] = genres_array
        books.at[index, 'votes'] = votes_array

inv_map = {v: k for k, v in genre_count.items()}

print(list(reversed(dict(sorted(inv_map.items())).values())))
books.drop(columns=['genreAndVotes'], inplace=True)

books.to_csv("processed.csv", index=False, encoding="utf-8")