import json
import itertools
import numpy as np
import pandas as pd
import module.imputation as imputation

fileName = 'test'
filePath = 'static/' + fileName + '.csv'
originDf = pd.read_csv(filePath, sep = ',')

print(originDf)

# missing, outlier, incons check
checkList = []
missing = sum(originDf.isnull().sum().values.tolist())

tmpList = []
for column in originDf:
    df = pd.DataFrame(pd.to_numeric(originDf[column], errors = 'coerce'))
    df = df.dropna()

    lower, upper = imputation.LowerUpper(df[column])
    data1 = df[df[column] > upper]
    data2 = df[df[column] < lower]
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
    print(permutation)
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

                        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
                        tmpDf = columnDf.to_frame(name = columnList[k])
                        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]
                        inconsIndex = list(set(missingAndInconsIndex) - set(missingIndex))

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

                                for m in inconsIndex:
                                    columnDf.loc[m, columnList[k]] = 'incons'
                        
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

                        if len(list(set(missingAndInconsIndex) - set(missingIndex))) > 0:
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
                                    columnDf.loc[m, columnList[k]] = np.nan
                        
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
            inconsIndex = {}

            for j in range(len(combinationDfList)):
                df = combinationDfList[j]
                coerceDfList = []

                for k in range(len(columnList)):
                    columnDf = df.iloc[:, k]
                    tmpDf = columnDf.to_frame(name = columnList[k])
                    missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                    columnDf = pd.to_numeric(columnDf, errors = 'coerce')
                    tmpDf = columnDf.to_frame(name = columnList[k])
                    missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

                    coerceDfList.append(tmpDf)

                    if len(list(set(missingAndInconsIndex) - set(missingIndex))) > 0:
                        inconsIndex[k] = list(set(missingAndInconsIndex) - set(missingIndex))

                coerceDf = coerceDfList[0]
                for k in range(len(coerceDfList) - 1):
                    coerceDf = pd.concat([coerceDf, coerceDfList[k + 1]], axis = 1)

                df = coerceDf

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

                    for column in range(len(inconsIndex)):
                        for row in inconsIndex[column]:
                            resultDf.iloc[row, column] = 'incons'

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
inputModelList = ['lr', 'knn', 'dt']
inputEvalList = ['MAE', 'MSE', 'RMSE']

resultList = []
for i in range(0, len(actionTotalDfList)):
    clf = setup(data = actionTotalDfList[i], target = predictName, preprocess = False, session_id = 42, use_gpu = True, silent = True)
    model = compare_models(include = inputModelList)
    result = pull()
    resultList.append(result)

with open('static/modelData.json', 'w') as file:
    file.write(json.dumps([result.to_dict() for result in resultList], indent = 4))