from python:3.10.12

WORKDIR /backend

RUN apt-get update \
&& apt-get install -y postgresql postgresql-contrib libpq-dev python3-dev

RUN pip3 install --upgrade pip

COPY requirements.txt .
RUN pip3 install -r requirements.txt
