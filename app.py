import sys
import os
from flask import *
from flask_cors import CORS

import json
import numpy as np
import pandas as pd
from collections import Counter

import module.imputation as imputation

app = Flask(__name__)
CORS(app)

@app.route('/barchart2', methods = ['GET', 'POST'])
def barchart2():
  originDf = pd.read_csv('static/iris.csv')
  classColumn = 'Species'

  classList = originDf[classColumn].values.tolist()
  classDict = Counter(classList)
  classDict['group'] = 'class'

  return jsonify(classDict)

@app.route('/charttable', methods = ['GET', 'POST'])
def charttable():
  originDf = pd.read_csv('static/iris.csv')
  classColumn = 'Species'

  columnList = originDf.columns.tolist()
  columnList.remove(classColumn)

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

  response = {}
  response['columnList'] = columnList
  response['missingList'] = missingList
  response['outlierList'] = outlierList
  response['inconsList'] = inconsList

  return json.dumps(response)

@app.route('/histogram1', methods = ['GET', 'POST'])
def histogram1():
  data = request.get_data().decode('utf-8')

  rowHistogram1 = eval(data)['row']
  colHistogram1 = eval(data)['col']

  originDf = pd.read_csv('static/iris.csv')
  df = pd.DataFrame(originDf.iloc[:, rowHistogram1])
  column = originDf.columns.tolist()[rowHistogram1]

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



if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug = True)
