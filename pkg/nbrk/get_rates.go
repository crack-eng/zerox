package nbrk

import (
	"encoding/xml"
	"errors"
	"fmt"
	"io"
	"net/http"
)

const (
	ErrRequestFailed        = "nbrk: failed to make request"
	ErrReadBodyFailed       = "nbrk: failed to read body"
	ErrUnexpectedStatusCode = "nbrk: unexpected status code"
	ErrUnmarshalXMLFailed   = "nbrk: failed to unmarshal xml"
)

type Item struct {
	Fullname    string  `xml:"fullname"`
	Title       string  `xml:"title"`
	Description float64 `xml:"description"`
	Quant       int     `xml:"quant"`
	Index       string  `xml:"index"`
	Change      string  `xml:"change"`
}

type Rates struct {
	XMLName     xml.Name `xml:"rates"`
	Generator   string   `xml:"generator"`
	Title       string   `xml:"title"`
	Link        string   `xml:"link"`
	Description string   `xml:"description"`
	Copyright   string   `xml:"copyright"`
	Date        string   `xml:"date"`
	Info        string   `xml:"info,omitempty"`
	Items       []Item   `xml:"item,omitempty"`
}

func (n *nbrk) GetRates(fdate Fdate) (*Rates, error) {
	url := fmt.Sprintf("%s/get_rates.cfm?fdate=%s", baseURL, fdate)

	resp, err := n.httpClient.Get(url)
	if err != nil {
		return nil, errors.Join(errors.New(ErrRequestFailed), err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.Join(errors.New(ErrReadBodyFailed), err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(ErrUnexpectedStatusCode)
	}

	var rates Rates
	if err := xml.Unmarshal(body, &rates); err != nil {
		return nil, errors.Join(errors.New(ErrUnmarshalXMLFailed), err)
	}

	return &rates, nil
}
