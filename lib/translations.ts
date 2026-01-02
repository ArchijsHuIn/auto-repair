export const WORK_ORDER_STATUS_LATVIAN: Record<string, string> = {
    NEW: "Jauns",
    DIAGNOSTIC: "Diagnostika",
    WAITING_PARTS: "Gaida detaļas",
    IN_PROGRESS: "Procesā",
    DONE: "Pabeigts",
    CANCELLED: "Atcelts",
};

export const PAYMENT_STATUS_LATVIAN: Record<string, string> = {
    UNPAID: "Neapmaksāts",
    PARTIAL: "Daļēji apmaksāts",
    PAID: "Apmaksāts",
};

export const PAYMENT_METHOD_LATVIAN: Record<string, string> = {
    CASH: "Skaidra nauda",
    CARD: "Karte",
    TRANSFER: "Pārskaitījums",
    OTHER: "Cits",
};

export const WORK_ORDER_ITEM_TYPE_LATVIAN: Record<string, string> = {
    LABOR: "Darbs",
    PART: "Detaļa",
};

export const translateWorkOrderStatus = (status: string): string => {
    return WORK_ORDER_STATUS_LATVIAN[status] || status;
};

export const translatePaymentStatus = (status: string): string => {
    return PAYMENT_STATUS_LATVIAN[status] || status;
};

export const translatePaymentMethod = (method: string | null | undefined): string => {
    if (!method) return "Nav norādīts";
    return PAYMENT_METHOD_LATVIAN[method] || method;
};

export const translateWorkOrderItemType = (type: string): string => {
    return WORK_ORDER_ITEM_TYPE_LATVIAN[type] || type;
};
