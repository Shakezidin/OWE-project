package models

type CreateAutoAdder struct {
	UniqueID              string  `json:"unique_id"`
	Date                  string  `json:"date"`
	Type                  string  `json:"type"`
	GC                    string  `json:"gc"`
	ExactAmount           float64 `json:"exact_amount"`
	PerKWAmount           float64 `json:"per_kw_amount"`
	RepPercentage         float64 `json:"rep_percentage"`
	DescriptionRepVisible string  `json:"description_rep_visible"`
	NotesNoRepVisible     string  `json:"notes_no_repvisible"`
	AdderType             string  `json:"adder_type"`
}
