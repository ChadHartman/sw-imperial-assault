import os
import json

data = {"cards": []}

for (a, b, filenames) in os.walk('.'):

    for filename in filenames:

        name = filename.split(".")[0]

        data["cards"].append({
            "id": name,
            "affiliation": "rebel",
            "restrictions": [
                "fenn_signis"
            ],
            "title": name.replace("_", " ").title(),
            "cost": 0,
            "limit": 1
        })

# with open("cards.json", 'w') as f:
#    json.dump(data, f, indent=4, sort_keys=True)
