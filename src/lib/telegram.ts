/**
 * Telegram Bot notification utility (server-side only).
 * Sends notifications to admin via Telegram Bot API.
 * Uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.
 */

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[Telegram] Bot token atau chat ID belum dikonfigurasi. Notifikasi tidak dikirim.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("[Telegram] Gagal mengirim notifikasi:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Error mengirim notifikasi:", error);
    return false;
  }
}
