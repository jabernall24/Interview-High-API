  
# Backend Container - This is the MVP Version
# TODO: Multi-stage build, will require a linter and tree shaking before moving the reminenants to the final container

FROM alpine:latest

# Include Node.js support and NPM

RUN apk --no-cache add nodejs-current npm

# Copies over the package.json and lock from the git repo so as to decrease the build times
COPY package.json ./

# Installs the dependencies as needed and creates the needed directories for building
RUN npm install && mkdir interview-high-backend && mv ./node_modules ./interview-high-backend

# Sets working directory to the angular application
WORKDIR /interview-high-backend

# Copies over the actual express app into the container
COPY . .

# Set enviorment variables, URL requires local enviroment variable to be set before the build starts

ENV PORT 80

ENV URL ${URL}

# Open the port needed

EXPOSE 80

# Installs the dependencies and starts the express application
RUN npm install
