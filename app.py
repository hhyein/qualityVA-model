import sys
import os
from flask import *
from flask_cors import CORS

import ast
import csv
import json
import codecs
import numpy as np
import pandas as pd
# from nl4dv import NL4DV
from io import StringIO
from scipy import stats
from collections import Counter

import module.imputation as imputation
import module.tree as tree

app = Flask(__name__)
CORS(app)

originDf = pd.DataFrame()
fileUploadState = False
currentCnt = 6
predictName = 'hue'
inputModelList = ['Logistic Regression']
inputEvalList = ['Accuracy', 'AUC', 'Recall']

@app.route('/', methods=['GET', 'POST'])
def home():
  global originDf

  response = {}
  response['columnList'] = list(originDf.columns)

  return json.dumps(response)

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

  global originDf, fileUploadState
  originDf = fileUploadDf.reindex(sorted(fileUploadDf.columns), axis = 1)
  originDf.to_json('static/file.json', orient = 'records', indent = 4)
  fileUploadState = True

  return json.dumps({'fileUpload': 'success'})

@app.route('/setting', methods=['GET', 'POST'])
def setting():
  if fileUploadState == True:
    with open('static/file.json', 'r', encoding = 'utf-8') as f:
      data = json.load(f) 

    originDf = pd.DataFrame(data)

    columnList = []
    tmpList = list(originDf.columns)
    for i in range(len(tmpList)):
      columnList.append({'label': tmpList[i], 'value': i})

    modelList = []
    tmpList = ['lr', 'knn', 'nb', 'dt', 'svm', 'rbfsvm', 'gpc', 'mlp', 'ridge', 'rf',
                'qda', 'ada', 'gbc', 'lda', 'et', 'xgboost', 'lightgbm', 'catboost']
    for i in range(len(tmpList)):
      modelList.append({'label': tmpList[i], 'value': i})

    evalList = []
    tmpList = ['Accuracy', 'AUC', 'Recall', 'Precision', 'F1', 'Kappa', 'MCC', 'TT']
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

@app.route('/query', methods=['GET', 'POST'])
def query():
  query = request.get_data().decode('utf-8')

  # global originDf
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

@app.route('/lineChart', methods=['GET', 'POST'])
def lineChart():
  # clf = setup(data = originDf.dropna(), target = predictName, preprocess = False, session_id = 42, silent = True)
  # models = compare_models()
  # results = pull()
  # results.to_json('static/modelData.json', orient = 'records', indent = 4)

  return json.dumps({'lineChart': 'success'})

@app.route('/treeChart', methods = ['GET', 'POST'])
def treeChart():
  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  response = {}
  response['treeData'] = treeData
  response['treeLength'] = currentCnt

  return jsonify(response)

# autoML
@app.route('/chartTable', methods = ['GET', 'POST'])
def chartTable():
  # global inputModelList, inputEvalList
  # combinationList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  # # have to develop - combination
  # with open('static/modelData.json') as data:
  #   data = json.load(data)
  # autoMLDf = pd.DataFrame.from_dict(data)

  # modelList = autoMLDf['Model'].values.tolist()
  # modelIndex = []
  # for i in inputModelList:
  #   modelIndex.append(modelList.index(i))

  # evalList = ['Accuracy', 'AUC', 'Recall', 'Prec.', 'F1', 'Kappa', 'MCC', 'TT (Sec)']
  # evalIndex = []
  # for i in inputEvalList:
  #   evalIndex.append(evalList.index(i) + 1)

  # resultList = []
  # for i in evalIndex:
  #   tmpList = []
  #   for j in modelIndex:
  #     tmpList.append(autoMLDf.iloc[j][i])
  #   resultList.append(tmpList[0])

  # response = {}
  # response['combinationList'] = combinationList
  # response['inputModelList'] = inputModelList
  # response['inputEvalList'] = inputEvalList

  # for i in range(len(inputEvalList)):
  #   tmpList = []
  #   for j in range(len(combinationList)):
  #     data = resultList[i]
  #     originData = 1.0 - resultList[i]

  #     tmpList.append({'data': data, 'originData': originData})
  #   response[inputEvalList[i]] = tmpList

  response = {'combinationList': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 'inputModelList': ['Logistic Regression'], 'inputEvalList': ['Accuracy', 'AUC', 'Recall'], 'Accuracy': [{'data': 0.9553, 'originData': 0.04469999999999996}, {'data': 0.9, 'originData': 0.1}, {'data': 0.8, 'originData': 0.2}, {'data': 0.95, 'originData': 0.05}, {'data': 0.7, 'originData': 0.3}, {'data': 0.75, 'originData': 0.25}, {'data': 0.95, 'originData': 0.05}, {'data': 0.77, 'originData': 0.23}, {'data': 0.9553, 'originData': 0.04469999999999996}, {'data': 0.95, 'originData': 0.05}], 'AUC': [{'data': 0.9, 'originData': 0.1}, {'data': 0.6, 'originData': 0.4}, {'data': 0.8, 'originData': 0.2}, {'data': 0.95, 'originData': 0.05}, {'data': 0.7, 'originData': 0.3}, {'data': 0.75, 'originData': 0.25}, {'data': 0.95, 'originData': 0.05}, {'data': 0.77, 'originData': 0.23}, {'data': 0.9553, 'originData': 0.04469999999999996}, {'data': 0.95, 'originData': 0.05}], 'Recall': [{'data': 0.9553, 'originData': 0.04469999999999996}, {'data': 0.9, 'originData': 0.1}, {'data': 0.8, 'originData': 0.2}, {'data': 0.95, 'originData': 0.05}, {'data': 0.7, 'originData': 0.3}, {'data': 0.75, 'originData': 0.25}, {'data': 0.95, 'originData': 0.05}, {'data': 0.77, 'originData': 0.23}, {'data': 0.9553, 'originData': 0.04469999999999996}, {'data': 0.95, 'originData': 0.05}]}

  return json.dumps(response)

@app.route('/modelDetailTable', methods = ['GET', 'POST'])
def modelDetailTable():
  global originDf, currentCnt
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = originDf.columns.tolist()

  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  # to fix
  actionList = ["start", "missing", "outlier", "inconsistent", "normalization"]
  actionDetailList = ["start", "locf", "em", "remove", "standard"]
  
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

  for i in range(0, 5):
    barChartList.append({'group': 'data', 'missing': missing, 'outlier': outlier, 'incons': incons})

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

@app.route('/selectedModelOverviewTable', methods=['GET', 'POST'])
def selectedModelOverviewTable():
  req = request.get_data().decode('utf-8')
  print(req)  

  return json.dumps({'selectedModelOverviewTable': 'success'})

@app.route('/actionDetailBarchart', methods = ['GET', 'POST'])
def actionDetailBarchart():
  global originDf
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
  global originDf
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

  global originDf
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
  global originDf
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

  originDf = pd.read_csv(filePath)
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
  
  changeDf.to_csv(filePath, index = False)
  changeDf.to_json('static/file.json', orient = 'records', indent = 4)

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