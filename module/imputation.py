import numpy as np
import pandas as pd

def LowerUpper(df):
    df = df.dropna()

    q25 = np.quantile(df, 0.25)
    q75 = np.quantile(df, 0.75)
    iqr = q75 - q25
    cut_off = iqr * 1.5
    lower, upper = q25 - cut_off, q75 + cut_off

    return lower, upper

def ecdfDf(df, index):
    tmpIndex, tmpX, tmpY = [], [], []
    data = {}

    if type(df) == 'pandas.core.frame.DataFrame':
        x = np.sort(df.to_numpy())
    else:
        x = np.sort(df)
        
    y = 1. * np.arange(len(x))/float(len(x) - 1)

    for i in range(0,len(x)):
        tmpIndex.append(index)
        tmpX.append(x[i])
        tmpY.append(y[i])

    data['index'] = tmpIndex
    data['x'] = tmpX
    data['y'] = tmpY

    outputDf = pd.DataFrame(data)
    return outputDf
