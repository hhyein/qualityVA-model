import sys
import os
from flask import *
from flask_cors import CORS

import json
import numpy as np
import pandas as pd
from scipy import stats
from nl4dv import NL4DV
from collections import Counter
from pycaret.regression import *
from pycaret.classification import *

import module.imputation as imputation
import module.tree as tree

app = Flask(__name__)
CORS(app)

fileName = 'iris'
filePath = 'static/' + fileName + '.csv'
className = 'Species'
predictName = 'None'

currentCnt = 0

@app.route('/', methods=['GET', 'POST'])
def home():
  originDf = pd.read_csv(filePath, sep = ',')
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  originDf = originDf.dropna()

  response = {}
  response['fileName'] = fileName
  response['className'] = className

  if className == 'None':
    clf = setup(data = originDf, target = predictName, preprocess = False, session_id = 42, silent = True)
    models = compare_models()
    results = pull()
    print(results)

    classList = []
    modelList = list(results['Model'].values)
    maeList = list(results['MAE'].values)
    mseList = list(results['MSE'].values)
    rmseList = list(results['RMSE'].values)

    response['classList'] = classList
    response['modelList'] = modelList
    response['output1List'] = maeList
    response['output2List'] = mseList
    response['output3List'] = rmseList

    return json.dumps(response)

  else:
    clf = setup(data = originDf, target = className, preprocess = False, session_id = 42, silent = True)
    models = compare_models()
    results = pull()
    print(results)

    classList = list(set(originDf[className].values.tolist()))
    modelList = list(results['Model'].values)
    accList = list(results['Accuracy'].values)
    aucList = list(results['AUC'].values)
    recallList = list(results['Recall'].values)

    response['classList'] = classList
    response['modelList'] = modelList
    response['output1List'] = accList
    response['output2List'] = aucList
    response['output3List'] = recallList

    return json.dumps(response)

@app.route('/query', methods=['GET', 'POST'])
def query():
  query = request.get_data().decode('utf-8')
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  nl4dvDf = originDf.dropna()
  nl4dvDf = nl4dvDf.to_dict('records')
  nl4dvInstance = NL4DV(data_url = os.path.join(filePath))
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
  vlSpec['data']['values'] = nl4dvDf

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

@app.route('/barchart', methods = ['GET', 'POST'])
def barchart():
  originDf = pd.read_csv(filePath)

  if className == 'None':
    classDict = {}
  
  else:
    classList = originDf[className].values.tolist()
    classDict = Counter(classList)
    classDict['group'] = 'class'

  return jsonify(classDict)

@app.route('/charttable', methods = ['GET', 'POST'])
def charttable():
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  if className == 'None':
    columnList = originDf.columns.tolist()

  else:
    columnList = originDf.columns.tolist()
    columnList.remove(className)

  for column in originDf:
    if originDf[column].dtype != 'int64' and originDf[column].dtype != 'float64':
      originDf = originDf.drop([column], axis = 1)

  # missing      
  missingList = originDf.isnull().sum().values.tolist()
  
  # outlier
  outlierList = []
  for column in originDf:
    lower, upper = imputation.LowerUpper(originDf[column])
    data1 = originDf[originDf[column] > upper]
    data2 = originDf[originDf[column] < lower]
    outlierList.append(data1.shape[0] + data2.shape[0])

  # incons
  inconsList = []
  for column in originDf:
    df = originDf[column].dropna()
    df = pd.DataFrame(pd.to_numeric(df, errors = 'coerce'))
    inconsList.append(df.isnull().sum().values[0].tolist())

  # quantile
  quantileList = []
  for column in originDf:
    df = originDf[column].dropna()
    quantileList.append(df.tolist())

  # descriptive
  descriptiveList = []
  for column in originDf:
    df = originDf[[column]].dropna()
    descriptiveList.append(df.to_dict('records'))

  response = {}
  response['columnList'] = columnList
  response['missingList'] = missingList
  response['outlierList'] = outlierList
  response['inconsList'] = inconsList
  response['quantileList'] = quantileList
  response['descriptiveList'] = descriptiveList

  return json.dumps(response)

@app.route('/histogramchart1', methods = ['GET', 'POST'])
def histogramchart1():
  data = request.get_data().decode('utf-8')

  rowHistogramchart1 = eval(data)['row']
  colHistogramchart1 = eval(data)['col']

  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  df = pd.DataFrame(originDf.iloc[:, rowHistogramchart1])
  column = originDf.columns.tolist()[rowHistogramchart1]

  df = df.sort_values(by = [column])
  df = df.reset_index(drop = True).dropna()

  minValue = df.iloc[0][0]
  maxValue = df.iloc[len(df) - 1][0]
  size = (maxValue - minValue)/20

  dfList = []
  for i in range(20):
    minRange = minValue + (size * (i))
    maxRange = minValue + (size * (i + 1))
    cnt = 0
    for j in range(len(df)):
      if df.iloc[j][0] >= minRange and df.iloc[j][0] < maxRange:
        cnt = cnt + 1
    dfList.append(cnt)

    lower, upper = imputation.LowerUpper(df)

    response = {}
    response['dfList'] = dfList
    response['lower'] = [lower]
    response['upper'] = [upper]

  return json.dumps(response)

@app.route('/ECDFchart', methods = ['GET', 'POST'])
def ECDFchart():
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  columnName = 'SL'

  ecdfDf = originDf[columnName].dropna()
  ecdfDf_current = imputation.ecdfDf(ecdfDf, 'kstest2')

  mu = ecdfDf.mean()
  std = ecdfDf.std()

  rv = stats.norm(loc = mu, scale = std)
  x = rv.rvs(size = 5000, random_state = 0)
  ecdfDf_normal = imputation.ecdfDf(x, 'kstest1')

  ecdfDf = pd.concat([ecdfDf_normal, ecdfDf_current])
  ecdfList = list(ecdfDf.transpose().to_dict().values())

  return jsonify(ecdfList)

@app.route('/scatterchart', methods = ['GET', 'POST'])
def scatterchart():
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)

  df = originDf.dropna().reset_index(drop = True)
  if className == 'None':
    dataDf = df

    from sklearn.manifold import TSNE
    dataMatrix = dataDf.values
    tsneDf = TSNE(n_components = 2, random_state = 0).fit_transform(dataMatrix)
    tsneDf = pd.DataFrame(tsneDf, columns = ['value1', 'value2'])

    from sklearn.decomposition import PCA
    pcaDf = PCA(n_components = 2, random_state = 0).fit_transform(dataMatrix)
    pcaDf = pd.DataFrame(pcaDf, columns = ['value1', 'value2'])

  else:
    classDf = df[[className]]
    dataDf = df.drop([className], axis = 1)

    from sklearn.manifold import TSNE
    dataMatrix = dataDf.values
    tsneDf = TSNE(n_components = 2, random_state = 0).fit_transform(dataMatrix)
    tsneDf = pd.DataFrame(tsneDf, columns = ['value1', 'value2']).assign(className = classDf)

    from sklearn.decomposition import PCA
    pcaDf = PCA(n_components = 2, random_state = 0).fit_transform(dataMatrix)
    pcaDf = pd.DataFrame(pcaDf, columns = ['value1', 'value2']).assign(className = classDf)

  response = {}
  response['tsneDict'] = list(tsneDf.transpose().to_dict().values())
  response['pcaDict'] = list(pcaDf.transpose().to_dict().values())

  return json.dumps(response)

@app.route('/correlationchart', methods = ['GET', 'POST'])
def correlationchart():
  originDf = pd.read_csv(filePath)
  originDf = originDf.reindex(sorted(originDf.columns), axis = 1)
  corr = originDf.corr(method = 'pearson')
  corr = corr.applymap(str).transpose().to_dict()

  return jsonify(corr)

@app.route('/action', methods=['GET', 'POST'])
def action():
  actionIndex = int(request.get_data().decode('utf-8'))
  columnIndex = 0
  target = 'missing'

  originDf = pd.read_csv(filePath)
  columnList = list(originDf.columns)
  actionList = ["remove", "min", "max", "mean", "mode", "median", "em", "locf"]

  actionDf = originDf.iloc[:, columnIndex]
  remainDf = originDf.drop([columnList[columnIndex]], axis = 1)

  tmpDf = actionDf.to_frame(name = columnList[columnIndex])
  missingIndex = [index for index, row in tmpDf.iterrows() if row.isnull().any()]

  if target == 'missing':
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

  if target == 'outlier':
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

  if target == 'incons':
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
  newNode = tree.TreeNode(index = str(currentCnt + 1), state = '', name = 'locf')
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
