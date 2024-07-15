build:
	docker build -t unigram-payment_bot .
run:
	docker run -d -p 3000:3000 --name unigram-payment_bot --rm unigram-payment_bot
stop:
	docker stop unigram-payment_bot
clean:
	docker rm unigram-payment_bot
	docker rmi unigram-payment_bot
deploy: update build run