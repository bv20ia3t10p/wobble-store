from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
#%%
uri = "mongodb+srv://hasuras3:TrPhuc203@cluster0.vb10svk.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
#%%
mydb = client["wobble"]
mycol = mydb["order_details"]

# myquery = { "address": "Park Lane 38" }

mydoc = mycol.find()
df_mongo = pd.DataFrame(mydoc)
#%% Extract number of times a customer ordered a product

times_product_ordered_by_customer= df_mongo[['ProductCardId','CustomerId','OrderItemId']].groupby(['ProductCardId','CustomerId']).count().reset_index()
times_utility_matrix = times_product_ordered_by_customer.pivot_table(values='OrderItemId',index='CustomerId',columns='ProductCardId',fill_value = 0)

#%%
times_utility_matrix.shape
# (20562,118)
#%% Transposing
X = times_utility_matrix.T
X.head()
X.shape
X1 = X
#%% Get correlation matrix from data
SVD = TruncatedSVD(n_components=10)
decomposed_matrix = SVD.fit_transform(X)
decomposed_matrix.shape
correlation_matrix = np.corrcoef(decomposed_matrix)
correlation_matrix.shape

#%% Single product recommendation
def recommendProductForId(i):
    product_names = list(X.index)
    product_index = product_names.index(i)
    print(product_index)
    X.index[117]
    correlation_product_index = correlation_matrix[product_index]
    correlation_product_index.shape
    df_temp = pd.DataFrame([correlation_product_index],
                        columns=product_names).transpose().reset_index()
    df_temp.columns = ['ProductCardId','Corr']
    df_temp = df_temp[df_temp['ProductCardId']!=i].sort_values(by='Corr',ascending=False)
    return df_temp
#%% Multiple product recommendation
def recommendProductForMultipleIds(arr):
    product_indexes=list()
    correlation_product_indexes = []
    product_names = list(X.index)
    for i in arr:
        product_index = product_names.index(i)
        print(product_index)
        product_indexes.append(product_index)
        correlation_product_indexes.append(correlation_matrix[product_index].flatten())
    correlation_product_indexes_np = np.array(correlation_product_indexes).reshape(len(arr),-1).mean(axis=0)
    df_temp = pd.DataFrame([correlation_product_indexes_np],
                           columns=product_names).transpose().reset_index()
    df_temp.columns = ['ProductCardId','Corr']
    for i in arr:
        df_temp = df_temp[df_temp['ProductCardId']!= i]
    df_temp = df_temp.sort_values(by='Corr',ascending=False)
    return df_temp
#%% Query for products

df_products = pd.DataFrame(mydb['products'].find())
#%% Test functions
test_result = recommendProductForId(1360)
test_result_multiple = recommendProductForMultipleIds([1360,1361,1362])
#%% Order products by result
df_test_result = test_result.merge(df_products,'left').drop(['Corr'],axis=1)
#%% Flask API
from flask import Flask, request 
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
  
@app.route('/mlApi/ProductRec/<int:i>', methods = ['GET']) 
@cross_origin()
def apiForRecommendBySingleItem(i): 
    
    singleRecs = recommendProductForId(i).merge(df_products,'left').drop(['_id','Corr'],axis=1)
    singleRecs.columns = [ temp[0].lower() + temp[1:] for temp in singleRecs.columns]
    return singleRecs.to_dict(orient='records')
  
@app.route('/mlApi/ProductRec', methods=['POST'])
@cross_origin()
def apiForRecommendByMultipleItems():
    print(request.form.getlist('items'))
    items = request.get_json()
    print(items)
    multiRecs = recommendProductForMultipleIds(items).merge(df_products,'left').drop(['_id','Corr'],axis=1)
    multiRecs.columns = [ temp[0].lower() + temp[1:] for temp in multiRecs.columns]
    return multiRecs.to_dict(orient='records')
# driver function 
if __name__ == '__main__': 
    app.run(debug=False)

