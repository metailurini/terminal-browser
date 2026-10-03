import type { EngineKeyEvent } from "../react";

export function editingCommands(event: EngineKeyEvent, noSuper = false): string[] | null {
  const { key, mods } = event;
  if (mods.ctrl) return controlEditingCommands(event);
  const select = mods.shift ? "AndModifySelection" : "";
  if (key === "backspace") {
    if (mods.super) return ["deleteToBeginningOfLine"];
    if (mods.alt) return ["deleteWordBackward"];
    return null;
  }
  if (key === "b" && mods.alt && !mods.super) return [`moveWordLeft${select}`];
  if (key === "f" && mods.alt && !mods.super) return [`moveWordRight${select}`];
  if (key === "left" || key === "right") {
    const end = key === "left" ? "moveToLeftEndOfLine" : "moveToRightEndOfLine";
    const word = key === "left" ? "moveWordLeft" : "moveWordRight";
    if (mods.super) return [`${end}${select}`];
    if (mods.alt) return [`${word}${select}`];
    return null;
  }
  if (key === "up" || key === "down") {
    const edge = key === "up" ? "moveToBeginningOfDocument" : "moveToEndOfDocument";
    if (mods.super && !mods.alt) return [`${edge}${select}`];
    return null;
  }
  const command = mods.super || (noSuper && mods.alt);
  const extraAlt = mods.super && mods.alt;
  if (command && !extraAlt && !mods.shift && key === "a") return ["selectAll"];
  if (command && !extraAlt && key === "z") return [mods.shift ? "redo" : "undo"];
  if (command && !extraAlt && !mods.shift && key === "c") return ["Copy"];
  if (command && !extraAlt && !mods.shift && key === "x") return ["Cut"];
  return null;
}

function controlEditingCommands(event: EngineKeyEvent): string[] | null {
  const { key, mods } = event;
  if (mods.super || mods.alt) return null;
  const select = mods.shift ? "AndModifySelection" : "";
  switch (key) {
    case "a":
      return [`moveToLeftEndOfLine${select}`];
    case "e":
      return [`moveToRightEndOfLine${select}`];
    case "b":
      return [`moveLeft${select}`];
    case "f":
      return [`moveRight${select}`];
    case "d":
      return ["deleteForward"];
    case "k":
      return ["deleteToEndOfLine"];
    case "w":
      return ["deleteWordBackward"];
    case "u":
      return ["deleteToBeginningOfLine"];
    default:
      return null;
  }
}
