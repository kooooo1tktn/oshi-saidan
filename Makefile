deploy:
	npm run build
	firebase deploy

test:
	npm run test

preview:
	npm run build
	firebase hosting:channel:deploy dev