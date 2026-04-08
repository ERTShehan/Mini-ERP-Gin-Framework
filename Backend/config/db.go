package config

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("mysql", "root:Ijse@1234@tcp(127.0.0.1:3306)/minierp")
	if err != nil {
		panic(err)
	}
}
