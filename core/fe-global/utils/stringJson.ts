export function toJson(input) {
  // Nếu đã là object hoặc array thì trả về luôn
  if (typeof input === "object" && input !== null) {
    return input;
  }

  // Nếu là string thì thử parse
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch (e) {
      return {}; // không parse được thì trả về {}
    }
  }

  // Các loại khác -> trả về {}
  return {};
}

export function toStringJson(input) {
  // Nếu đã là object/array thì stringify
  if (typeof input === "object" && input !== null) {
    try {
      return JSON.stringify(input);
    } catch (e) {
      return "{}";
    }
  }

  // Nếu là string thì check có phải JSON không
  if (typeof input === "string") {
    try {
      JSON.parse(input); // check xem có phải JSON không
      return input; // là JSON thì giữ nguyên
    } catch (e) {
      return "{}"; // không phải JSON thì trả "{}"
    }
  }

  // Các loại khác -> "{}"
  return "{}";
}
