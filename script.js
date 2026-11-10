const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('show');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('show');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Report form: sends the report to a Discord channel through a webhook.
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1569633743323406406/5vd5Sn-RsatwlFTemmnJlet7DiKMg5CDolLjJKZSzmL13ZK8v3BG3ilscsivVlqfyYQX';

const reportForm = document.getElementById('reportForm');
const formMessage = document.getElementById('formMessage');

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = 'form-message ' + type;
}

reportForm.addEventListener('input', () => reportForm.classList.remove('submitted'));

reportForm.addEventListener('submit', async event => {
  event.preventDefault();
  const type = document.getElementById('reportType').value;
  const link = document.getElementById('reportLink').value.trim();
  const details = document.getElementById('reportDetails').value.trim();
  const email = document.getElementById('reportEmail').value.trim();
  const submitBtn = reportForm.querySelector('.submit-btn');

  if (!type || !details) {
    showFormMessage('Please complete the required fields.', 'error');
    return;
  }

  const payload = {
    username: 'Community Reports',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: '🚩 New report: ' + type,
      color: 0x8bdc35,
      description: details.slice(0, 4000),
      fields: [
        { name: 'Topic', value: type.slice(0, 1024) },
        { name: 'Link or username', value: (link || 'Not provided').slice(0, 1024) },
        { name: 'Reporter email', value: (email || 'Not provided').slice(0, 1024) }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'Community Help & Support' }
    }]
  };

  reportForm.classList.add('submitted');
  submitBtn.disabled = true;
  showFormMessage('Sending your report...', 'pending');

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Request failed with status ' + response.status);
    showFormMessage('⚠️ ERROR SUBMITTING REPORT. Please contact Live Support for assistance. →', 'success');
    reportForm.reset();
  } catch (error) {
    console.error(error);
    showFormMessage('Something went wrong and your report was not sent. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

// Frontend-only chat demo. Messages stay in this browser page and are not delivered to an agent.
const chatPanel = document.getElementById('chatPanel');
const chatLauncher = document.getElementById('chatLauncher');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');

function openChat() {
  chatPanel.classList.add('open');
  chatPanel.setAttribute('aria-hidden', 'false');
  chatInput.focus();
}
function closeChat() {
  chatPanel.classList.remove('open');
  chatPanel.setAttribute('aria-hidden', 'true');
}
chatLauncher.addEventListener('click', openChat);
document.getElementById('closeChat').addEventListener('click', closeChat);
document.getElementById('openChatFromCard').addEventListener('click', openChat);

document.getElementById('chatForm').addEventListener('submit', event => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-message';
  bubble.textContent = value;
  chatBody.appendChild(bubble);
  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  const reply = document.createElement('div');
  reply.className = 'chat-bubble agent-message';
  reply.textContent = 'Thanks for reaching out! This is a preview chat. Connect a realtime backend and support inbox to receive a real agent reply.';
  window.setTimeout(() => {
    chatBody.appendChild(reply);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 650);
});
