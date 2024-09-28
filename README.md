# My music
## Outline
You can record music album you listened. 　
This app was built using :[My music](https://mymusic03.com).　　

## Technology Stack
*frontend : React　　
*backend : Django　　
*database : PostgreSQL　　

## Features
*View and delete account lists with admin account　　
*Create, log in, and log out of accounts　　
*Search for music albums using the Spotify API and add them to your library　　
*Manage listening dates, ratings, notes, and links within your library　　
*Display, search, sort, edit, and delete library entries　　
*Edit account information in the settings　　

## Requirement
### frontend
#### dependencies
*React: version 18.3.1　　
*React DOM: version 18.3.1　　
*React Router DOM: version 6.26.1　　
*Axios: version 1.7.5　　
*Sass: version 1.79.1　　
*Vite: version 5.4.1　　
*ESLint: version 9.9.0　　
*@vitejs/plugin-react: version 4.3.1　　
*eslint-plugin-react: version 7.35.0　　

### Environment variables
Create .env and write environment variables there according to the execution environment　　
```
VITE_API_URL='YOUR_API_URL' #'http://localhost:8000' is recommended　　
```

### backend
#### dependencies
*Django: version 5.1　　
*django_restf_ramework: version 3.14　　
*psycopg2: Django database adapter for PostgreSQL　　
*corsheaders: Django middleware for CORS　　
*Other dependencies :show requirements.txt　　

#### Environment variables
Create .env and write environment variables there according to the execution environment　　
Needs spotify API　　
```
SUPERUSER = "YOUR_EMAIL_ADDRESS"
#debug
DEBUG = True
DEBUG_LEVEL='YOUR_DEBUG_LEVEL' # 'DEBUG' is recommended
CONSOLE_LEVEL = 'YOUR_CONSOLE_LEVEL' #'DEBUH' is recommended

#postgreSQL
DATABASE_NAME='YOUR_DATABASE_NAME'
DATABASE_USER='YOUR_DATABASE_USER'
DATABASE_PASSWORD='YOUR_DATABASE_PASSWORD'
DATABASE_HOST='YOUR_DATABASE_HOST'
DATABASE_PORT='YOUR_DATABASE_PORT'

ALLOWED_HOSTS ='YOUR_ALLOWED_HOSTS' # blank is recommended
SECRET_KEY ='YOUR_SECRET_KEY'
CSRF_TRUSTED_ORIGINS = 'YOUR_CSRF_TRUSTED_ORIGINS' # 'http://localhost:8000' is recommended

# spotify API
SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'
SPOTIFY_CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET'
ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'
REFRESH_TOKEN ='YOUR_REFRESH_TOKEN'

#CORS
CORS_ALLOWED_ORIGINS= 'CORS_ALLOWED_ORIGINS' # 'http://localhost:8000' is recommended
CORS_ALLOWED_CREDENTIALS='CORS_ALLOWED_CREDENTIALS' # 'True' is recommended
CORS_ALLOWED_HEADERS='CORS_ALLOWED_HEADERS' # 'content-type,accept,x-requested-with,Authorization' is recommended
```

## Installation
Here are some steps to run this project locally.　　

Project Setup　　
Clone the Repository　　
Use the following command to clone the repository locally:　　
git clone https://github.com/your-username/myapp-frontend.git　　

### frontend
Run ```npm install``` or ```yarn install``` to install dependent packages.　　

### backend
Run ```pip install -r requirements.tx ```　　
Run ```python manage.py makemigrations```　　
Run ```python manage.py migrate```　　

## Usage
### frontend
Starting a development server　　
By default, the app starts at http://localhost:5173.　　
Run ```npm run dev``` or ```yarn dev```　　

### backend
Starting a development server　　
By default, the app starts at http://localhost:8000.　　
Run ```python manage.py runserver```　　

## Note

## Interface
写真

## Author
* email : smith0smithy@gmail.com　　

# License
This project is licensed under the MIT License　　
