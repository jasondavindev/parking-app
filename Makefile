USER_SH=$(shell id -u ${USER})
GROUP_SH=$(shell id -g ${USER})

db/connect:
	docker exec -ti park_app_db mongo -u user_app -p password --authenticationDatabase park_db

dkbuild:
	docker-compose build

dkup:
	docker-compose up

dkdown:
	docker-compose down

dkup/build:
	docker-compose up --build

build:
	docker run --rm -it \
	-v ${PWD}:/app \
	-u ${USER_SH}:${GROUP_SH} \
	-w /app \
	node:14-alpine sh -c "yarn build"

install:
	docker run --rm -it \
	-v ${PWD}:/app \
	-u ${USER_SH}:${GROUP_SH} \
	-w /app node:14-alpine sh -c "yarn install"

.PHONY: test
test:
	docker run --rm -it \
	-v ${PWD}:/app \
	-w /app node:14-alpine sh -c "yarn test"

# localmente devido a permissoes
test/e2e:
	yarn test:e2e
