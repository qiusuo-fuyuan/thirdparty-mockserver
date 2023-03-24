```javascript
curl --location --request POST 'http://localhost:5000/alipay/trade/precreate' \
--header 'Content-Type: application/json' \
--data-raw '{
    "out_trade_no": "1234567890",
    "subject": "Test Payment",
    "total_amount": "10.00"
}'
```

You can replace the example values for `out_trade_no`, `subject`, and `total_amount` with the actual values that you want to use. You can also adjust the `localhost` URL and the port number (`3000` in this example) to match your actual server configuration.

 \n 