package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/crack-eng/zerox/pkg/nbrk"
)

func main() {
	httpClient := &http.Client{
		Timeout: time.Second * 10,
	}

	n := nbrk.New(httpClient)

	rates, err := n.GetRates(nbrk.NewFdate(time.Now()))
	if err != nil {
		log.Fatalf("Error getting rates: %v", err)
	}

	if rates.Info != "" {
		fmt.Println("Info:", rates.Info)
		return
	}

	for _, item := range rates.Items {
		unitValue := item.Description / float64(item.Quant)
		fmt.Printf("%s - %.4f / %d = %.4f\n",
			item.Title, item.Description, item.Quant, unitValue)
	}
}
