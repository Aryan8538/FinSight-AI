import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/utils/http.js";

test("AppError carries status and validation details", () => {
  const error = new AppError(422, "Invalid input", { field: "email" });
  assert.equal(error.status, 422);
  assert.equal(error.message, "Invalid input");
  assert.deepEqual(error.details, { field: "email" });
});

