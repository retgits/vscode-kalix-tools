# Build the documentation

ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

antora_docker_image := gcr.io/akkaserverless-public/akkaserverless-docbuilder
antora_docker_image_tag := latest

.PHONY: clean
clean:
	rm -rf build

html:
	DOCSEARCH_ENABLED=false NODE_PATH=./build/node_modules antora --stacktrace dev.yml
	@echo "local done, generated docs at ./build/site/index.html"

server:
	python3 -m http.server 8080 --directory ./build/site

open:
	open ./build/site/index.html

