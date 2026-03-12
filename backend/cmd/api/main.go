package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("here")

	_ = godotenv.Load()
	val := os.Getenv("TEST_VALUE")
	fmt.Println(val)
}
