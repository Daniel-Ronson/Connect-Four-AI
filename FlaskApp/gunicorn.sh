#!  used in Dockerfile

exec gunicorn --bind :$PORT --workers 1 --threads 8 app.routes:app