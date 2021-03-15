
// 导入变量声明
import { smart, Event } from "@xtp-smart/sdk";

namespace demo {

    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        smart.notice({ level: "info", title: "欢迎使用！", msg: "欢迎欢迎" });
    });
}
