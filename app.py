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

import module.imputation as imputation

app = Flask(__name__)
CORS(app)

fileName = 'iris'
filePath = 'static/' + fileName + '.csv'

className = 'Species'

@app.route('/', methods=['GET', 'POST'])
def home():
  originData = pd.read_csv(filePath, sep = ',')
  originData.to_json('static/' + fileName + '.json', orient = 'records', indent = 4)

  originDf = pd.read_csv(filePath)
  classList = list(set(originDf[className].values.tolist()))

  response = {}
  response['className'] = className
  response['classList'] = classList

  return json.dumps(response)

@app.route('/query', methods=['GET', 'POST'])
def query():
  query = request.get_data().decode('utf-8')
  originDf = pd.read_csv(filePath)

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

  return jsonify({'nl4dv': vlSpec})

@app.route('/barchart2', methods = ['GET', 'POST'])
def barchart2():
  originDf = pd.read_csv(filePath)

  classList = originDf[className].values.tolist()
  classDict = Counter(classList)
  classDict['group'] = 'class'

  return jsonify(classDict)

@app.route('/charttable', methods = ['GET', 'POST'])
def charttable():
  originDf = pd.read_csv(filePath)

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

    # outlier
    lower, upper = imputation.LowerUpper(df)

    response = {}
    response['dfList'] = dfList
    response['lower'] = [lower]
    response['upper'] = [upper]

  return json.dumps(response)

@app.route('/ECDFchart', methods = ['GET', 'POST'])
def ECDFchart():
  originDf = pd.read_csv(filePath)
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

  df = originDf.dropna().reset_index(drop = True)
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
  corr = originDf.corr(method = 'pearson')
  corr = corr.applymap(str).transpose().to_dict()

  return jsonify(corr)

if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug = True)
