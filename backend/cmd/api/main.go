package main

import (
	"fmt"
	"os"

	"net/http"

	"github.com/KolesnikovP/fitness_training_app/backend/internal/http/router"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("here")

	_ = godotenv.Load()
	val := os.Getenv("TEST_VALUE")
	fmt.Println(val)

  err := http.ListenAndServe("localhost:4100", router.NewRouter())
  fmt.Println(err)
}
