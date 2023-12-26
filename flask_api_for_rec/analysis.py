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
mycol = mydb["orders"]

# myquery = { "address": "Park Lane 38" }

mydoc = mycol.find()
df_mongo = pd.DataFrame(mydoc)
#%% Extract number of times a customer ordered a product

df_mongo.describe()

# Assuming your DataFrame is named df_mongo
df_mongo['orderdate(DateOrders)'] = pd.to_datetime(df_mongo['orderdate(DateOrders)'])
df_mongo['month'] = df_mongo['orderdate(DateOrders)'].dt.to_period('M')

# Group by month and sum the 'Total' column
monthly_sum = df_mongo.groupby('month')['Total'].sum().reset_index(name='Monthly_Total')

# Convert 'month' to string
monthly_sum['month'] = monthly_sum['month'].astype(str)

# Display the result
print(monthly_sum)

# Insert into MongoDB
collection_name_monthly_sum = "MonthlyTotal"
collection_monthly_sum = mydb[collection_name_monthly_sum]
records_monthly_sum = monthly_sum.to_dict(orient='records')

collection_monthly_sum.insert_many(records_monthly_sum)

# Assuming your DataFrame is named df_mongo
df_mongo['orderdate(DateOrders)'] = pd.to_datetime(df_mongo['orderdate(DateOrders)'])
df_mongo['year'] = df_mongo['orderdate(DateOrders)'].dt.to_period('Y')

# Group by year and sum the 'Total' column
yearly_sum = df_mongo.groupby('year')['Total'].sum().reset_index(name='Yearly_Total')

# Convert 'year' to string
yearly_sum['year'] = yearly_sum['year'].astype(str)

# Display the result
print(yearly_sum)

# Insert into MongoDB
collection_name_yearly = "YearlyTotal"
collection_yearly = mydb[collection_name_yearly]
records_yearly_sum = yearly_sum.to_dict(orient='records')

collection_yearly.insert_many(records_yearly_sum)

# Assuming your DataFrame is named df_mongo
order_status_counts_by_month = df_mongo.groupby(['month', 'OrderStatus']).size().unstack(fill_value=0)

# Convert the DataFrame to have 'month' as a column
df_order_status_counts_by_month = order_status_counts_by_month.reset_index()

# Convert 'month' to string
df_order_status_counts_by_month['month'] = df_order_status_counts_by_month['month'].astype(str)

# Display the result
print(df_order_status_counts_by_month)

# Insert into MongoDB
collection_name_status = "OrderStatusByMonth"
collection_status = mydb[collection_name_status]
records_order_status_by_month = df_order_status_counts_by_month.to_dict(orient='records')

collection_status.insert_many(records_order_status_by_month)

# Assuming your DataFrame is named df_mongo
order_status_counts_by_year = df_mongo.groupby(['year', 'OrderStatus']).size().unstack(fill_value=0)

# Convert the DataFrame to have 'year' as a column
df_order_status_counts_by_year = order_status_counts_by_year.reset_index()

# Convert 'year' to string
df_order_status_counts_by_year['year'] = df_order_status_counts_by_year['year'].astype(str)

# Display the result
print(df_order_status_counts_by_year)

# Insert into MongoDB
collection_name_status = "OrderStatusByYear"
collection_status = mydb[collection_name_status]
records_order_status_by_year = df_order_status_counts_by_year.to_dict(orient='records')

collection_status.insert_many(records_order_status_by_year)

# Calculate average Daysforshipping(real) monthly
average_days_monthly = df_mongo.groupby('month')['Daysforshipping(real)'].mean().reset_index(name='Average_Days_Monthly')

# Convert 'month' and 'year' to string
average_days_monthly['month'] = average_days_monthly['month'].astype(str)

# Display the result
print(average_days_monthly)

# Insert into MongoDB
collection_name_status = "AverageDayforshippingByMonth"
collection_status = mydb[collection_name_status]
records_average_days_monthly = average_days_monthly.to_dict(orient='records')

collection_status.insert_many(records_average_days_monthly)

# Calculate average Daysforshipping(real) yearly
average_days_yearly = df_mongo.groupby('year')['Daysforshipping(real)'].mean().reset_index(name='Average_Days_Yearly')

# Convert 'year' and 'year' to string
average_days_yearly['year'] = average_days_yearly['year'].astype(str)

# Display the result
print(average_days_yearly)

# Insert into MongoDB
collection_name_status = "AverageDayforshippingByYear"
collection_status = mydb[collection_name_status]
records_average_days_yearly = average_days_yearly.to_dict(orient='records')

collection_status.insert_many(records_average_days_yearly)

# Assuming your DataFrame is named df_mongo
order_id_count_by_month = df_mongo.groupby('month')['OrderId'].nunique()

# Convert the Series to a DataFrame
df_number_of_orders_monthly = order_id_count_by_month.reset_index(name='Number_of_Orders')

# Convert 'month' to string
df_number_of_orders_monthly['month'] = df_number_of_orders_monthly['month'].astype(str)

# Display the result
print(df_number_of_orders_monthly)

# Insert into MongoDB
collection_name_monthly = "NumberofOrderByMonth"
collection_monthly = mydb[collection_name_monthly]
records_number_of_orders_monthly = df_number_of_orders_monthly.to_dict(orient='records')

collection_monthly.insert_many(records_number_of_orders_monthly)

# Assuming your DataFrame is named df_mongo
order_id_count_by_year = df_mongo.groupby('year')['OrderId'].nunique()

# Convert the Series to a DataFrame
df_number_of_orders = order_id_count_by_year.reset_index(name='Number_of_Orders')

# Convert 'year' to string
df_number_of_orders['year'] = df_number_of_orders['year'].astype(str)

# Display the result
print(df_number_of_orders)

# Insert into MongoDB
collection_name = "NumberofOrderByYear"
collection = mydb[collection_name]
records_number_of_orders = df_number_of_orders.to_dict(orient='records')

collection.insert_many(records_number_of_orders)