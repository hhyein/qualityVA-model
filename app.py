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

# from nl4dv import NL4DV
# from pycaret.regression import *

import module.imputation as imputation
import module.tree as tree

app = Flask(__name__)
CORS(app)

predictName = ''
dimension = ''
inputModelList = []
inputEvalList = []

fileUploadState = False
currentCnt = 3
selectedModelOverviewTable = 0

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

  global fileUploadState
  originDf = fileUploadDf.reindex(sorted(fileUploadDf.columns), axis = 1)
  originDf.to_json('static/file.json', orient = 'records', indent = 4)
  fileUploadState = True

  return json.dumps({'fileUpload': 'success'})

@app.route('/', methods=['GET', 'POST'])
def home():
  global fileUploadState

  if fileUploadState == True:
    with open('static/file.json', 'r', encoding = 'utf-8') as f:
      data = json.load(f) 

    originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

    response = {}
    response['columnList'] = list(originDf.columns)

  else:
    response = {}
    response['columnList'] = []

  return json.dumps(response)

@app.route('/setting', methods=['GET', 'POST'])
def setting():
  if request.method == 'GET':
    global fileUploadState

    if fileUploadState == True:
      with open('static/file.json', 'r', encoding = 'utf-8') as f:
        data = json.load(f) 

      originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

      columnList = []
      tmpList = list(originDf.columns)
      for i in range(len(tmpList)):
        columnList.append({'label': tmpList[i], 'value': i})

      modelList = []
      # #### to fix
      # tmpList = ['lr', 'knn', 'nb', 'dt', 'svm', 'ridge', 'rf', 'qda', 'ada',
      #             'gbc', 'lda', 'et', 'xgboost', 'lightgbm', 'catboost']
      # ####
      tmpList = ['lr', 'knn', 'nb', 'dt', 'svm', 'rbfsvm', 'gpc', 'mlp', 'ridge', 'rf',
                  'qda', 'ada', 'gbc', 'lda', 'et', 'xgboost', 'lightgbm', 'catboost']
      for i in range(len(tmpList)):
        modelList.append({'label': tmpList[i], 'value': i})

      evalList = []
      # #### to fix
      # tmpList = ['Accuracy', 'AUC', 'Recall', 'Precision', 'F1', 'Kappa', 'MCC', 'TT']
      # ####
      tmpList = ['MAE', 'MSE', 'RMSE', 'R2', 'RMSLE', 'MAPE', 'TT']
      for i in range(len(tmpList)):
        evalList.append({'label': tmpList[i], 'value': i})

      dimensionList = []
      tmpList = ['TSNE', 'PCA']
      for i in range(len(tmpList)):
        dimensionList.append({'label': tmpList[i], 'value': i})

      response = {}
      response['columnList'] = columnList  
      response['modelList'] = modelList
      response['evalList'] = evalList
      response['dimensionList'] = dimensionList

    else:
      response = {}
      response['columnList'] = []
      response['modelList'] = []
      response['evalList'] = []
      response['dimensionList'] = []
    
    return json.dumps(response)

  if request.method == 'POST':
    req = request.get_data().decode('utf-8')
    req = eval(req)

    global predictName, dimension, inputModelList, inputEvalList

    if len(req) == 4:
      predictName = req["column"]["label"]
      dimension = req["dimension"]["label"]
      modelList = req["model"]
      evalList = req["eval"]

      inputModelList = []
      for i in range(len(modelList)):
          inputModelList.append(modelList[i]["label"])

      inputEvalList = []
      for i in range(len(evalList)):
          inputEvalList.append(evalList[i]["label"])

      return json.dumps({'setting': 'success'})

    else:
      return json.dumps({'setting': 'failure'})

@app.route('/query', methods=['GET', 'POST'])
def query():
  query = request.get_data().decode('utf-8')

  # with open('static/file.json', 'r', encoding = 'utf-8') as f:
  #   data = json.load(f) 

  # originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')
  # originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  # nl4dvDict = originDf.dropna().to_dict('records')
  # nl4dvInstance = NL4DV(data_url = os.path.join(filePath))
  # nl4dvInstance.set_dependency_parser(config = {"name": "spacy", "model": "en_core_web_sm", "parser": None})
  # nl4dvOutput = nl4dvInstance.analyze_query(query)

  # # extraction attribute, task, vistype
  # try:
  #   attributes = nl4dvOutput['visList'][0]['attributes']
  #   tasks = nl4dvOutput['visList'][0]['tasks']
  #   visType = nl4dvOutput['visList'][0]['visType']
  # except:
  #   return jsonify({'nl4dv': 'please writing valid query'})

  # if type(attributes) == list:
  #   attributes = ",".join(attributes)
  # if type(tasks) == list:
  #   tasks = ",".join(tasks)
  # if type(visType) == list:
  #   visType = ",".join(visType)

  # # extraction vlspec
  # vlSpec = nl4dvOutput['visList'][0]['vlSpec']
  # vlSpec['data']['values'] = nl4dvDict

  # vlSpec['width'] = "container"
  # vlSpec['height'] = "container"

  # # preprocessing vlspec
  # if 'encoding' in vlSpec:
  #     if 'x' in vlSpec['encoding']:
  #         if 'aggregate' in vlSpec['encoding']['x']:
  #             del vlSpec['encoding']['x']['aggregate']
  # if 'encoding' in vlSpec:
  #     if 'y' in vlSpec['encoding']:
  #         if 'aggregate' in vlSpec['encoding']['y']:
  #             del vlSpec['encoding']['y']['aggregate']
  # if 'encoding' in vlSpec:
  #     if 'x' in vlSpec['encoding']:
  #         if 'bin' in vlSpec['encoding']['x']:
  #             del vlSpec['encoding']['x']['bin']
  # if 'encoding' in vlSpec:
  #     if 'color' in vlSpec['encoding']:
  #         if 'aggregate' in vlSpec['encoding']['color']:
  #             del vlSpec['encoding']['color']['aggregate']

  # del vlSpec['mark']['tooltip']
  # del vlSpec['data']['format']
  # del vlSpec['data']['url']

  # return jsonify({'nl4dv': vlSpec})
  return json.dumps({'nl4dv': 'success'})

@app.route('/chartTable', methods = ['GET', 'POST'])
def chartTable():
  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

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

  actionList = ['transformation']
  if missing > 0:
      actionList.append('missing')
  if outlier > 0:
      actionList.append('outlier')
  if incons > 0:
      actionList.append('inconsistent')

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

  ##### example
  # global inputModelList, inputEvalList
  inputModelList = ['lr', 'knn', 'dt']
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
        if maxEvalList[i] < autoML[inputEvalList[i]][inputModelList[j]]:
          maxEvalList[i] = autoML[inputEvalList[i]][inputModelList[j]]
        evalDict[inputEvalList[i]].append(autoML[inputEvalList[i]][inputModelList[j]])

  # evalDict to make bar chart
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

  if req == '': req = 0
  else: req = ast.literal_eval(req)

  global selectedModelOverviewTable
  selectedModelOverviewTable = req

  with open('static/combinationData.json') as f:
    combinationDict = json.load(f)

  modelName = combinationDict["modelNames"][selectedModelOverviewTable]
  combinationIcon = combinationDict["combinationIconList"][selectedModelOverviewTable]
  combinationDetailIcon = combinationDict["combinationDetailIconList"][selectedModelOverviewTable]

  with open('static/file.json') as f:
    data = json.load(f)

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')
  columnList = list(originDf.columns)
  lastDf = originDf

  stepDfList = []
  for i in range(len(combinationIcon)):
    action = combinationIcon[i]
    actionDetail = combinationDetailIcon[i]

    if action == 'missing':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        if len(missingIndex) > 0:
          if actionDetail == "rem":
            columnDf = columnDf.dropna()
            columnDf = columnDf.to_frame(name = columnList[j])
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
        else:
          columnDf = columnDf

        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
        resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf
    
    if action == 'outlier':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]
        inconsIndex = list(set(missingAndInconsIndex) - set(missingIndex))

        lower, upper = imputation.LowerUpper(columnDf)
        outlierDf = columnDf[(columnDf < lower) | (columnDf > upper)]
        outlierIndex = list(outlierDf.index)

        if len(outlierIndex) > 0:
          if actionDetail == "rem":
            columnDf = columnDf.drop(outlierIndex)
            columnDf = columnDf.to_frame(name = columnList[j])

          else:
            for m in outlierIndex:
              columnDf.loc[m] = np.nan

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
            columnDf.loc[m, columnList[j]] = np.nan

          for m in inconsIndex:
            columnDf.loc[m, columnList[j]] = 'incons'
      
        else:
          columnDf = columnDf
        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
        resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
        resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf

    if action == 'inconsistent':
      resultColumnDf = []

      for j in range(len(columnList)):
        columnDf = lastDf.iloc[:, j]
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        columnDf = pd.to_numeric(columnDf, errors = 'coerce')
        tmpDf = columnDf.to_frame(name = columnList[j])
        missingAndInconsIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

        if len(list(set(missingAndInconsIndex) - set(missingIndex))) > 0:
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

              for m in missingIndex:
                columnDf.loc[m, columnList[j]] = np.nan
        else:
          columnDf = columnDf

        resultColumnDf.append(columnDf)

      resultConcatDf = resultColumnDf[0]
      for j in range(len(resultColumnDf) - 1):
          resultConcatDf = pd.concat([resultConcatDf, resultColumnDf[j + 1]], axis = 1, join = 'inner')
          resultConcatDf = resultConcatDf.reset_index(drop = True)

      lastDf = resultConcatDf

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

    stepDfList.append(lastDf)
  
  ##### example
  # global currentCnt
  #####
  cnt = 0
  for i in range(len(stepDfList)):
    stepDfList[i].to_csv('static/dataset/' + str(cnt) + '.csv', index = False)
    cnt = cnt + 1

  return json.dumps({'selectedModelOverviewTable': 'success'})

@app.route('/lineChart', methods=['GET', 'POST'])
def lineChart():
  # ##### example
  # # global selectedModelOverviewTable, inputModelList, predictName
  # selectedModelOverviewTable = 80
  inputModelList = ['lr', 'knn', 'dt']
  # predictName = 'hue'
  # ##### to fix
  # orderEval = 'MAE'
  # #####

  # fileList = os.listdir('static/dataset')
  # evalResultList = []
  # for i in range(len(fileList) + 1):
  #   evalResultList.append([])

  # with open('static/file.json') as f:
  #   data = json.load(f)

  # originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')
  # ##### to fix
  # originDf = originDf.dropna()
  # #####

  # clf = setup(data = originDf, target = predictName, preprocess = False, session_id = 42, use_gpu = True, silent = True)
  # model = compare_models(include = inputModelList)
  # evalResultDf = pull()

  # for i in range(len(inputModelList)):
  #   modelName = inputModelList[i]
  #   evalResult = evalResultDf.loc[modelName][orderEval]
  #   evalResultList[0].append(evalResult)

  # for i in range(len(fileList)):
  #   df = pd.read_csv('static/dataset/' + fileList[i])
  #   ##### to fix
  #   df = df.dropna()
  #   #####

  #   clf = setup(data = df, target = predictName, preprocess = False, session_id = 42, use_gpu = True, silent = True)
  #   model = compare_models(include = inputModelList)
  #   evalResultDf = pull()

  #   for j in range(len(inputModelList)):
  #     modelName = inputModelList[j]
  #     evalResult = evalResultDf.loc[modelName][orderEval]
  #     evalResultList[i + 1].append(evalResult)

  evalResultList = [[0.1244, 0.1883, 0.1565], [0.1012, 0.0978, 0.1286], [0.1036, 0.0975, 0.1426]]

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
  ##### to fix
  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  response = {}
  response['treeData'] = treeData
  response['treeLength'] = currentCnt
  #####

  return jsonify(response)

@app.route('/modelDetailTable', methods = ['GET', 'POST'])
def modelDetailTable():
  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = originDf.columns.tolist()

  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  ##### to fix
  actionList = ["start", "missing", "outlier", "inconsistent", "normalization"]
  actionDetailList = ["start", "locf", "em", "remove", "standard"]
  #####
  
  # barChart
  barChartList = []
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

  ###### to fix
  for i in range(0, 5):
    barChartList.append({'group': 'data', 'missing': missing, 'outlier': outlier, 'incons': incons})
  #####

  # densityChart
  densityChartList = []
  from sklearn.manifold import TSNE

  dataMatrix = originDf.dropna().reset_index(drop = True).values
  tsneDf = TSNE(n_components = 1, random_state = 0).fit_transform(dataMatrix)
  tsneDf = pd.DataFrame(tsneDf, columns = ['value'])

  mu = tsneDf.mean()
  std = tsneDf.std()
  rv = stats.norm(loc = mu, scale = std)
  normalDf = pd.DataFrame(rv.rvs(size = 5000, random_state = 0))
  densityDf = imputation.densityDf(normalDf, tsneDf)

  for i in range(0, 5):
    densityChartList.append(densityDf.to_dict('records'))

  response = {}
  response['actionList'] = actionList
  response['actionDetailList'] = actionDetailList
  response['barChartList'] = barChartList
  response['densityChartList'] = densityChartList

  return json.dumps(response)

@app.route('/actionDetailBarchart', methods = ['GET', 'POST'])
def actionDetailBarchart():
  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

  for column in originDf:
    if originDf[column].dtype != 'int64' and originDf[column].dtype != 'float64':
      originDf = originDf.drop([column], axis = 1)

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

  response = {}
  response['missing'] = {'data': missing, 'originData': len(originDf) - missing}
  response['outlier'] = {'data': outlier, 'originData': len(originDf) - outlier}
  response['incons'] = {'data': incons, 'originData': len(originDf) - incons}

  return jsonify(response)

@app.route('/heatmapChart', methods = ['GET', 'POST'])
def heatmapChart():
  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

  heatmapDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  columnList = list(heatmapDf.columns)
  heatmapDf, heatmapYList = imputation.heatmapDf(columnList, heatmapDf)
  heatmapList = list(heatmapDf.transpose().to_dict().values())

  response = {}
  response['heatmapList'] = heatmapList
  response['heatmapYList'] = heatmapYList 

  return json.dumps(response)  

@app.route('/histogramChart', methods = ['GET', 'POST'])
def histogramChart():
  req = request.get_data().decode('utf-8')

  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

  histogramDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = list(histogramDf.columns)

  if req == '':
    histogramDf = pd.DataFrame(histogramDf.iloc[:, 0])
  else:
    req = ast.literal_eval(req)

    for i in range(len(columnList)):
      if req['index'] == columnList[i]:
        selectedIndex = i

    histogramDf = pd.DataFrame(histogramDf.iloc[:, selectedIndex])

  histogramDf = histogramDf.dropna()

  minValue = histogramDf.iloc[0][0]
  maxValue = histogramDf.iloc[len(histogramDf) - 1][0]
  size = (maxValue - minValue)/20

  histogramChartList = []
  for i in range(20):
    minRange = minValue + (size * (i))
    maxRange = minValue + (size * (i + 1))
    cnt = 0
    for j in range(len(histogramDf)):
      if histogramDf.iloc[j][0] >= minRange and histogramDf.iloc[j][0] < maxRange:
        cnt = cnt + 1
    histogramChartList.append(cnt)

    response = {}
    response['histogramChartList'] = histogramChartList
    
  return json.dumps(response)

@app.route('/scatterChart', methods = ['GET', 'POST'])
def scatterChart():
  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')

  scatterDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  scatterDf = scatterDf.dropna().reset_index(drop = True)

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
  req = ast.literal_eval(req)

  targetIndex = int(req[0])
  columnIndex = int(req[1])
  actionIndex = int(req[2])

  with open('static/file.json') as f:
    data = json.load(f) 

  originDf = pd.DataFrame(data).apply(pd.to_numeric, errors = 'ignore')
  targetList = ['missing', 'outlier', 'incons']
  columnList = list(originDf.columns)
  actionList = ["remove", "min", "max", "mean", "mode", "median", "em", "locf"]

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

  with open('static/treeData.json') as jsonData:
      treeData = json.load(jsonData)

  root = tree.TreeNode(index = treeData['index'], state = treeData['state'], name = treeData['name'])
  root = root.dict_to_tree(treeData['children'])

  global currentCnt
  newNode = tree.TreeNode(index = str(currentCnt + 1), state = '', name = actionList[actionIndex])
  root.add_child_to(str(currentCnt), newNode)
  root.update_state()
  currentCnt = currentCnt + 1

  treeData = root.tree_to_dict()
  with open('static/treeData.json', 'w') as f:
      json.dump(treeData, f, indent = 4)  

  return json.dumps({'action': 'success'})

if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug = True)