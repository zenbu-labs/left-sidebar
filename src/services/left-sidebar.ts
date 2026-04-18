import path from "node:path"
import { fileURLToPath } from "node:url"
import { Service, runtime } from "@testbu/init/src/main/runtime"
import { registerAdvice } from "@testbu/init/src/main/services/advice-config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rendererDir = path.resolve(__dirname, "..", "renderer")

export class LeftSidebarService extends Service {
  static key = "left-sidebar"
  static deps = {}

  evaluate() {
    this.effect("register", () => {
      return registerAdvice("chat", {
        moduleId: "views/chat/App.tsx",
        name: "ChatContent",
        type: "around",
        modulePath: path.resolve(rendererDir, "ChatContentAdvice.tsx"),
        exportName: "ChatContentAdvice",
      })
    })
  }
}

runtime.register(LeftSidebarService, (import.meta as any).hot)
