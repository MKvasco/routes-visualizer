while ! nc -w 1 -z tourist_archive_app_server 5432;
do sleep 5;
done;

python manage.py makemigrations
sleep 5
python manage.py migrate
sleep 5
python manage.py runserver
sleep 5
cd /app/client/
npm run dev