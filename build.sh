./node_modules/.bin/jshint registry.js
./node_modules/.bin/docco registry.js -o doc
cp -r doc/* ../gh-pages/seneca-registry/doc
