import {alert, confirm, custom} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

export function calculateFilterExpressionCustom(
    this: any, value: any, selectedFilterOperations: any, target: any) {
    return this.defaultCalculateFilterExpression.apply(this, [
      new Date(value),
      selectedFilterOperations,
      target
    ]);
}

// Success message notification. Modeless
export function notifySuccess(message: string) {
    notify({
        message: message,
        position: {
            my: "center top",
            at: "center top"
        },
        width: 500,
        right: 50,
        top: 150
    }, "success", 10000);
}

// Warning message notification. Modeless
export function notifyWarning(message: string) {
    notify({
        message: message,
        position: {
            my: "center top",
            at: "center top"
        },
        width: 500
    }, "warning", 10000);
}

// Error message notification. Non-modal
export function notifyError(message: string) {
    notify({
        message: message,
        position: {
            my: "center top",
            at: "center top"
        },
        width: 500
    }, "error", 10000);
}

/**
 * Success popup
 * @param {*} message
 */
export function alertSuccess(message: string): Promise<void> {
    return alert(message, "Successful operation");
}

/**
 * Warning popup
 * @param {*} message
 */
export function alertWarning(message: string): Promise<void> {
    return alert(message, "Warning!");
}

/**
 * Success popup
 * @param {*} message
 */
export function confirmNotify(message: string, title?: string): Promise<boolean> {
    // return confirm(message, title ?? "Operation confirmation");

    return custom({
        title: title ?? "Operation confirmation",
        messageHtml: message,
        buttons: [
            {
                text: "Tidak",
                type: "normal",
                stylingMode: "contained",
                onClick: (e) => {
                    return false;
                }
            },
            {
                text: "Ya",
                type: "success",
                stylingMode: "contained",
                onClick: (e) => {
                    return true;
                }
            },
        ]
    }).show();
}

/**
 * Warning confirmation popup
 * @param {*} message
 */
export function confirmError(message: string): Promise<boolean> {
    return confirm(message, "Operation confirmation");
}
