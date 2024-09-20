package main

import (
	"net/http"

	"github.com/crack-eng/zerox/internal/handler"
)

func main() {
	http.HandleFunc("GET /rates/{base}/kzt", handler.GetRate)

	http.ListenAndServe("localhost:8080", nil)
}
