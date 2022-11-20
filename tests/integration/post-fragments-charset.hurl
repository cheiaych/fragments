# tests/integration/post-fragments-charset.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 2. GET expanded fragments for user
GET http://localhost:8080/v1/fragments/?expand=1
[BasicAuth]
user1@email.com:password1

#First element in expanded fragment array should have type 'text/plain'
HTTP/1.1 200
[Asserts]
jsonpath "$.fragments[0].type" contains "text/plain"
