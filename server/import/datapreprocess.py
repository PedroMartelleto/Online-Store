# Pre-processes csv to import into MongoDB

from socket import TIPC_CLUSTER_SCOPE
import numpy as np
import pandas as pd
from tqdm import tqdm
import Levenshtein

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

def filter_rows(row, original_idx) -> pd.Series:
   

    # If we didn't return yet, just return the default
    return row


# Apply the function (this will create a new column called "remove", indicating if a row should be removed)

books['remove'] = False

titles = list(books['title'])
rating_counts = list(books['ratingCount'])

def find_duplicates(i):
    title = titles[i]
    dups = []

    
    best_dup = i
    best_rating_count = rating_counts[i]
    

    for j  in range(i+1, books.shape[0]):        
        title_j = titles[j]
        rating_count_j = rating_counts[j]

        ratio = Levenshtein.ratio(title, title_j)

        if ratio > 0.9:
            dups.append(j)
            if rating_count_j > best_rating_count:
                dups[-1] = best_dup
                best_dup = j
                best_rating_count = rating_count_j
                
    return dups

from multiprocessing import Pool, cpu_count
def parallel_map(func, data):
    with Pool(cpu_count()) as pool:
        return list(tqdm(pool.imap(func, data), total = len(data)))

all_dups = parallel_map(find_duplicates, range(books.shape[0]))
all_dups = set([item for sublist in all_dups for item in sublist])

books['remove'] = books['remove'] | books.index.isin(all_dups)
books = books[~books["remove"]].drop(columns=["remove"])

books.to_csv("processed_no_dups.csv", index=False, encoding="utf-8")
