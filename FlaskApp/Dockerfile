FROM python:3.7-stretch
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
RUN pip install gunicorn

ENV FLASK_APP "app/routes.py"
ENV FLASK_ENV "production"
ENV PORT 8080

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

#CMD flask run --host=0.0.0.0
RUN chmod +x ./gunicorn.sh
ENTRYPOINT ["sh","gunicorn.sh"]