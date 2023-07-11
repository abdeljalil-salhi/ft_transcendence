all		:	start

.PHONY	:	start
start	:
			sh ./scripts/start.sh

.PHONY	:	run
run		:
			sh ./scripts/run.sh

.PHONY	:	clean
clean	:
			sh ./scripts/clean.sh