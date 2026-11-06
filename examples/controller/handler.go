package controller

import (
	"fmt"

	"github.com/Dziqha/ply/core"
)

type HandlerController struct{}

func NewHandlerController() *HandlerController {
	return &HandlerController{}
}

func (h *HandlerController) GetHandler(c *core.Context) {
	c.Text(200, fmt.Sprintf("Hello %s", c.Param("name")))
}
