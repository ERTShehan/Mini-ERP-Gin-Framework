package config

import (
	"database/sql"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	var err error
	
	godotenv.Load()

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "root:Ijse@1234@tcp(127.0.0.1:3306)/minierp"
	}
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
}
