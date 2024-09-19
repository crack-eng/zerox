package nbrk

import "time"

const FdateLayout string = "02.01.2006"

type Fdate = string

func NewFdate(t time.Time) Fdate {
	return t.Format(FdateLayout)
}
