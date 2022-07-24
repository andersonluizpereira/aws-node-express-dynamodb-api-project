rm -rf .dynamodb
npm ci
sls dynamodb install
sls dynamodb start --migrate

