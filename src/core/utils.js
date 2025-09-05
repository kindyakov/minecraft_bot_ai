export function parseMsg(msg) {
  let text = msg.trim().toLowerCase()
  if (!text || !text.startsWith(':')) return null
  const result = text.slice(1);
  console.log(result)
}