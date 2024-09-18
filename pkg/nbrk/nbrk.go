package nbrk

import "net/http"

const baseURL string = "https://nationalbank.kz/rss"

type nbrk struct {
	httpClient *http.Client
}

func New(httpClient *http.Client) *nbrk {
	return &nbrk{
		httpClient: httpClient,
	}
}
