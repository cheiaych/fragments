# tests/integration/post-fragments-unauthenticated.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Invalid auth credentials
[BasicAuth]
incorrect@username.com:incorrectpassword1
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# Should return 401 error when unauthenitcated
HTTP/1.1 401
