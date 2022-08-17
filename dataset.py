import random
import pandas as pd
import numpy as np
import module.imputation as imputation

fileName = 'housePrice'
df = pd.read_csv('static/' + fileName + '.csv')
columnLenght = len(list(df.columns))
rowLenght = len(df)

percent = 0.1
totalDataset = columnLenght * rowLenght
percentDataset = int(percent * totalDataset)
print(percentDataset)

# missing
for i in range(0, int(percentDataset/3)):
    columnRandom = random.randint(0, columnLenght - 1)
    rowRandom = random.randint(0, rowLenght - 1)

    df.iloc[rowRandom, columnRandom] = np.nan

# outlier
for i in range(0, int(percentDataset/3)):
    columnRandom = random.randint(0, columnLenght - 1)
    rowRandom = random.randint(0, rowLenght - 1)
    lowerOrUpper = random.randint(0, 1)

    lower, upper = imputation.LowerUpper(df.iloc[columnRandom])
    if lowerOrUpper == 0:
        df.iloc[rowRandom, columnRandom] = lower - 1
    else:
        df.iloc[rowRandom, columnRandom] = upper + 1

# incons
# for boston house price
for i in range(0, int(percentDataset/3)):
    columnRandom = random.randint(0, columnLenght - 1)
    rowRandom = random.randint(0, rowLenght - 1)

    df.iloc[rowRandom, columnRandom] = 'incons'

missing = sum(df.isnull().sum().values.tolist())
print(missing)

df.to_csv('static/' + str(int(percent * 100)) + fileName + '.csv', index = False)