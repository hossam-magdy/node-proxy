# Node Proxy

### A sample NodeJS proxy server with header manipulation of request and response

```
|      | -----> |     | ~~~~~> |      |
|Client|        |Proxy|        |Server|
|      | <~~~~~ |     | <----- |      |

----- : original/raw/untouched request/respone
~~~~~ : header-manipulated (body-untouched) request/response
```