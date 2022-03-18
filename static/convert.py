import pandas as pd

csv_data = pd.read_csv("correlation.csv", sep = ",")
csv_data.to_json("correlation.json", orient = "records", indent = 4)