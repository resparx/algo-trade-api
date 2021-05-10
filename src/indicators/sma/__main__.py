# import dependencies
import pandas as pd
import numpy as np
import sys

# importing an indicator class
from technical_indicators_lib import SMA

arr = sys.argv[1].split(',')
data = np.array(arr)
floatdata = data.astype(float)
ser = pd.Series(floatdata)

sma = SMA()
result = sma.get_value_list(ser, int(sys.argv[2])).tolist()
strResult = ", ".join([str(i) for i in result])
print(strResult)

