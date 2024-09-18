package nbrk

import "time"

const fdateLayout string = "02.01.2006"

type Fdate = string

func NewFdate(t time.Time) Fdate {
	return t.Format(fdateLayout)
}
