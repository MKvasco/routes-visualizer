while ! nc -w 1 -z tourist_archive_app_server 5432;
do sleep 5;
done;

npm run dev
sleep 10
python manage.py runserver