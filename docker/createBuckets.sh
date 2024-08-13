sleep 10;
mc alias set myminio $MINIO_HOST $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD;
echo $APIKEY;
mc admin user svcacct add --access-key $APIKEY --secret-key $SECRET myminio user;
mc mb myminio/subatic;
mc anonymous set public myminio/subatic;
exit 0;