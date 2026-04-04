function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function deepFreezeInternal(value: unknown, seen: WeakSet<object>): void {
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

export function deepFreeze<T>(value: T): Readonly<T> {
  deepFreezeInternal(value, new WeakSet<object>());
  return value as Readonly<T>;
}
