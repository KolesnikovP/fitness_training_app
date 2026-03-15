package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"net/http"
)

func main() {
	fmt.Println("here")

	_ = godotenv.Load()
	val := os.Getenv("TEST_VALUE")
	fmt.Println(val)
  mux := http.NewServeMux()
  
  mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hello world!"))
  })
  
  err := http.ListenAndServe("localhost:4100", mux)
  fmt.Println(err)

}
