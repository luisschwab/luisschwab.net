#!/bin/python3

import json

with open('./public/quotes.json', 'r') as file:
    data = json.load(file)

out = {"quotes": []}

neat = sorted(data["quotes"], key=lambda x: x[1])
for e in range(len(neat)):
    out["quotes"].append([neat[e][0], neat[e][1]])

with open('./public/quotes.json', 'w+') as file:
    json.dump(out, file, indent=4, ensure_ascii=False)