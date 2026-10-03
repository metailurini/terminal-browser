const assert = require("node:assert/strict");
const test = require("node:test");

const { editingCommands } = require("../dist/web/editing-commands.js");

function press(key, mods = {}) {
  return {
    key,
    kind: "press",
    text: null,
    mods: {
      super: false,
      alt: false,
      ctrl: false,
      shift: false,
      ...mods,
    },
  };
}

test("noSuper maps Option to Cmd for macOS editing shortcuts", () => {
  assert.deepEqual(editingCommands(press("a", { alt: true }), true), ["selectAll"]);
  assert.deepEqual(editingCommands(press("c", { alt: true }), true), ["Copy"]);
  assert.deepEqual(editingCommands(press("x", { alt: true }), true), ["Cut"]);
  assert.deepEqual(editingCommands(press("z", { alt: true }), true), ["undo"]);
  assert.deepEqual(editingCommands(press("z", { alt: true, shift: true }), true), ["redo"]);
});

test("Option editing semantics remain unchanged when noSuper is disabled", () => {
  assert.equal(editingCommands(press("a", { alt: true }), false), null);
  assert.deepEqual(editingCommands(press("left", { alt: true }), false), ["moveWordLeft"]);
  assert.deepEqual(editingCommands(press("backspace", { alt: true }), false), ["deleteWordBackward"]);
});

test("real Cmd+Option does not become a plain Cmd shortcut", () => {
  assert.equal(editingCommands(press("a", { super: true, alt: true }), true), null);
  assert.equal(editingCommands(press("x", { super: true, alt: true }), true), null);
});
