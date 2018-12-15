# serverless-user-mgmt-2

This is an improved version of [my previous exersise](https://github.com/ilog2000/serverless-user-mgmt) with serverless framework in NodeJS. The application provides a simple web interface for user management.

## The technological stack

Back end:
* node.js
* serverless
* DynamoDB

Front end:
* react.js

## Running locally

To start playing with it, clone the repository and install node packages:
```
git clone https://github.com/ilog2000/serverless-user-mgmt-2
cd serverless-user-mgmt-2
yarn
```
To run it locally, you will need to set up a [local copy of DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html). Note, that it requres Java runtime to be available on your machine. After download, unzip an archive, and execute the following command:
```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
Now create `.env` and `env.production` files from `.env.example`.

Create and fill in DynamoDB 'users' table using AWS CLI - see CMD files in `scripts` subdirectories for Windows or rename them to shell scripts on Linux.

In order to run the API back end, you can use the next script:
```
yarn dev-lambda
```
The `serverless-offline` plugin is executed behind the scene.

The following command will start a development server for the front end (just ensure that `client/src/config.js` API_URL points to `http://localhost:3000`; if not - modify and run `yarn build` to re-build front end distribution):
```
yarn serve
```
The web application can be open on [localhost:5000](http://localhost:5000).

## Deployment to AWS

You can deploy lambda functions to AWS with thes command:
```
yarn prod-lambda
```

To deploy front end to S3 bucket, check CMD files in `scripts/s3` directory.

You will need a very convenient [REST Client plugin for Visual Studio Code](https://github.com/Huachao/vscode-restclient) to use `test.http` file, which contains descriptors of HTTP requests to API.
