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

req = {"column":{"label":"alcohol","value":1},"model":[{"label":"nb","value":2}],"eval":[{"label":"Precision","value":3}],"dimension":{"label":"PCA","value":1}}

print(len(req))