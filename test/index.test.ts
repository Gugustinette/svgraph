import { expect, test } from "vitest";
import { foo } from "../src";

test("foo", () => {
	expect(foo()).toBe("foo");
});
