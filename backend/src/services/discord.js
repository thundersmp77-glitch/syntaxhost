export async function sendDiscordWebhook(webhookUrl, order) {
  if (!webhookUrl) return;

  const content = [
    '🆕 **New SyntaxHost Order**',
    `Order ID: #${order.id}`,
    `User: ${order.user.username} (${order.user.email})`,
    `Plan: ${order.plan.name} (${order.plan.type})`,
    `Amount: ₹${order.amountInr}`,
    `Transaction ID: ${order.transactionId}`,
    `Status: ${order.status}`
  ].join('\n');

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch (error) {
    console.error('Discord webhook failed:', error.message);
  }
}
