mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
  use admin
  db.createUser({
    user: "$MONGO_USERNAME",
    pwd: "$MONGO_PASSWORD",
    roles: [
      { role: "readWrite", db: "$MONGO_INITDB_DATABASE" }
    ]
  })

EOF