import json
import itertools
import numpy as np
import pandas as pd
import module.imputation as imputation

fileName = 'test'
filePath = 'static/' + fileName + '.csv'
originDf = pd.read_csv(filePath, sep = ',')

# missing, outlier, incons check
checkList = []
missing = sum(originDf.isnull().sum().values.tolist())

tmpList = []
for column in originDf:
    lower, upper = imputation.LowerUpper(originDf[column])
    data1 = originDf[originDf[column] > upper]
    data2 = originDf[originDf[column] < lower]
    tmpList.append(data1.shape[0] + data2.shape[0])
    outlier = sum(tmpList)

tmpList = []
for column in originDf:
    df = originDf[column].dropna()
    df = pd.DataFrame(pd.to_numeric(df, errors = 'coerce'))
    tmpList.append(df.isnull().sum().values[0].tolist())
    incons = sum(tmpList)

print(missing, outlier, incons)

actionList = ['t']
if missing > 0:
    actionList.append('m')
if outlier > 0:
    actionList.append('o')
if incons > 0:
    actionList.append('i')

# permutation
permutationList = []
for i in range(len(actionList)):
    permutationList.append(list(map("".join, itertools.permutations(actionList, i + 1))))
permutationList = sum(permutationList, [])

print(permutationList)

# combination
columnList = list(originDf.columns)
actionDetailList = ["remove", "min", "max", "mean", "mode", "median", "em", "locf"]
transDetailList = ['minmax', 'standard', 'maxabs', 'robust', 'log', 'sqrt']

actionTotalDfList = []
for permutation in permutationList:
    permutationAlphabet = []

    for i in range(len(permutation)):
        permutationAlphabet.append(permutation[i: i + 1])
    combinationDfList = [originDf]

    for alphabet in permutationAlphabet:
        if alphabet == 'm':
            resultDfList = []

            for j in range(len(combinationDfList)):
                df = combinationDfList[j]

                for actionDetail in range(len(actionDetailList)):
                    resultColumnDf = []

                    for k in range(len(columnList)):
                        columnDf = df.iloc[:, k]
                        tmpDf = columnDf.to_frame(name = columnList[k])
                        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                        if len(missingIndex) > 0:
                            if actionDetail == "remove":
                                columnDf = columnDf.dropna()
                                columnDf = columnDf.to_frame(name = columnList[k])
                            if actionDetail == "min":
                                columnDf = imputation.custom_imp_min(columnDf, columnList[k])
                            if actionDetail == "max":
                                columnDf = imputation.custom_imp_max(columnDf, columnList[k])
                            if actionDetail == "mode":
                                columnDf = imputation.custom_imp_mode(columnDf, columnList[k])
                            if actionDetail == "mean":
                                columnDf = imputation.custom_imp_mean(columnDf, columnList[k])
                            if actionDetail == "median":
                                columnDf = imputation.custom_imp_median(columnDf, columnList[k])  
                            if actionDetail == "em":
                                columnDf = imputation.custom_imp_em(columnDf, columnList[k])
                            if actionDetail == "locf":
                                columnDf = imputation.custom_imp_locf(columnDf, columnList[k])
                        
                        else:
                            columnDf = columnDf

                        resultColumnDf.append(columnDf)

                    resultConcatDf = resultColumnDf[0]
                    for k in range(len(resultColumnDf) - 1):
                        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[k + 1]], axis = 1, join = 'inner')
                        resultConcatDf = resultConcatDf.reset_index(drop = True)

                    resultDfList.append(resultConcatDf)

        if alphabet == 'o':
            resultDfList = []

            for j in range(len(combinationDfList)):
                df = combinationDfList[j]

                for actionDetail in actionDetailList:
                    resultColumnDf = []

                    for k in range(len(columnList)):
                        columnDf = df.iloc[:, k]
                        tmpDf = columnDf.to_frame(name = columnList[k])
                        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                        lower, upper = imputation.LowerUpper(columnDf)
                        outlierDf = columnDf[(columnDf < lower) | (columnDf > upper)]
                        outlierIndex = list(outlierDf.index)

                        if len(outlierIndex) > 0:
                            if actionDetail == "remove":
                                columnDf = columnDf.drop(outlierIndex)
                                columnDf = columnDf.to_frame(name = columnList[k])

                            else:
                                for m in outlierIndex:
                                    columnDf.loc[m] = np.nan

                                if actionDetail == "min":
                                    columnDf = imputation.custom_imp_min(columnDf, columnList[k])
                                if actionDetail == "max":
                                    columnDf = imputation.custom_imp_max(columnDf, columnList[k])
                                if actionDetail == "mode":
                                    columnDf = imputation.custom_imp_mode(columnDf, columnList[k])
                                if actionDetail == "mean":
                                    columnDf = imputation.custom_imp_mean(columnDf, columnList[k])
                                if actionDetail == "median":
                                    columnDf = imputation.custom_imp_median(columnDf, columnList[k])  
                                if actionDetail == "em":
                                    columnDf = imputation.custom_imp_em(columnDf, columnList[k])
                                if actionDetail == "locf":
                                    columnDf = imputation.custom_imp_locf(columnDf, columnList[k])

                                for m in missingIndex:
                                    columnDf.loc[m, columnList[k]] = np.nan
                        
                        else:
                            columnDf = columnDf

                        resultColumnDf.append(columnDf)

                    resultConcatDf = resultColumnDf[0]
                    for k in range(len(resultColumnDf) - 1):
                        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[k + 1]], axis = 1, join = 'inner')
                        resultConcatDf = resultConcatDf.reset_index(drop = True)

                    resultDfList.append(resultConcatDf)

        if alphabet == 'i':
            resultDfList = []

            for j in range(len(combinationDfList)):
                df = combinationDfList[j]

                for actionDetail in actionDetailList:
                    resultColumnDf = []

                    for k in range(len(columnList)):
                        columnDf = df.iloc[:, k]
                        tmpDf = columnDf.to_frame(name = columnList[k])
                        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
                        tmpDf = columnDf.to_frame(name = columnList[k])
                        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                        if len(missingAndInconsIndex - missingIndex) > 0:
                            if actionDetail == "remove":
                                columnDf = columnDf.dropna()
                                columnDf = columnDf.to_frame(name = columnList[k])

                            else:
                                if actionDetail == "min":
                                    columnDf = imputation.custom_imp_min(columnDf, columnList[k])
                                if actionDetail == "max":
                                    columnDf = imputation.custom_imp_max(columnDf, columnList[k])
                                if actionDetail == "mode":
                                    columnDf = imputation.custom_imp_mode(columnDf, columnList[k])
                                if actionDetail == "mean":
                                    columnDf = imputation.custom_imp_mean(columnDf, columnList[k])
                                if actionDetail == "median":
                                    columnDf = imputation.custom_imp_median(columnDf, columnList[k])  
                                if actionDetail == "em":
                                    columnDf = imputation.custom_imp_em(columnDf, columnList[k])
                                if actionDetail == "locf":
                                    columnDf = imputation.custom_imp_locf(columnDf, columnList[k])
                        
                                for m in missingIndex:
                                    actionDf.loc[m, columnList[k]] = np.nan
                        
                        else:
                            columnDf = columnDf

                        resultColumnDf.append(columnDf)

                    resultConcatDf = resultColumnDf[0]
                    for k in range(len(resultColumnDf) - 1):
                        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[k + 1]], axis = 1, join = 'inner')
                        resultConcatDf = resultConcatDf.reset_index(drop = True)

                    resultDfList.append(resultConcatDf)

        if alphabet == 't':
            resultDfList = []

            for j in range(len(combinationDfList)):
                df = combinationDfList[j]

                for actionDetail in transDetailList:
                    if actionDetail == "minmax":
                        from sklearn.preprocessing import MinMaxScaler
                        scaler = MinMaxScaler()
                        scaler.fit(df)
                        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

                    if actionDetail == "standard":
                        from sklearn.preprocessing import StandardScaler
                        scaler = StandardScaler()
                        scaler.fit(df)
                        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

                    if actionDetail == "maxabs":
                        from sklearn.preprocessing import MaxAbsScaler
                        scaler = MaxAbsScaler()
                        scaler.fit(df)
                        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

                    if actionDetail == "robust":
                        from sklearn.preprocessing import RobustScaler
                        scaler = RobustScaler()
                        scaler.fit(df)
                        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

                    if actionDetail == "log":
                        df = df.reset_index(drop = True)
                        resultDf = np.log(df)

                    if actionDetail == "sqrt":
                        df = df.reset_index(drop = True)
                        resultDf = np.sqrt(df)

                    if actionDetail == "boxcox":
                        print("have to develop")

                    resultDfList.append(resultDf)

        combinationDfList = resultDfList
    
    for i in range(len(combinationDfList)):
        combinationDfList[i] = combinationDfList[i].dropna()
        combinationDfList[i] = combinationDfList[i].reset_index(drop = True)
        actionTotalDfList.append(combinationDfList[i])

print(len(actionTotalDfList))

# autoML
from pycaret.regression import *
predictName = 'hue'
resultList = []

for i in range(0, 3):
    clf = setup(data = actionTotalDfList[i], target = predictName, preprocess = False, session_id = 42, silent = True)
    model = compare_models()
    result = pull()
    resultList.append(result)

test = resultList[0]
with open('static/modelData.json','w') as file:
    json.dump(test, file, indent = 4)

# for i in range(0, 3):
#     with open('static/modelData.json', 'r') as file:
#         fileData = json.load(file)
#         fileData[i].append(resultList[i])
#         json.dump(fileData, file, indent = 4)