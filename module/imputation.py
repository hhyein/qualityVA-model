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