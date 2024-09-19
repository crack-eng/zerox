package rater

import (
	"errors"
	"time"

	"github.com/crack-eng/zerox/pkg/nbrk"
)

type Rater interface {
	GetRate(string) (*float64, error)
}

type rater struct {
	nbrker nbrk.Nbrk
}

func New(nbrker nbrk.Nbrk) Rater {
	return &rater{
		nbrker: nbrker,
	}
}

var (
	ErrGetRateFailed = errors.New("failed to get rates")
)

func (r *rater) GetRate(base string) (*float64, error) {
	rates, err := r.nbrker.GetRates(nbrk.NewFdate(time.Now()))

	if err != nil {
		return nil, errors.Join(ErrGetRateFailed, err)
	}

	for _, item := range rates.Items {
		if item.Title == base {
			rate := item.Description / float64(item.Quant)
			return &rate, nil
		}
	}

	return nil, ErrGetRateFailed
}
