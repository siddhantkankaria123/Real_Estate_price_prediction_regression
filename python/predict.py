import sys
import json
import pickle
import numpy as np
import warnings

# Suppress sklearn warnings
warnings.filterwarnings("ignore", category=UserWarning)

try:
    # Load model and data columns
    with open("../ml_model/banglore_home_prices_model.pickle", "rb") as f:
        model = pickle.load(f)

    with open("../ml_model/columns.json", "r") as f:
        data_columns = json.load(f)["data_columns"]

    # Parse input JSON
    input_data = json.loads(sys.argv[1])

    location = input_data["location"]
    sqft = float(input_data["sqft"])
    bath = int(input_data["bath"])
    bhk = int(input_data["bhk"])

    # Create input vector
    x = np.zeros(len(data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk

    try:
        loc_index = data_columns.index(location.lower())
        x[loc_index] = 1
    except ValueError:
        pass  # location not found, leave as 0

    # Predict and print result
    prediction = model.predict([x])[0]
    print(round(prediction, 2))  # ✔ This is sent to Node.js

except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
