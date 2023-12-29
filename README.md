# Web project for "Developing information system on frameworks" class
The project was built using:
- React framework for Frontend development (MUI for Admin interfaces)
- ASP.NET Web API for Backend API development
- MongoDB Atlas for database hosting
- Flask API for recommendation deployment
- Hardhat JS for Web3 deployment
# Recommendation system
The schema was built based on "DataCo SMART SUPPLY CHAIN DATASET" to replicate a recommendation system using collaborative filtering technique of recommdations.
Referenced: https://www.kaggle.com/code/shawamar/product-recommendation-system-for-e-commerce
# Datasource
https://data.mendeley.com/datasets/8gx2fvg2k6/5
# Installations
## Dataprepocessing
There's preprocessed data (.csv files) in the /data directory for schema definition. The data was processed by running "/data_tasks/data_preprocessing.py
Since the original data links for images didn't work there's an image crawling script ("/data_tasks/Image_crawling.py") using Selenium
## Backend service
Modify your connection to MongoDB in appsettings.json. There's two connection properties, one for local Mongo and one for MongoDB Atlas.
appsettings.json can be found in ("/backend/wobbleBackEnd/wobbleBackEnd/")
After modifying your appsettings.json. Run "dotnet run" in your command line with .Net SDK (6.x) installed or simply start the application using Visual Studio
If the service starts locally and "/backend/wobbleBackEnd/wobbleBackEnd/Properties/launchsettings.json" isn't modified, the service will most likely starts at localhost:7136.
If there's no bug regarding swagger, you can explore the API endpoints at "localhost:7136/swagger"
## Recommendation service ( Backend )
Modify your connection string to the database at the very top of "flask_api_for_rec/app.py" then run the file in any Python environment, flask will create a server on wherever it's ran.
## Frontend Services
### frontend and frontend_react
Due to classes demand, there's 2 versions of the frontend. "frontend" was coded in pure vanilla JS with "ethers" being the only external library for Web3 Connection.
For the vanilla JS code, there's less requirements regarding functions. Therefore, there isnt' Admin procedures.
As for the ReactJS version, there's very little time before submission so this was done in a rush. Some of the code might appear hard to understand or unnecessarily repeated
#### frontend
Navigate to "/frontend/script/utils.js" and change the two urls
- "url" : ASP.NET Web API service URL
- "flask_url": Where the Flask is hosted (Usually localhost:5000) by default
#### react_frontend
Is the same as the vanilla frontend but with extra steps regaring node modules installations:
- cd (Change/move current directory in the terminal) to the project
- npm install
- npm start
- Configure "url" and "flask_url" in "/react_frontend/src/utils.js"
# Web3 services
By default the contract is deployed using a throwaway wallet, you can configure this in "/web3/hardhat.config.js"
You can look up for more networks to deploy, for example: Ganache for local development
After setting the account and network in the config file
- cd to the directory (/web3)
- npm install
- npx hardhat run scripts/deploy.js
# That's all, thanks for reading!
