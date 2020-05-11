"""
This is the predict_sale module and supports all the ReST actions for the
predict_sale
"""

# 3rd party modules
from flask import make_response, abort
import pickle
import numpy as np



def predictSaleFunc(prediction_data):
	"""
     This function responds to request for /api/predict_sale
     to predict sale for third month
     return: json string for sale of third month
	"""
	model = pickle.load(open('model.pkl', 'rb'))
	sale1 = float(prediction_data.get("sale1", None))
	sale2 = float(prediction_data.get("sale2", None))
	rate = float(prediction_data.get("rate", None))
	int_features = [sale1, sale2, rate]
	final_features = [np.array(int_features)]
	prediction = model.predict(final_features)
	output = round(prediction[0], 2)        
	predicted_data = {
	"sale3": output
	}
	return predicted_data, 200