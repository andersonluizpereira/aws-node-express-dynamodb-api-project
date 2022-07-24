rm -rf .dynamodb
npm ci
sls dynamodb install
sls dynamodb start --migrate

curl --location --request POST 'http://0.0.0.0:3000/users' \
--header 'Content-Type: application/json' \
--data-raw '{   "id": "02",
    "name": "Batman",
    "skills": [
        "02",
        "03",
        "04",
        "05"
    ]
}'