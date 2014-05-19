all:
	java -jar ../plovr.jar serve debug-main.json
build:
	java -jar ../plovr.jar build main.json > deploy/index.js
soyweb:
	java -jar ../plovr.jar soyweb --dir .
lint:
	fixjsstyle --strict -r .
	gjslint --strict -r .
