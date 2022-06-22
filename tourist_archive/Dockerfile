FROM python:3.9-slim
LABEL sk.stuba.fei="MarcoKvasnica@pm.me"

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE 1

# setting work directory
WORKDIR /app

# install dependencies
COPY ./requirements.txt requirements.txt
RUN apt update --fix-missing && \
    apt upgrade -y && \
    apt install -y netcat build-essential python3-dev libpq-dev npm gdal-bin libgdal-dev nodejs npm && \
    pip install -r requirements.txt

# copy application
COPY . .

# Install nodejs & npm and node modules (need to check)
WORKDIR /app/client/
RUN npm install 

WORKDIR /app

# expose port 
EXPOSE 8000
