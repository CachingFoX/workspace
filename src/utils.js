

export function tbCodeToId(tbCode) {
  const code = tbCode.trim().toUpperCase();
  if (!code.startsWith("TB")) {
    console.error(`Kein gültiger GC-Code '${tbCode}'`)
    // throw new Error(`Kein gültiger TB-Code '${tbCode}'`);
    return -1;
  }
  return codeToId(code.slice(2));
}
export function gcCodeToId(gcCode) {
  const code = gcCode.trim().toUpperCase();
  if (!code.startsWith("GC")) {
    console.error(`Kein gültiger GC-Code '${gcCode}'`)
    //throw new Error(`Kein gültiger GC-Code '${gcCode}'`);
    return -1;
  }
  return codeToId(code.slice(2));
}

export function codeToId(core) {
  const base31Alphabet = "0123456789ABCDEFGHJKMNPQRTVWXYZ"; // Base-31 Alphabet
  const base16Alphabet = "0123456789ABCDEF";

  let value = 0;

  for (const ch of core) {
    const idx = base31Alphabet.indexOf(ch);
    if (idx === -1) throw new Error(`Ungültiges Zeichen '${ch}'`);
    value = value * 31 + idx;
  }
  if (value < 476656) {
    value = 0;
    for (const ch of core) {
      const idx = base16Alphabet.indexOf(ch);
      if (idx === -1) throw new Error(`Ungültiges Zeichen '${ch}'`);
      value = value * 16 + idx;
    }
    return value;
  }

  return value - 476656 + 65536;
}

