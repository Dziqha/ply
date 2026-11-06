package route

import (
	"github.com/Dziqha/ply"
	"github.com/Dziqha/ply/core"
	"github.com/Dziqha/ply/examples/controller"
)

func NewRouter(router *ply.App, controller *controller.HandlerController) {
	router.Get("/:name", controller.GetHandler)
	router.Post("/hello", func(ctx *core.Context) {
		ctx.Text(200, "Hello World")
	})
}
