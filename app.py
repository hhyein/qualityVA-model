import sys
import os

import numpy as np
import pandas as pd
import json
from flask import *
from flask_cors import CORS

DATASET = ""

app = Flask(__name__)
if __name__ == '__main__':
  app.jinja_env.auto_reload = True
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.run(debug=True)
CORS(app)