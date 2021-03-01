import ext from "./ext";

/**
 * Send Message to background script
 * @param { string } msgType
 * @param { {[string]:any} } message
 */
export const sendMessage = async (msgType, message) => {
    const msg = {
        msgType,
        ...message,
    };
    console.log("===== Sending Message => ", msg);
    return new Promise((resolve, reject) => {
        try {
            ext.runtime.sendMessage(msg, (response) => {
                resolve(response);
            });
        } catch (e) {
            console.log(" SendMessage Failed => ", e);
            reject(e);
        }
    });
};

export default sendMessage;
