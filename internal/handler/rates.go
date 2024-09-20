package handler

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/crack-eng/zerox/internal/rater"
	"github.com/crack-eng/zerox/pkg/nbrk"
)

func GetRate(w http.ResponseWriter, r *http.Request) {
	base := r.PathValue("base")

	rate, err := rater.New(*nbrk.New(http.DefaultClient)).GetRate(strings.ToUpper(base))

	if err != nil {
		fmt.Fprint(w, err)
	}

	fmt.Fprint(w, *rate)
}
