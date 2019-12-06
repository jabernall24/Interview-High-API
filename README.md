# Interview High API

1. Make Sure docker is installed.
2. Export necessary variables
    - export URL=postgres://postgres:postgres@localhost:5432/test
    - export PORT=8080
3. Install AWS CLI
    - https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html
4. Give exeute permission to the script
    - chmod +x start.sh
5. Run the script to spin up docker, create databases, and populate them
    - ./start.sh
