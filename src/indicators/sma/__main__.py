# import dependencies
import pandas as pd
import numpy as np
import sys

# importing an indicator class
from technical_indicators_lib import SMA

data = np.array(int(sys.argv[1]))
ser = pd.Series(data)

sma = SMA()

result = sma.get_value_list(ser, int(sys.argv[2]))

print(result)

