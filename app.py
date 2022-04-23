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
from io import StringIO
from scipy import stats
from collections import Counter

import module.imputation as imputation
import module.tree as tree

app = Flask(__name__)
CORS(app)

fileName = 'wine'
filePath = 'static/' + fileName + '.csv'
originDf = pd.read_csv(filePath, sep = ',')

currentCnt = 6
predictName = 'hue'

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

  global originDf
  originDf = fileUploadDf.reindex(sorted(fileUploadDf.columns), axis = 1)

  return json.dumps({'state': 'success'})

@app.route('/setting', methods=['GET', 'POST'])
def setting():
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

  response = {}
  response['columnList'] = columnList  
  response['modelList'] = modelList
  response['evalList'] = evalList

  return json.dumps(response)

@app.route('/', methods=['GET', 'POST'])
def home():
  global originDf
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  originDf.to_json('static/' + fileName + '.json', orient = 'records', indent = 4)

  response = {}
  response['columnList'] = list(originDf.columns)

  return json.dumps(response)

@app.route('/autoML', methods=['GET', 'POST'])
def autoML():
  # clf = setup(data = originDf.dropna(), target = predictName, preprocess = False, session_id = 42, silent = True)
  # models = compare_models()
  # results = pull()
  # results.to_json('static/modelData.json', orient = 'records', indent = 4)

  return json.dumps({'state': 'success'})

@app.route('/query', methods=['GET', 'POST'])
def query():
  # query = request.get_data().decode('utf-8')

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

  return json.dumps({'state': 'success'})

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

##### to do
@app.route('/modelDetailBarchart', methods = ['GET', 'POST'])
def modelDetailBarchart():

  return json.dumps({'state': 'success'})

@app.route('/treeChart', methods = ['GET', 'POST'])
def treeChart():
  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  response = {}
  response['treeData'] = treeData
  response['treeLength'] = currentCnt

  return jsonify(response)

@app.route('/modelOverviewTable', methods = ['GET', 'POST'])
def modelOverviewTable():
  global originDf, currentCnt
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = originDf.columns.tolist()

  # to fix
  with open('static/treeData.json') as jsonData:
    treeData = json.load(jsonData)

  actionList = ["start", "missing", "outlier", "inconsistent", "normalization"]
  actionDetailList = ["start", "EM", "LOCF", "normalization", "remove", "remove"]
  barChartList = ["barchart0", "barchart1", "barchart2", "barchart3", "barchart4", "barchart5"]
  histogramChartList = ["histogramchart0", "histogramchart1", "histogramchart2", "histogramchart3", "histogramchart4", "histogramchart5"]

  response = {}
  response['actionList'] = actionList
  response['actionDetailList'] = actionDetailList
  response['barChartList'] = barChartList
  response['histogramChartList'] = histogramChartList

  return json.dumps(response)

@app.route('/chartTable', methods = ['GET', 'POST'])
def chartTable():
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnList = originDf.columns.tolist()

  for column in originDf:
    if originDf[column].dtype != 'int64' and originDf[column].dtype != 'float64':
      originDf = originDf.drop([column], axis = 1)

  # missing
  missingList = []
  tmpList = originDf.isnull().sum().values.tolist()

  for i in range(len(tmpList)):
    tmpDict = {}
    tmpDict['data'] = tmpList[i]
    tmpDict['originData'] = len(originDf) - tmpList[i]

    missingList.append(tmpDict)

  # outlier
  tmpList = []
  for column in originDf:
    lower, upper = imputation.LowerUpper(originDf[column])
    data1 = originDf[originDf[column] > upper]
    data2 = originDf[originDf[column] < lower]
    tmpList.append(data1.shape[0] + data2.shape[0])

  outlierList = []
  for i in range(len(tmpList)):
    tmpDict = {}
    tmpDict['data'] = tmpList[i]
    tmpDict['originData'] = len(originDf) - tmpList[i]

    outlierList.append(tmpDict)

  # incons
  tmpList = []
  for column in originDf:
    df = originDf[column].dropna()
    df = pd.DataFrame(pd.to_numeric(df, errors = 'coerce'))
    tmpList.append(df.isnull().sum().values[0].tolist())

  inconsList = []
  for i in range(len(tmpList)):
    tmpDict = {}
    tmpDict['data'] = tmpList[i]
    tmpDict['originData'] = len(originDf) - tmpList[i]

    inconsList.append(tmpDict)

  # quantile
  quantileList = []
  for column in originDf:
    df = originDf[column].dropna()
    quantileList.append(df.tolist())

  # descriptive
  descriptiveList = []
  for column in originDf:
    df = originDf[[column]].dropna()

    # normal distribution
    mu = df.mean()
    std = df.std()
    rv = stats.norm(loc = mu, scale = std)
    normalDf = pd.DataFrame(rv.rvs(size = 5000, random_state = 0))

    densityDf = imputation.densityDf(normalDf, df)
    descriptiveList.append(densityDf.to_dict('records'))

  response = {}
  response['columnList'] = columnList
  response['missingList'] = missingList
  response['outlierList'] = outlierList
  response['inconsList'] = inconsList
  response['quantileList'] = quantileList
  response['descriptiveList'] = descriptiveList

  return json.dumps(response)

@app.route('/histogramChart', methods = ['GET', 'POST'])
def histogramChart():
  global originDf
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  # example - column index 0
  histogramDf = pd.DataFrame(originDf.iloc[:, 0])
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
  changeDf.to_json('static/' + fileName + '.json', orient = 'records', indent = 4)

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

  return json.dumps({'state': 'success'})

if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug = True)
