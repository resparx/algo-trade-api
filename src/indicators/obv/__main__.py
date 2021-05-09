# import dependencies
import pandas as pd
import numpy as np
import sys

# importing an indicator class
from technical_indicators_lib import OBV

print("Output from Python")
print("First name: " + sys.argv[1])
print("Last name: " + sys.argv[2])

# instantiate the class
# obv = OBV()

# load data into a dataframe df
# df = pd.read_csv("./test/data/test_data.csv")

# Method 1: get the data by sending a dataframe
# df = obv.get_value_df(df)


# Method 2: get the data by sending series values
# obv_values = obv.get_value_list(df["close"], df["volume"])