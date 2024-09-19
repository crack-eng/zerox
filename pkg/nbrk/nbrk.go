package nbrk

import "net/http"

const baseURL string = "https://nationalbank.kz/rss"

type Nbrk struct {
	httpClient *http.Client
}

func New(httpClient *http.Client) *Nbrk {
	return &Nbrk{
		httpClient: httpClient,
	}
}
