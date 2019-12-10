#!/usr/bin/env bash

# Start up the docker container
sudo docker-compose up -d

# Create DynamoDB
aws dynamodb create-table \
    --table-name testdb \
    --key-schema '[{"AttributeName": "pk","KeyType": "HASH"},{"AttributeName": "sk","KeyType": "RANGE"}]' \
    --attribute-definitions '[{"AttributeName": "pk", "AttributeType": "N"}, {"AttributeName": "sk", "AttributeType": "S"}]' \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url 'http://localhost:8000'


# Create PostgreSQL database
psql "host=localhost user=postgres password=postgres port=5432" -c "CREATE DATABASE test;"

# Run schemas
psql "dbname=test host=localhost user=postgres password=postgres port=5432" -f ./schemas.sql
