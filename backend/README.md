# Backend

### Project structure:

```
.
└── backend
  ├── auth_app                  # Authorization Application
  ├── chat_app                  # Chat Application
  ├── project                   # Core Project
  ├── user_app                  # User Application
  ├── .env.template             # Environment variables (template)
  ├── db_test.json              # Test data
  └── requirements.txt          # Modules to install
```

## Installation

The installation process of the project may vary depending on your operating system. The instruction has been tested on
OS such as Windows 10, 11 and Linux (Ubuntu 22.04). It is advisable to use python 3.10 or higher. To follow the
instructions below, make sure that you are in the **backend** folder.

### Configuring Environment Variables

1. Copy the **.env.template** file to **.env**
2. Open the **.env** file using a text editor.
3. Replace the placeholder values in the **.env** file with your own data. Look for lines
   like ```VARIABLE_NAME=example_value``` and replace *example_value* with your desired values.
4. Save the changes to the **.env** file.

### Installation on Windows

#### Create Python Virtual Environment and install requirements

    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt

#### Run project

    python manage.py makemigrations
    python manage.py migrate
    python manage.py loaddata db_test.json          # (optional) Add test data to Database
    python manage.py runserver

### Install on Linux (Ubuntu 22.04)

#### Create Python Virtual Environment and install requirements on Linux

    python3 -m venv venv
    source venv/bin/activate
    pip3 install -r requirements.txt

#### Run project

    python3 manage.py makemigrations
    python3 manage.py migrate
    python3 manage.py loaddata db_test.json         # (optional) Add test data to Database
    python3 manage.py runserver

### Install Redis

1. Install Docker on https://docs.docker.com/desktop/
2. Download and install docker-container **redis:5**
