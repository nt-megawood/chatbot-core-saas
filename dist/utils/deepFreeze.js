function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}
function deepFreezeInternal(value, seen) {
    if (!isObjectLike(value) || Object.isFrozen(value) || seen.has(value)) {
        return;
    }
    seen.add(value);
    for (const key of Reflect.ownKeys(value)) {
        const nested = value[key];
        if (isObjectLike(nested)) {
            deepFreezeInternal(nested, seen);
        }
    }
    Object.freeze(value);
}
export function deepFreeze(value) {
    deepFreezeInternal(value, new WeakSet());
    return value;
}
//# sourceMappingURL=deepFreeze.js.map