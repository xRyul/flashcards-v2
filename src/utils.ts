export function arraysEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function escapeMarkdown(string: string, skips: string[] = []) {
  // Skip escaping if the string is already LaTeX (we assume LaTeX if it contains commands)
  if (string.includes('\\') && (string.includes('\\frac') || string.includes('\\times') || string.includes('\\begin'))) {
    // For LaTeX content, only escape angle brackets which could mess with HTML
    return string
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  const replacements: any = [
    // [/\*/g, "\\*", "asterisks"],
    [/#/g, "#", "number signs"],
    // [/\//g, "\\/", "slashes"],
    [/\\/g, "\\\\", "backslash"],
    [/\(/g, "\\(", "parentheses"],
    [/\)/g, "\\)", "parentheses"],
    [/\[/g, "\\[", "square brackets"],
    [/\]/g, "\\]", "square brackets"],
    [/</g, "&lt;", "angle brackets"],
    [/>/g, "&gt;", "angle brackets"],
    [/_/g, "\\_", "underscores"],
  ];

  return replacements.reduce(function (s: string, replacement: any) {
    const name = replacement[2];
    return name && skips.indexOf(name) !== -1
      ? s
      : s.replace(replacement[0], replacement[1]);
  }, string);
}


export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}