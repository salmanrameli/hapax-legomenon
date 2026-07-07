package constants

type value struct {
	label string
	value string
}

type immutablePrompt struct {
	LOCAL value
	CLOUD value
}

func (p immutablePrompt) LocalLabel() string { return p.LOCAL.label }
func (p immutablePrompt) LocalValue() string { return p.LOCAL.value }

func (p immutablePrompt) CloudLabel() string { return p.CLOUD.label }
func (p immutablePrompt) CloudValue() string { return p.CLOUD.value }

var TrainImageMode = immutablePrompt{
	LOCAL: value{label: "local", value: "local"},
	CLOUD: value{label: "cloud", value: "cloud"},
}

var GeneratePromptMode = immutablePrompt{
	LOCAL: value{label: "local", value: "local"},
	CLOUD: value{label: "cloud", value: "cloud"},
}

var GenerateImageMode = immutablePrompt{
	LOCAL: value{label: "local", value: "local"},
	CLOUD: value{label: "cloud", value: "cloud"},
}
