.PHONY: debug build start test-app logs start-redis start-redis-persistent-data stop

build:
	docker build -t mdulghier/servername-ninja:latest .

start:
	docker run -p 6379:6379 -d --name redis dockerfile/redis:latest
	docker run -d \
		--link redis:redis \
		-e REDIS__HOST=redis \
		-v $(PWD):/app \
		-p 8080:8080 \
		--name ninja \
		mdulghier/servername-ninja:latest

stop:
	docker rm -f redis ninja

start-redis:
	docker run -d --name redis dockerfile/redis

start-redis-persistent-data:
	docker run -d -v /var/redis/data:/data --name redis dockerfile/redis

logs:
	docker logs -f ninja

debug:
	docker run --rm -it \
		--link redis:redis \
		--env REDIS__HOST=redis \
		-v $(PWD):/app \
		-p 8080:8080 \
		-p 8081:8081 \
		mdulghier/servername-ninja:latest \
		./node_modules/.bin/node-debug -p 8081 --web-host 0.0.0.0 server.js

test-app:
	@echo > /dev/null; \
	REDIS_CID=$$(docker run -d dockerfile/redis); \
	REDIS_NAME=$$(docker inspect --format='{{.Name}}' $$REDIS_CID | sed 's/.//'); \
	\
	APP_CID=$$(docker run -d -e REDIS__HOST=redis --link $$REDIS_NAME:redis -v $(PWD):/app mdulghier/servername-ninja:latest); \
	APP_NAME=$$(docker inspect --format='{{.Name}}' $$APP_CID | sed 's/.//'); \
	\
	SELENIUM_CID=$$(docker run -d -P --link $$APP_NAME:app mdulghier/selenium-phantomjs); \
	SELENIUM_NAME=$$(docker inspect --format='{{.Name}}' $$SELENIUM_CID | sed 's/.//'); \
	SELENIUM_PORT=$$(docker inspect --format='{{(index (index .NetworkSettings.Ports "4444/tcp") 0).HostPort}}' $$SELENIUM_NAME); \
	\
	until $$(curl --output /dev/null --silent --head --fail http://localhost:$$SELENIUM_PORT); do \
	    printf '.'; \
		sleep 1; \
	done; \
	echo "Selenium ready..."; \
	\
	docker run --rm \
		-e SELENIUM_BROWSER=phantomjs \
		-e SELENIUM_HOST=selenium \
		-e SELENIUM_PORT=4444 \
		-e SELENIUM_PATH="/wd/hub" \
		-e APP_BASEURL=http://app:8080 \
		-v $(PWD):/app \
		--link $$APP_NAME:app \
		--link $$SELENIUM_NAME:selenium \
		mdulghier/servername-ninja:latest node_modules/.bin/mocha tests/setup_docker.js tests/app/specs.js; \
	TEST_RESULT=$$?; \
	\
	docker rm --force -v $$APP_NAME > /dev/null; \
	docker rm --force -v $$REDIS_NAME > /dev/null; \
	docker rm --force -v $$SELENIUM_NAME > /dev/null; \
	exit $$TEST_RESULT


