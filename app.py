import sys
import os
from flask import *
from flask_cors import CORS

import os
import ast
import csv
import math
import json
import codecs
import itertools
import numpy as np
import pandas as pd
from io import StringIO
from scipy import stats
from collections import Counter

from nl4dv import NL4DV
from pycaret.regression import *

import module.imputation as imputation
import module.tree as tree

app = Flask(__name__)
CORS(app)

fileName = 'bike'
purpose = ''
purposeColumn = ''
inputModelList = []
inputEvalList = []

currentCnt = 0
combinationIcon = []
combinationDetailIcon = []

@app.route('/fileUpload', methods=['GET', 'POST'])
def fileUpload():
  req = request.files['file']

  fileUploadList = []
  stream = codecs.iterdecode(req.stream, 'utf-8')
  for row in csv.reader(stream, dialect = csv.excel):
    if row:
      fileUploadList.append(row)

  fileUploadDf = pd.DataFrame(fileUploadList)
  fileUploadDf = fileUploadDf.rename(columns = fileUploadDf.iloc[0])
  fileUploadDf = fileUploadDf.drop(fileUploadDf.index[0])
  fileUploadDf = fileUploadDf.reset_index(drop = True)

  originDf = fileUploadDf.reindex(sorted(fileUploadDf.columns), axis = 1)
  originDf.to_json('static/file.json', orient = 'records', indent = 4)

  response = {}
  response['columnList'] = list(originDf.columns)

  return json.dumps(response)

@app.route('/setting', methods=['GET', 'POST'])
def setting():
  global purpose, purposeColumn, inputModelList, inputEvalList

  if request.method == 'GET':
    originDf = pd.read_csv('static/' + fileName + '.csv')
    originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

    purposeList = []
    tmpList = ['Prediction', 'Classification']
    for i in range(len(tmpList)):
      purposeList.append({'label': tmpList[i], 'value': i})      

    columnList = []
    tmpList = list(originDf.columns)
    for i in range(len(tmpList)):
      columnList.append({'label': tmpList[i], 'value': i})

    modelList = []
    tmpList = ['LR', 'LASSO', 'RIDGE', 'EN', 'LAR', 'LLAR', 'OMP', 'BR', 'ARD', 'PAR', 'RANSAC',
                'TR', 'HUBER', 'KR', 'SVM', 'KNN', 'DT', 'RF', 'ET', 'ADA', 'GBR', 'MLP', 'XGBOOST',
                'LIGHTGBM', 'CATBOOST']
  
    for i in range(len(tmpList)):
      modelList.append({'label': tmpList[i], 'value': i})

    evalList = []
    tmpList = ['MAE', 'MSE', 'RMSE', 'R2', 'RMSLE', 'MAPE']
    
    for i in range(len(tmpList)):
      evalList.append({'label': tmpList[i], 'value': i})

    response = {}
    response['purposeList'] = purposeList
    response['columnList'] = columnList
    response['modelList'] = modelList
    response['evalList'] = evalList
    
    return json.dumps(response)

@app.route('/query', methods=['GET', 'POST'])
def query():
  query = request.get_data().decode('utf-8')

  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  nl4dvDict = originDf.dropna().to_dict('records')
  nl4dvInstance = NL4DV(data_url = os.path.join('static/' + fileName + '.csv'))
  nl4dvInstance.set_dependency_parser(config = {"name": "spacy", "model": "en_core_web_sm", "parser": None})
  nl4dvOutput = nl4dvInstance.analyze_query(query)

  # extraction attribute, task, vistype
  try:
    attributes = nl4dvOutput['visList'][0]['attributes']
    tasks = nl4dvOutput['visList'][0]['tasks']
    visType = nl4dvOutput['visList'][0]['visType']
  except:
    return jsonify({'nl4dv': 'please writing valid query'})

  if type(attributes) == list:
    attributes = ",".join(attributes)
  if type(tasks) == list:
    tasks = ",".join(tasks)
  if type(visType) == list:
    visType = ",".join(visType)

  # extraction vlspec
  vlSpec = nl4dvOutput['visList'][0]['vlSpec']
  vlSpec['data']['values'] = nl4dvDict

  vlSpec['width'] = "container"
  vlSpec['height'] = "container"

  # preprocessing vlspec
  if 'encoding' in vlSpec:
      if 'x' in vlSpec['encoding']:
          if 'aggregate' in vlSpec['encoding']['x']:
              del vlSpec['encoding']['x']['aggregate']
  if 'encoding' in vlSpec:
      if 'y' in vlSpec['encoding']:
          if 'aggregate' in vlSpec['encoding']['y']:
              del vlSpec['encoding']['y']['aggregate']
  if 'encoding' in vlSpec:
      if 'x' in vlSpec['encoding']:
          if 'bin' in vlSpec['encoding']['x']:
              del vlSpec['encoding']['x']['bin']
  if 'encoding' in vlSpec:
      if 'color' in vlSpec['encoding']:
          if 'aggregate' in vlSpec['encoding']['color']:
              del vlSpec['encoding']['color']['aggregate']

  del vlSpec['mark']['tooltip']
  del vlSpec['data']['format']
  del vlSpec['data']['url']

  return jsonify({'nl4dv': vlSpec})

@app.route('/chartTable', methods = ['GET', 'POST'])
def chartTable():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  actionList = ['missing', 'outlier', 'transformation']

  # permutation
  permutationList = []
  for i in range(len(actionList)):
      permutationList.append(list(map("".join, itertools.permutations(actionList, i + 1))))
  permutationList = sum(permutationList, [])

  # combination
  impDetailList = ["rem!", "min!", "max!", "men!", "mod!", "med!", "em!", "lof!"]
  transDetailList = ["mm!", "std!", "mbs!", "rob!", "log!", "sqt!"]

  with open('static/modelData.json') as f:
    autoMLDict = json.load(f)

  ##### to fix
  inputModelList = ['LR', 'SVM', 'GBR']
  inputEvalList = ['MAE', 'MSE', 'RMSE']
  #####

  response = {}
  response['combinationList'] = list(range(len(autoMLDict) * len(inputModelList)))
  response['inputModelList'] = inputModelList
  response['inputEvalList'] = inputEvalList

  # combination - modelNames
  modelNames = []
  for i in range(len(autoMLDict)):
    for j in range(len(inputModelList)):
      modelNames.append(inputModelList[j])

  # combination - combinationIconList
  combinationIconList = []
  stopState = False
  for i in range(len(permutationList)):
    if stopState == True:
      break

    toCombinationCnt = 1
    combinationIcon = []
    for action in actionList:
      if action in permutationList[i]:
        combinationIcon.append(action)

        if action == 'transformation':
          toCombinationCnt = toCombinationCnt * len(transDetailList)
        else:
          toCombinationCnt = toCombinationCnt * len(impDetailList)

    for j in range(len(inputModelList) * toCombinationCnt):
      combinationIconList.append(combinationIcon)

      if len(combinationIconList) > (len(autoMLDict) * len(inputModelList)) - 1:
        stopState = True
        break

  # combination - combinationDetailIconList
  combinationDetailIconList = []
  stopState = False
  for i in range(len(permutationList)):
    if stopState == True:
      break

    toCombinationList = []
    for action in actionList:
      if action in permutationList[i]:
        if action == 'transformation':
          toCombinationList.append(transDetailList)
        else:
          toCombinationList.append(impDetailList)

    if len(toCombinationList) == 1:
      combinationList = toCombinationList[0]

      for j in range(len(combinationList)):
        combinationDetailIcon = combinationList[j]
        combinationDetailIcon = combinationDetailIcon[:-1]

        for k in range(len(inputModelList)):
          combinationDetailIconList.append([combinationDetailIcon])

    else:
      combinationList = toCombinationList[0]
      for j in range(len(toCombinationList) - 1):
        if stopState == True:
          break

        tmpList = []
        for k in itertools.product(combinationList, toCombinationList[j + 1]):
          tmpList.append(k[1] + k[0])        

        combinationList = tmpList

      combinationDetailIcon = []
      for j in range(len(combinationList)):
        combinationDetailIcon = combinationList[j].split('!')
        combinationDetailIcon.remove('')

        for k in range(len(inputModelList)):
          combinationDetailIconList.append(combinationDetailIcon[::-1])
          if len(combinationDetailIconList) > (len(autoMLDict) * len(inputModelList)) - 1:
            stopState = True
            break

  # evalDict
  evalDict = {}
  maxEvalList = []

  for inputEval in inputEvalList:
    evalDict[inputEval] = []
    maxEvalList.append(0)

  for autoML in autoMLDict:
    for i in range(len(inputEvalList)):
      for j in range(len(inputModelList)):
        inputModel = inputModelList[j].lower()

        if maxEvalList[i] < autoML[inputEvalList[i]][inputModel]:
          maxEvalList[i] = autoML[inputEvalList[i]][inputModel]
        evalDict[inputEvalList[i]].append(autoML[inputEvalList[i]][inputModel])

  resultEvalList = []
  for i in range(len(inputEvalList)):
    resultEvalList.append([])

  for i in range(len(inputEvalList)):
    maxEvalList[i] = math.ceil(maxEvalList[i])
    evalList = evalDict[inputEvalList[i]]

    for j in range(len(evalList)):
      data = evalList[j]
      originData = maxEvalList[i] - evalList[j]

      resultEvalList[i].append({'data': data, 'originData': originData})

  for i in range(len(inputEvalList)):
    response[inputEvalList[i]] = resultEvalList[i]

  response['modelNames'] = modelNames
  response['combinationIconList'] = combinationIconList
  response['combinationDetailIconList'] = combinationDetailIconList

  with open('static/combinationData.json', 'w') as f:
      json.dump(response, f, indent = 4)

  return json.dumps(response)

@app.route('/selectedModelOverviewTable', methods=['GET', 'POST'])
def selectedModelOverviewTable():
  req = request.get_data().decode('utf-8')
  req = eval(req)

  global currentCnt, combinationIcon, combinationDetailIcon
  selectedModelOverviewTable = req['key']
  combinationIcon = req['Combination']
  combinationDetailIcon = req['CombinationDetail']
  currentCnt = len(combinationDetailIcon) + 1

  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  columnList = list(originDf.columns)
  lastDf = originDf

  for file in os.scandir('static/dataset/'):
    os.remove(file.path)

  for i in range(len(combinationIcon)):
    action = combinationIcon[i]
    actionDetail = combinationDetailIcon[i]

    if action == 'missing':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]

        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]
        inconsIndex = list(set(missingAndInconsIndex) - set(missingIndex))

        if actionDetail == "rem":
          columnDf = columnDf.dropna()
          columnDf = columnDf.to_frame(name = columnList[j])

        else:
          if actionDetail == "min":
            columnDf = imputation.custom_imp_min(columnDf, columnList[j])
          if actionDetail == "max":
            columnDf = imputation.custom_imp_max(columnDf, columnList[j])
          if actionDetail == "mod":
            columnDf = imputation.custom_imp_mode(columnDf, columnList[j])
          if actionDetail == "men":
            columnDf = imputation.custom_imp_mean(columnDf, columnList[j])
          if actionDetail == "med":
            columnDf = imputation.custom_imp_median(columnDf, columnList[j])  
          if actionDetail == "em":
            columnDf = imputation.custom_imp_em(columnDf, columnList[j])
          if actionDetail == "lof":
            columnDf = imputation.custom_imp_locf(columnDf, columnList[j])

          for m in inconsIndex:
            columnDf.loc[m] = 'incons'

        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
        resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf
      lastDf.to_csv('static/dataset/' + str(i) + '.csv', index = False)
    
    if action == 'outlier':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]

        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        tmpDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = tmpDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]
        inconsIndex = list(set(missingAndInconsIndex) - set(missingIndex))

        tmpDf = pd.to_numeric(columnDf, errors = 'coerce')
        lower, upper = imputation.LowerUpper(tmpDf)
        outlierDf = tmpDf[(tmpDf < lower) | (tmpDf > upper)]
        outlierIndex = list(outlierDf.index)

        if actionDetail == "rem":
          columnDf = columnDf.drop(outlierIndex)
          columnDf = columnDf.to_frame(name = columnList[j])

        else:
          for m in outlierIndex:
            columnDf.loc[m] = np.nan
          
          columnDf = pd.to_numeric(columnDf, errors = 'coerce')
          
          if actionDetail == "min":
            columnDf = imputation.custom_imp_min(columnDf, columnList[j])
          if actionDetail == "max":
            columnDf = imputation.custom_imp_max(columnDf, columnList[j])
          if actionDetail == "mod":
            columnDf = imputation.custom_imp_mode(columnDf, columnList[j])
          if actionDetail == "men":
            columnDf = imputation.custom_imp_mean(columnDf, columnList[j])
          if actionDetail == "med":
            columnDf = imputation.custom_imp_median(columnDf, columnList[j])  
          if actionDetail == "em":
            columnDf = imputation.custom_imp_em(columnDf, columnList[j])
          if actionDetail == "lof":
            columnDf = imputation.custom_imp_locf(columnDf, columnList[j])

          for m in missingIndex:
            columnDf.loc[m] = np.nan

          for m in inconsIndex:
            columnDf.loc[m] = 'incons'

        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
        resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf
      lastDf.to_csv('static/dataset/' + str(i) + '.csv', index = False)      

    if action == 'inconsistent':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]

        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]
        inconsIndex = list(set(missingAndInconsIndex) - set(missingIndex))

        if actionDetail == "rem":
          columnDf = lastDf.iloc[:, j]

          for i in inconsIndex:
            columnDf.drop([i], axis = 0)

        else:
          if actionDetail == "min":
            columnDf = imputation.custom_imp_min(columnDf, columnList[j])
          if actionDetail == "max":
            columnDf = imputation.custom_imp_max(columnDf, columnList[j])
          if actionDetail == "mod":
            columnDf = imputation.custom_imp_mode(columnDf, columnList[j])
          if actionDetail == "men":
            columnDf = imputation.custom_imp_mean(columnDf, columnList[j])
          if actionDetail == "med":
            columnDf = imputation.custom_imp_median(columnDf, columnList[j])  
          if actionDetail == "em":
            columnDf = imputation.custom_imp_em(columnDf, columnList[j])
          if actionDetail == "lof":
            columnDf = imputation.custom_imp_locf(columnDf, columnList[j])

          for m in missingIndex:
            columnDf.loc[m] = np.nan

        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
          resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
          resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf
      lastDf.to_csv('static/dataset/' + str(i) + '.csv', index = False)

    if action == 'transformation':
      coerceDfList = []
      inconsIndex = {}

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        coerceDfList.append(tmpDf)

        if len(list(set(missingAndInconsIndex) - set(missingIndex))) > 0:
          inconsIndex[j] = list(set(missingAndInconsIndex) - set(missingIndex))

      coerceDf = coerceDfList[0]
      for j in range(len(coerceDfList) - 1):
        coerceDf = pd.concat([coerceDf, coerceDfList[j + 1]], axis = 1)

      df = coerceDf

      if actionDetail == "mm":
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
        scaler.fit(df)
        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

      if actionDetail == "std":
        from sklearn.preprocessing import StandardScaler
        scaler = StandardScaler()
        scaler.fit(df)
        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

      if actionDetail == "mbs":
        from sklearn.preprocessing import MaxAbsScaler
        scaler = MaxAbsScaler()
        scaler.fit(df)
        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

      if actionDetail == "rob":
        from sklearn.preprocessing import RobustScaler
        scaler = RobustScaler()
        scaler.fit(df)
        resultDf = pd.DataFrame(scaler.transform(df), columns = columnList)

      if actionDetail == "log":
        df = df.reset_index(drop = True)
        resultDf = np.log(df)

      if actionDetail == "sqt":
        df = df.reset_index(drop = True)
        resultDf = np.sqrt(df)

      if actionDetail == "boxcox":
        print("have to develop")

      for column in range(len(inconsIndex)):
        for row in inconsIndex[column]:
          resultDf.iloc[row, column] = 'incons'

      lastDf = resultDf
      lastDf.to_csv('static/dataset/' + str(i) + '.csv', index = False)

  os.remove('static/treeData.json')

  initTreeDict = {
    "index": "0",
    "state": "none",
    "name": "start",
    "children": [
    ]
  }

  with open('static/treeData.json', 'w') as f:
    json.dump(initTreeDict, f, indent = 4)

  with open('static/treeData.json') as jsonData:
      treeData = json.load(jsonData)

  root = tree.TreeNode(index = treeData['index'], state = treeData['state'], name = treeData['name'])
  root = root.dict_to_tree(treeData['children'])

  for i in range(len(combinationIcon)):
    newNode = tree.TreeNode(index = str(i + 1), state = 'none', name = combinationDetailIcon[i])
    
    root.add_child_to(str(i), newNode)
    root.update_state()

    treeData = root.tree_to_dict()
    with open('static/treeData.json', 'w') as f:
        json.dump(treeData, f, indent = 4)  

  return json.dumps({'selectedModelOverviewTable': 'success'})

@app.route('/lineChart', methods=['GET', 'POST'])
def lineChart():
  ##### to fix
  inputModelList = ['lr', 'svm', 'gbr']
  purposeColumn = 'cnt'
  orderEval = 'MAE'
  #####

  fileList = os.listdir('static/dataset')
  evalResultList = []
  for i in range(len(fileList) + 1):
    evalResultList.append([])

  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  originDf = originDf.apply(pd.to_numeric, errors = 'coerce')
  originDf = originDf.dropna()

  clf = setup(data = originDf, target = purposeColumn, preprocess = False, session_id = 42, use_gpu = True, silent = True)
  model = compare_models(include = inputModelList)
  evalResultDf = pull()

  for i in range(len(inputModelList)):
    modelName = inputModelList[i]
    evalResult = evalResultDf.loc[modelName][orderEval]
    evalResultList[0].append(evalResult)

  for i in range(len(fileList)):
    df = pd.read_csv('static/dataset/' + fileList[i])
    df = df.apply(pd.to_numeric, errors = 'coerce')
    df = df.dropna()

    clf = setup(data = df, target = purposeColumn, preprocess = False, session_id = 42, use_gpu = True, silent = True)
    model = compare_models(include = inputModelList)
    evalResultDf = pull()

    for j in range(len(inputModelList)):
      modelName = inputModelList[j]
      evalResult = evalResultDf.loc[modelName][orderEval]
      evalResultList[i + 1].append(evalResult)

  lineChartList = []
  for i in range(len(evalResultList)):
    tmpDict = {}
    tmpDict['time'] = i

    for j in range(len(inputModelList)):
      tmpDict[inputModelList[j]] = evalResultList[i][j]

    lineChartList.append(tmpDict)

  return jsonify(lineChartList)

@app.route('/treeChart', methods = ['GET', 'POST'])
def treeChart():
  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  return jsonify(treeData)

@app.route('/modelDetailTable', methods = ['GET', 'POST'])
def modelDetailTable():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = originDf.columns.tolist()

  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  # barChart
  barChartList = []
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

  barChartList.append({'group': 'data', 'missing': missing, 'outlier': outlier, 'incons': incons})

  # denisityChart
  densityChartList = []

  df = originDf['cnt'].apply(pd.to_numeric, errors = 'coerce')
  df = df.dropna().reset_index(drop = True)
  df = pd.DataFrame(df)

  mu = df.mean()
  std = df.std()
  rv = stats.norm(loc = mu, scale = std)
  normDf = pd.DataFrame(rv.rvs(size = 5000, random_state = 0))

  rv = stats.uniform(loc = mu, scale = std)
  uniformDf = pd.DataFrame(rv.rvs(size = 5000, random_state = 0))
  densityDf = imputation.densityDf(normDf, uniformDf, df)

  densityChartList.append(densityDf.to_dict('records'))

  fileList = os.listdir('static/dataset')
  for i in range(len(fileList)):
    originDf = pd.read_csv('static/dataset/' + fileList[i])

    # barChart
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

    barChartList.append({'group': 'data', 'missing': missing, 'outlier': outlier, 'incons': incons})

    # densityChart
    df = originDf['cnt'].apply(pd.to_numeric, errors = 'coerce')
    df = df.dropna().reset_index(drop = True)
    df = pd.DataFrame(df)
    densityDf = imputation.densityDf(normDf, uniformDf, df)

    densityChartList.append(densityDf.to_dict('records'))

  global combinationIcon, combinationDetailIcon, currentCnt
  actionList = combinationIcon
  actionDetailList = combinationDetailIcon

  if 'start' not in actionList:
    actionList.insert(0, 'start')
  if 'start' not in actionDetailList:
    actionDetailList.insert(0, 'start')

  response = {}
  response['currentCnt'] = currentCnt
  response['actionList'] = actionList
  response['actionDetailList'] = actionDetailList
  response['barChartList'] = barChartList
  response['densityChartList'] = densityChartList

  return json.dumps(response)

@app.route('/actionDetailBarchart', methods = ['GET', 'POST'])
def actionDetailBarchart():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = list(originDf.columns)

  # missing, outlier, incons check
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

  response = {}
  response['missing'] = {'data': missing, 'originData': len(originDf) * len(columnList) - missing}
  response['outlier'] = {'data': outlier, 'originData': len(originDf) * len(columnList) - outlier}
  response['incons'] = {'data': incons, 'originData': len(originDf) * len(columnList) - incons}

  return jsonify(response)

@app.route('/heatmapChart', methods = ['GET', 'POST'])
def heatmapChart():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  columnList = list(originDf.columns)
  heatmapList = []
  
  heatmapDf, heatmapYList = imputation.missingHeatmapDf(columnList, originDf)
  heatmapList.append(list(heatmapDf.transpose().to_dict().values()))

  heatmapDf, heatmapYList = imputation.outlierHeatmapDf(columnList, originDf)
  heatmapList.append(list(heatmapDf.transpose().to_dict().values()))

  heatmapDf, heatmapYList = imputation.inconsHeatmapDf(columnList, originDf)
  heatmapList.append(list(heatmapDf.transpose().to_dict().values()))

  response = {}
  response['heatmapList'] = heatmapList
  response['heatmapYList'] = heatmapYList

  return json.dumps(response) 

@app.route('/histogramChart', methods = ['GET', 'POST'])
def histogramChart():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  originDf = originDf.apply(pd.to_numeric, errors = 'coerce')

  columnList = list(originDf.columns)
  histogramDf = originDf

  req = request.get_data().decode('utf-8')
  
  if req == '':
    histogramDf = pd.DataFrame(histogramDf.iloc[:, 0])
  else:
    req = ast.literal_eval(req)

    for i in range(len(columnList)):
      if req['index'] == columnList[i]:
        selectedIndex = i

    histogramDf = pd.DataFrame(histogramDf.iloc[:, selectedIndex])

  minValue = histogramDf.min()
  maxValue = histogramDf.max()
  size = (maxValue - minValue)/20

  histogramList = histogramDf.values.tolist()
  histogramList = sum(histogramList, [])
  histogramChartList = [0 for i in range(20)]

  for i in range(20):
    minRange = float(minValue + (size * (i)))
    maxRange = float(minValue + (size * (i + 1)))

    for j in range(len(histogramList)):
      if histogramList[j] == 'nan':
        break
      
      if histogramList[j] >= minRange and histogramList[j] < maxRange:
        histogramChartList[i] = histogramChartList[i] + 1

    response = {}
    response['histogramChartList'] = histogramChartList
    
  return json.dumps(response)

@app.route('/scatterChart', methods = ['GET', 'POST'])
def scatterChart():
  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  originDf = originDf.apply(pd.to_numeric, errors = 'coerce')

  scatterDf = originDf.dropna().reset_index(drop = True)

  from sklearn.manifold import TSNE
  dataMatrix = scatterDf.values

  tsneDf = TSNE(n_components = 2, random_state = 0).fit_transform(dataMatrix)
  tsneDf = pd.DataFrame(tsneDf, columns = ['value1', 'value2'])

  from sklearn.decomposition import PCA
  pcaDf = PCA(n_components = 2, random_state = 0).fit_transform(dataMatrix)
  pcaDf = pd.DataFrame(pcaDf, columns = ['value1', 'value2'])

  response = {}
  response['tsneDict'] = list(tsneDf.transpose().to_dict().values())
  response['pcaDict'] = list(pcaDf.transpose().to_dict().values())

  return json.dumps(response)

@app.route('/action', methods=['GET', 'POST'])
def action():
  req = request.get_data().decode('utf-8')

  req = req.strip('[')
  req = req.strip(']')
  req = req.split(',')
  
  targetIndex = int(req[0])
  columnIndex = int(req[1])
  actionIndex = int(req[2])

  originDf = pd.read_csv('static/' + fileName + '.csv')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  targetList = ['missing', 'outlier', 'incons']
  actionList = ["remove", "min", "max", "mean", "mode", "median", "em", "locf"]

  columnList = list(originDf.columns)
  actionDf = originDf.iloc[:, columnIndex]
  remainDf = originDf.drop([columnList[columnIndex]], axis = 1)

  tmpDf = actionDf.to_frame(name = columnList[columnIndex])
  missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

  if targetList[targetIndex] == 'missing':
    if actionList[actionIndex] == "remove":
      actionDf = actionDf.dropna()
      actionDf = actionDf.to_frame(name = columnList[columnIndex])
    if actionList[actionIndex] == "min":
      actionDf = imputation.custom_imp_min(actionDf, columnList[columnIndex])
    if actionList[actionIndex] == "max":
      actionDf = imputation.custom_imp_max(actionDf, columnList[columnIndex])
    if actionList[actionIndex] == "mode":
      actionDf = imputation.custom_imp_mode(actionDf, columnList[columnIndex])
    if actionList[actionIndex] == "mean":
      actionDf = imputation.custom_imp_mean(actionDf, columnList[columnIndex])
    if actionList[actionIndex] == "median":
      actionDf = imputation.custom_imp_median(actionDf, columnList[columnIndex])  
    if actionList[actionIndex] == "em":
      actionDf = imputation.custom_imp_em(actionDf, columnList[columnIndex])
    if actionList[actionIndex] == "locf":
      actionDf = imputation.custom_imp_locf(actionDf, columnList[columnIndex])

  if targetList[targetIndex] == 'outlier':
    lower, upper = imputation.LowerUpper(actionDf)
    outlierDf = actionDf[(actionDf < lower) | (actionDf > upper)]
    outlierIndex = list(outlierDf.index)

    if actionList[actionIndex] == "remove":
      actionDf = actionDf.drop(outlierIndex)
      actionDf = actionDf.to_frame(name = columnList[columnIndex])

    else:
      for i in outlierIndex:
        actionDf.loc[i] = np.nan

      if actionList[actionIndex] == "min":
        actionDf = imputation.custom_imp_min(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "max":
        actionDf = imputation.custom_imp_max(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "mode":
        actionDf = imputation.custom_imp_mode(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "mean":
        actionDf = imputation.custom_imp_mean(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "median":
        actionDf = imputation.custom_imp_median(actionDf, columnList[columnIndex])  
      if actionList[actionIndex] == "em":
        actionDf = imputation.custom_imp_em(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "locf":
        actionDf = imputation.custom_imp_locf(actionDf, columnList[columnIndex])

      for i in missingIndex:
        actionDf.loc[i, columnList[columnIndex]] = np.nan

  if targetList[targetIndex] == 'incons':
    actionDf = pd.to_numeric(actionDf, errors = 'coerce')

    if actionList[actionIndex] == "remove":
      actionDf = actionDf.dropna()
      actionDf = actionDf.to_frame(name = columnList[columnIndex])

    else:
      if actionList[actionIndex] == "min":
        actionDf = imputation.custom_imp_min(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "max":
        actionDf = imputation.custom_imp_max(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "mode":
        actionDf = imputation.custom_imp_mode(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "mean":
        actionDf = imputation.custom_imp_mean(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "median":
        actionDf = imputation.custom_imp_median(actionDf, columnList[columnIndex])  
      if actionList[actionIndex] == "em":
        actionDf = imputation.custom_imp_em(actionDf, columnList[columnIndex])
      if actionList[actionIndex] == "locf":
        actionDf = imputation.custom_imp_locf(actionDf, columnList[columnIndex])

      for i in missingIndex:
        actionDf.loc[i, columnList[columnIndex]] = np.nan

  actionDf = actionDf.sort_index()
  changeDf = pd.concat([actionDf, remainDf], axis = 1, join = 'inner').reset_index(drop = True)
  changeDf = changeDf.reindex(sorted(changeDf.columns), axis = 1)
  
  originDf = changeDf
  originDf.to_json('static/file.json', orient = 'records', indent = 4)
  originDf.to_csv('static/' + fileName + '.csv', index = False)

  with open('static/treeData.json') as jsonData:
      treeData = json.load(jsonData)

  root = tree.TreeNode(index = treeData['index'], state = treeData['state'], name = treeData['name'])
  root = root.dict_to_tree(treeData['children'])

  global currentCnt
  newNode = tree.TreeNode(index = str(currentCnt), state = '', name = actionList[actionIndex])
  
  root.add_child_to(str(currentCnt - 1), newNode)
  root.update_state()
  currentCnt = currentCnt + 1

  treeData = root.tree_to_dict()
  with open('static/treeData.json', 'w') as f:
      json.dump(treeData, f, indent = 4)

  changeDf.to_csv('static/dataset/' + str(currentCnt) + '.csv', index = False)

  return json.dumps({'action': 'success'})

if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug = True)