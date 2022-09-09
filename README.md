npm run:
"lint": "eslint --config .eslintrc.js src/**"
    -checks for errors in src/

"start": "node src/server.js"
    -runs server

"dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src"
    -runs server with nodemon, restarts when changes are made to src/ folder, uses cross-env for LOG_LEVEL

"debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
    -Same as dev, but runs node inspector on port 9229, allows debugger, uses cross-env for LOG_LEVEL