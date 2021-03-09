
// 导入变量声明
import { smart, Event } from "@xtp-smart/sdk";

namespace demo {
    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
    });
    smart.on(Event.ON_SHOW, () => {
        console.log("ON_SHOW");
    });
    smart.on(Event.ON_HIDE, () => {
        console.log("ON_HIDE");
    });
    smart.on(Event.ON_CLOSE, () => {
        console.log("ON_CLOSE");
    });
}
