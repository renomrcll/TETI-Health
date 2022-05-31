import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import svm
from sklearn.metrics import classification_report, confusion_matrix, f1_score, jaccard_score
from imblearn.over_sampling import SMOTE
from collections import Counter
from flask import Flask, jsonify, request, abort
from flask_cors import CORS, cross_origin
from flask_restx import fields, Resource, Api, reqparse
from config import config
import json
import time

app = Flask(__name__)
api = Api(app=app,
          version='1.0',
          title='TETI-Health',
          description='Retrieve data for TETI-Health Website')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@api.route('/')
class Index(Resource):
    @cross_origin()
    def get(self):
        return jsonify({'message': 'Hello world!!!'})
    
def machine_learning(q1,q2,q3,q4,q5,q6,q7):
    results = {}
    results['class'] = ''
    results['advice'] = []
    df = pd.read_json('data/Dataset.json') # nanti path nya nyesuain
    print(df.head())
    print()

    print(df['Class'].value_counts())
    print()

    x = df.loc[:, df.columns != 'Class']
    print('x')
    print(x)
    print()
    y = df['Class']
    print('y')
    print(y)
    print()
        
    seed = 100
    k = 1
    sm = SMOTE(sampling_strategy='auto', k_neighbors=k, random_state=seed)
    x_res, y_res = sm.fit_resample(x, y)

    print('y :', Counter(y))
    print('y_res :', Counter(y_res))
    print()

    x_train, x_test, y_train, y_test = train_test_split(x_res, y_res, test_size=0.2, random_state=4)
    print ('Train set :', x_train.shape, y_train.shape)
    print ('Test set :', x_test.shape, y_test.shape)
    print()

    clf = svm.SVC(kernel='rbf', gamma='auto')
    clf.fit(x_train, y_train)

    prediction = clf.predict(x_test)
    print('Prediction Test')
    print(prediction[0:5])
    print()

    print('Classification Report')
    print(classification_report(y_test, prediction))
    print()

    print("F1 Score :",f1_score(y_test, prediction, average='weighted'))
    print("Jaccard Score :",jaccard_score(y_test, prediction, average='macro'))
    print()
        
    # Predict stress class
    data = np.asarray([[q1,q2,q3,q4,q5,q6,q7]])
        
    prediction = clf.predict(data)
    print('Prediction :', prediction[0])

    if prediction[0] == 0:
        results['class'] = 'Normal'
        # Fungsi narik data advice dari cloud untuk tipe Normal
        # results['advices'] = list data advice
    elif prediction[0] == 1:
        results['class'] = 'Mild'
        # Fungsi narik data advice dari cloud untuk tipe Mild
        # results['advices'] = list data advice
    elif prediction[0] == 2:
        results['class'] = 'Moderate'
        # Fungsi narik data advice dari cloud untuk tipe Moderate
        # results['advices'] = list data advice
    elif prediction[0] == 3:
        results['class'] = 'Severe'
        # Fungsi narik data advice dari cloud untuk tipe Severe
        # results['advices'] = list data advice
    elif prediction[0] == 4:
        results['class'] = 'Extremely Severe'
        # Fungsi narik data advice dari cloud untuk tipe Extremely Severe
        # results['advices'] = list data advice

    print('Prediction of Class :', results['class'])
    print()

    # Add new data to dataset
    df.loc[1+len(df)] = [q1,q2,q3,q4,q5,q6,q7,prediction[0]]
    print(df)
    print()

    print(df['Class'].value_counts())
    print()

    print("Length of Dataframe :",len(df))
    print()

    df.to_json(r'data/Dataset.json') # nanti path nya nyesuain
    
    return results

api_namespace = api.namespace(
    'api', description='To request data')

@api_namespace.route('/stress-detection', methods=['GET'])
class StressDetection(Resource):
    @api_namespace.doc(responses={200: 'OK', 400: 'Invalid Argument', 500: 'Mapping Key Error'}, params={'Q1': {'description': 'Answer value for question 1', 'type': 'int', 'required': False}, 'Q2': {'description': 'Answer value for question 2', 'type': 'int', 'required': False}, 'Q3': {'description': 'Answer value for question 3', 'type': 'int', 'required': False}, 'Q4': {'description': 'Answer value for question 4', 'type': 'int', 'required': False}, 'Q5': {'description': 'Answer value for question 5', 'type': 'int', 'required': False}, 'Q6': {'description': 'Answer value for question 6', 'type': 'int', 'required': False}, 'Q7': {'description': 'Answer value for question 7', 'type': 'int', 'required': False}})
    @cross_origin() 
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Q1', required=False, default=None)
        parser.add_argument('Q2', required=False, default=None)
        parser.add_argument('Q3', required=False, default=None)
        parser.add_argument('Q4', required=False, default=None)
        parser.add_argument('Q5', required=False, default=None)
        parser.add_argument('Q6', required=False, default=None)
        parser.add_argument('Q7', required=False, default=None)

        args = parser.parse_args()
        Q1 = args['Q1'] or None
        Q2 = args['Q2'] or None
        Q3 = args['Q3'] or None
        Q4 = args['Q4'] or None
        Q5 = args['Q5'] or None
        Q6 = args['Q6'] or None
        Q7 = args['Q7'] or None
        
        # Machine Learning
        start = time.time()
        results = machine_learning(Q1, Q2, Q3, Q4, Q5, Q6, Q7)
        end = time.time()
        total_time = end - start
        print("Time Execution :", str(total_time))
        print()

        return jsonify(results) 

if __name__ == '__main__':
    app.secret_key = 'TETI-Health'
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)