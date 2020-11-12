db/connect:
	docker exec -ti park_app_db mongo -u user_app -p password --authenticationDatabase park_db
