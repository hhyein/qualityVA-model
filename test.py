import json
import numpy as np
import pandas as pd

fileName = 'wine'
filePath = 'static/' + fileName + '.csv'
originDf = pd.read_csv(filePath, sep = ',')

# autoML
predictName = 'hue'
inputModelList = ['Logistic Regression']
inputEvalList = ['Accuracy', 'AUC', 'Recall']

# automlDf = originDf.dropna()
# clf = setup(data = automlDf, target = predictName, preprocess = False, session_id = 42, silent = True)
# models = compare_models()
# results = pull()
# results.to_json('static/modelData.json', orient = 'records', indent = 4)

with open('static/modelData.json') as data:
    data = json.load(data)
autoMLDf = pd.DataFrame.from_dict(data)

print(autoMLDf)

modelList = autoMLDf['Model'].values.tolist()
modelIndex = []
for i in inputModelList:
    modelIndex.append(modelList.index(i))

evalList = ['Accuracy', 'AUC', 'Recall', 'Prec.', 'F1', 'Kappa', 'MCC', 'TT (Sec)']
evalIndex = []
for i in inputEvalList:
    evalIndex.append(evalList.index(i) + 1)

print(modelIndex)
print(evalIndex)

resultList = []
for i in evalIndex:
    tmpList = []
    for j in modelIndex:
        tmpList.append(autoMLDf.iloc[j][i])
    resultList.append(tmpList[0])

print(resultList)

response = {}
response['inputModelList'] = inputModelList
response['inputEvalList'] = inputEvalList

for i in range(len(inputEvalList)):
    response[inputEvalList[i]] = {'data': resultList[i], 'originData': 1.0 - int(resultList[i])}

print(response)