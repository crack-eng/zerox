package nbrk

import (
	"encoding/xml"
	"errors"
	"fmt"
	"io"
	"net/http"
)

var (
	ErrRequestFailed        = errors.New("nbrk: failed to make request")
	ErrReadBodyFailed       = errors.New("nbrk: failed to read body")
	ErrUnexpectedStatusCode = errors.New("nbrk: unexpected status code")
	ErrUnmarshalXMLFailed   = errors.New("nbrk: failed to unmarshal xml")
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

func (n *Nbrk) GetRates(fdate Fdate) (*Rates, error) {
	url := fmt.Sprintf("%s/get_rates.cfm?fdate=%s", baseURL, fdate)

	resp, err := n.httpClient.Get(url)
	if err != nil {
		return nil, errors.Join(ErrRequestFailed, err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.Join(ErrReadBodyFailed, err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, ErrUnexpectedStatusCode
	}

	var rates Rates
	if err := xml.Unmarshal(body, &rates); err != nil {
		return nil, errors.Join(ErrUnmarshalXMLFailed, err)
	}

	return &rates, nil
}
