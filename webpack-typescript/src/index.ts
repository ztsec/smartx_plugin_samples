
// 导入变量声明
import { smart, Event } from "@xtp-smart/sdk";

namespace demo {

    console.log("Event", Event);

    class Plugin {

        constructor() {
        }

        onPreStop() {
            console.log("pre_stop");
        }
    }

    smart.on(Event.ON_INIT, () => {
        console.log("ON_INIT");
        new Plugin();
    });
}
