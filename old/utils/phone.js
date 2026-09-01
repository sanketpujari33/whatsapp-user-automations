function normalizePhone(input) {
  if (!input) return "";
  const raw = String(input).trim();

  // Keep LID identifiers as-is so replies can target the correct WhatsApp identity.
  if (/@lid$/i.test(raw)) {
    return raw.toLowerCase();
  }

  return raw.replace(/[^0-9]/g, "");
}

function toWhatsAppId(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";

  // Preserve already-resolved WhatsApp IDs such as @c.us or @lid.
  if (/@[a-z0-9._-]+$/i.test(raw)) {
    return raw;
  }

  const normalized = normalizePhone(raw);
  if (!normalized) return "";
  return `${normalized}@c.us`;
}

module.exports = {
  normalizePhone,
  toWhatsAppId
};