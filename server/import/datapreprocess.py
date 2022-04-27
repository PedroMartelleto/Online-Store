# Pre-processes csv to import into MongoDB

import pandas as pd

books = pd.read_csv("raw.csv")

def convert(word):
    converted = ''.join(x.capitalize() or '_' for x in word.split('_'))
    return converted[0].lower() + converted[1:]

columns_map = {}

for col in books.columns:
    columns_map[col] = convert(col)

books.rename(columns=columns_map, inplace=True)

books.to_csv("processed.csv", index=False, encoding="utf-8")