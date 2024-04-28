package timerHandler

type TimerFuncHandler func(timerType int32, data interface{})

const (
	DefaultTimer int32 = 0
	SampleTimer  int32 = 101
)

/*Timer Duration configured in seconds*/
const (
	DefaultDuration int32 = 0
	SampleDuration  int32 = 30
)

type TimerData struct {
	DataContext  interface{}
	Recurring    bool
	TimeToExpire int32
	TimerType    int32
	FuncHandler  TimerFuncHandler
}
