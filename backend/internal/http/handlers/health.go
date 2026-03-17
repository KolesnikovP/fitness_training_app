package handlers

import "net/http"
import "fmt"

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	
	fmt.Println("/health handler works")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Ok"))
}
