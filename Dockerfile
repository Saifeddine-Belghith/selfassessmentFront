# Stage 1
FROM node:16.16.0 as node
# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install Angular CLI
RUN npm install -g @angular/cli@13

# Copy the rest of the project files into the container
COPY . .

# Build the Angular app
RUN ng build

# Expose the port that the app is running on
EXPOSE 4200

# Set the start command to run the app
CMD ["ng", "serve", "--host", "0.0.0.0"]
