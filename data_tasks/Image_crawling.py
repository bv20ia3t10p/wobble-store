# -*- coding: utf-8 -*-
"""
Created on Sat Sep 23 16:29:21 2023

@author: beave
"""

import pandas as pd
import os
#%%
df2 = pd.read_csv('D:/Code/IE104-retailer-web-project/DescriptionDataCoSupplyChain.csv',encoding='latin1')
#%%
df2_items = df2[['Product Card Id','Product Category Id','Product Description','Product Image','Product Name','Product Price'
           ,'Product Status']].drop_duplicates(subset=['Product Card Id'],keep='first')
import urllib
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
driver = webdriver.Chrome()
result = []
os.chdir('G:/Data/DataCo/Crawled Images')
for i in df2_items[['Product Card Id','Product Name']].values:
    driver.get("https://image.google.com")
    sleep(3)
    search_bar = None
    while search_bar is None:
        try:
            search_bar = driver.find_element(By.CSS_SELECTOR,'#APjFqb')
            search_bar.send_keys(str(i[1]))
        except:
            driver.get("https://image.google.com")
            sleep(3)
    sleep(1)
    search_bar.send_keys('\n')
    sleep(2)
    search_results = driver.find_elements(By.CSS_SELECTOR,'body > div:nth-of-type(2) > c-wiz > div:nth-of-type(3) > div > div > div > div > div > div > div > span > div > div > div')
    for result_no ,temp in enumerate(search_results):
        img_src = temp.find_element(By.CSS_SELECTOR,'a div img').get_attribute('src')
        img_name = str(i[0]) + "_" + str(result_no) +".png"
        try: 
            urllib.request.urlretrieve(img_src,img_name )
            sleep(1)
        except:
            img_name = ''
            print('Failed to get img for ',i)
        if result_no == 6: break
                
#%%
#document.querySelector('body > div:nth-of-type(2) > c-wiz > div:nth-of-type(3) > div > div > div > div > div > div > div > span > div > div > div')
#document.querySelector('body > div:nth-of-type(2) > c-wiz > div:nth-of-type(3) > div > div > div > div > div > div > div > span > div > div > div > a > div > img')
driver.close()