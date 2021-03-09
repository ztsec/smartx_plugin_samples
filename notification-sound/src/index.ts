
// 导入变量声明
import { smart, Event } from "@xtp-smart/sdk";

namespace demo {
    class Plugin {

        constructor() {
            this.bindEvent();
        }

        bindEvent() {
            document.getElementById("info")?.addEventListener("click", () => {
                this.notice("info");
            })
            document.getElementById("success")?.addEventListener("click", () => {
                this.notice("success");
            })
            document.getElementById("warning")?.addEventListener("click", () => {
                this.notice("warning");
            })
            document.getElementById("error")?.addEventListener("click", () => {
                this.notice("error");
            })

            document.getElementById("info_s")?.addEventListener("click", () => {
                this.notice("info", true);
            })
            document.getElementById("success_s")?.addEventListener("click", () => {
                this.notice("success", true);
            })
            document.getElementById("warning_s")?.addEventListener("click", () => {
                this.notice("warning", true);
            })
            document.getElementById("error_s")?.addEventListener("click", () => {
                this.notice("error", true);
            })
        }

        sound(text: string | undefined) {
            const utterThis = new window.SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterThis);
        }

        notice(level: string, withSound = false) {
            if (withSound) {
                const text = (document.getElementById("text") as HTMLInputElement).value;
                if (text) {
                    this.sound(text);
                }
            }
            smart.notice({
                level,
                title: "这是通知标题",
                msg: "这里是通知描述这里,是通知描述这里是通知描述这里,是通知描述这里,是通知描述这里是通知描述这里是通知描述"
            });
        }
    }

    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        new Plugin();
        smart.notice({ level: "info", title: "欢迎使用！", msg: "欢迎欢迎" });
    });
    smart.on(Event.ON_SHOW, () => {
        smart.notice({ level: "success", title: "插件已显示", msg: "" });
    });
    smart.on(Event.ON_HIDE, () => {
        smart.notice({ level: "warning", title: "插件已隐藏", msg: "" });
    });
    smart.on(Event.ON_CLOSE, () => {
        smart.notice({ level: "error", title: "插件即将关闭", msg: "期待下次再见" });
    });
}
