const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const whatsappAccessToken = defineSecret('WHATSAPP_ACCESS_TOKEN');
const whatsappPhoneNumberId = defineSecret('WHATSAPP_PHONE_NUMBER_ID');
const whatsappAllowedUids = defineSecret('WHATSAPP_ALLOWED_UIDS');
const graphApiVersion = 'v23.0';

const setCorsHeaders = (response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
};

const readBearerToken = (request) => {
  const authorization = String(request.get('authorization') || '');
  return authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
};

exports.sendReceiptWhatsApp = onRequest({
  region: 'southamerica-east1',
  secrets: [whatsappAccessToken, whatsappPhoneNumberId, whatsappAllowedUids],
  timeoutSeconds: 60,
  memory: '256MiB',
  maxInstances: 3
}, async (request, response) => {
  setCorsHeaders(response);
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  try {
    const idToken = readBearerToken(request);
    if (!idToken) {
      response.status(401).json({ error: 'Autenticação obrigatória.' });
      return;
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const allowedUids = whatsappAllowedUids.value()
      .split(',')
      .map((uid) => uid.trim())
      .filter(Boolean);
    if (!allowedUids.includes(decodedToken.uid)) {
      response.status(403).json({ error: 'Usuário não autorizado para enviar recibos.' });
      return;
    }

    const phone = String((request.body && request.body.phone) || '').replace(/\D/g, '');
    const fileName = String((request.body && request.body.fileName) || 'recibo.pdf')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .slice(0, 120);
    const pdfBase64 = String((request.body && request.body.pdfBase64) || '');
    if (!/^\d{10,15}$/.test(phone)) {
      response.status(400).json({ error: 'Telefone de destino inválido.' });
      return;
    }
    if (!pdfBase64 || pdfBase64.length > 10 * 1024 * 1024) {
      response.status(400).json({ error: 'PDF ausente ou acima do limite permitido.' });
      return;
    }

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    if (pdfBuffer.length < 5 || pdfBuffer.subarray(0, 5).toString() !== '%PDF-') {
      response.status(400).json({ error: 'Arquivo PDF inválido.' });
      return;
    }

    const accessToken = whatsappAccessToken.value();
    const phoneNumberId = whatsappPhoneNumberId.value();
    const mediaForm = new FormData();
    mediaForm.append('messaging_product', 'whatsapp');
    mediaForm.append('type', 'application/pdf');
    mediaForm.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), fileName);

    const mediaResponse = await fetch(`https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: mediaForm
    });
    const mediaResult = await mediaResponse.json();
    if (!mediaResponse.ok || !mediaResult.id) {
      console.error('Falha no upload de mídia para WhatsApp:', mediaResult);
      response.status(502).json({ error: 'A Meta recusou o upload do PDF.' });
      return;
    }

    const messageResponse = await fetch(`https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: 'document',
        document: {
          id: mediaResult.id,
          filename: fileName,
          caption: 'Recibo de Pagamento'
        }
      })
    });
    const messageResult = await messageResponse.json();
    if (!messageResponse.ok || !messageResult.messages || !messageResult.messages[0]) {
      console.error('Falha no envio de documento pelo WhatsApp:', messageResult);
      response.status(502).json({ error: 'A Meta recusou o envio do PDF.' });
      return;
    }

    response.status(200).json({
      ok: true,
      messageId: messageResult.messages[0].id
    });
  } catch (error) {
    console.error('Erro ao enviar recibo pelo WhatsApp:', error);
    response.status(500).json({ error: 'Falha interna ao enviar o recibo.' });
  }
});

const escapeHtml = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatDateBrFromIso = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(iso || '');
};

const renderConfirmationPage = ({ title, message, details, actions, tone }) => {
  const toneColor = tone === 'success' ? '#15803d' : tone === 'danger' ? '#b91c1c' : '#4f46e5';
  const detailsHtml = details
    ? `<div style="background:#f8fafc;border-radius:12px;padding:16px 18px;margin:20px 0;text-align:left;color:#1e293b;font-size:15px;line-height:1.6;">${details}</div>`
    : '';
  const actionsHtml = (actions || []).map((action) => `
    <a href="${action.href}" style="display:block;width:100%;box-sizing:border-box;margin:10px 0;padding:14px 18px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;text-align:center;background:${action.background};color:${action.color};">${escapeHtml(action.label)}</a>
  `).join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confirmação de consulta</title>
</head>
<body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <div style="max-width:420px;margin:0 auto;padding:32px 20px;">
    <div style="background:#ffffff;border-radius:16px;padding:28px 24px;box-shadow:0 8px 24px rgba(15,23,42,0.08);text-align:center;">
      <h1 style="margin:0 0 8px;font-size:20px;color:${toneColor};">${escapeHtml(title)}</h1>
      <p style="margin:0;color:#334155;font-size:15px;line-height:1.5;">${escapeHtml(message)}</p>
      ${detailsHtml}
      ${actionsHtml}
    </div>
  </div>
</body>
</html>`;
};

exports.confirmarAgendamento = onRequest({
  region: 'southamerica-east1',
  timeoutSeconds: 30,
  memory: '128MiB',
  maxInstances: 5
}, async (request, response) => {
  response.set('Content-Type', 'text/html; charset=utf-8');

  if (request.method !== 'GET') {
    response.status(405).send(renderConfirmationPage({
      title: 'Método não permitido',
      message: 'Esta página só aceita acesso normal pelo navegador.',
      tone: 'danger'
    }));
    return;
  }

  const appointmentId = String(request.query.id || '').trim();
  const token = String(request.query.token || '').trim();
  const action = String(request.query.action || '').trim();

  if (!appointmentId || !token) {
    response.status(400).send(renderConfirmationPage({
      title: 'Link inválido',
      message: 'Este link de confirmação está incompleto. Peça ao consultório para enviar novamente.',
      tone: 'danger'
    }));
    return;
  }

  try {
    const db = getFirestore();
    const docRef = db.collection('appointments').doc(appointmentId);
    let doc = await docRef.get();

    // O envio da confirmação salva o token localmente e abre o WhatsApp na hora, mas o
    // push para o Firestore acontece em segundo plano (não é aguardado, para não travar
    // o gesto do usuário que abre a janela do WhatsApp). Se o link for clicado quase
    // imediatamente após o envio, o documento pode ainda não refletir o token novo —
    // espera um pouco e tenta de novo antes de declarar o link inválido.
    for (let attempt = 0; attempt < 5 && (!doc.exists || String(doc.data().confirmationToken || '') !== token); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      doc = await docRef.get();
    }

    if (!doc.exists || String(doc.data().confirmationToken || '') !== token) {
      response.status(404).send(renderConfirmationPage({
        title: 'Link inválido ou expirado',
        message: 'Não encontramos essa consulta ou o link já não é mais válido. Peça ao consultório para enviar um novo link.',
        tone: 'danger'
      }));
      return;
    }

    const appointment = doc.data();
    const detailsHtml = [
      `<strong>${escapeHtml(appointment.clientName || 'Cliente')}</strong>`,
      `Data: ${escapeHtml(formatDateBrFromIso(appointment.date))}`,
      `Horário: ${escapeHtml(appointment.time || '--:--')}`,
      `Procedimento: ${escapeHtml(appointment.procedure || 'Consulta')}`
    ].join('<br>');

    if (action === 'confirmado' || action === 'nao_confirmado') {
      await docRef.set({
        confirmationStatus: action,
        confirmationRespondedAt: new Date().toISOString()
      }, { merge: true });

      const isConfirmed = action === 'confirmado';
      response.status(200).send(renderConfirmationPage({
        title: isConfirmed ? 'Presença confirmada!' : 'Resposta registrada',
        message: isConfirmed
          ? 'Obrigado por confirmar. Te esperamos na data marcada!'
          : 'Obrigado por avisar. O consultório foi notificado que você não poderá comparecer.',
        details: detailsHtml,
        tone: isConfirmed ? 'success' : 'neutral',
        actions: [{
          href: `?id=${encodeURIComponent(appointmentId)}&token=${encodeURIComponent(token)}&action=${isConfirmed ? 'nao_confirmado' : 'confirmado'}`,
          label: isConfirmed ? 'Errei, na verdade não poderei ir' : 'Errei, na verdade posso confirmar',
          background: '#f1f5f9',
          color: '#334155'
        }]
      }));
      return;
    }

    const currentStatus = String(appointment.confirmationStatus || 'pendente');
    const statusNote = currentStatus === 'confirmado'
      ? '<p style="color:#15803d;font-weight:700;margin:0 0 8px;">Você já confirmou presença.</p>'
      : currentStatus === 'nao_confirmado'
        ? '<p style="color:#b91c1c;font-weight:700;margin:0 0 8px;">Você já avisou que não poderá ir.</p>'
        : '';

    response.status(200).send(renderConfirmationPage({
      title: 'Confirmação de consulta',
      message: 'Você poderá comparecer na consulta abaixo?',
      details: statusNote + detailsHtml,
      tone: 'neutral',
      actions: [
        {
          href: `?id=${encodeURIComponent(appointmentId)}&token=${encodeURIComponent(token)}&action=confirmado`,
          label: 'Confirmar presença',
          background: '#dcfce7',
          color: '#15803d'
        },
        {
          href: `?id=${encodeURIComponent(appointmentId)}&token=${encodeURIComponent(token)}&action=nao_confirmado`,
          label: 'Não poderei ir',
          background: '#fee2e2',
          color: '#b91c1c'
        }
      ]
    }));
  } catch (error) {
    console.error('Erro ao processar confirmação de agendamento:', error);
    response.status(500).send(renderConfirmationPage({
      title: 'Erro interno',
      message: 'Não foi possível processar sua resposta agora. Tente novamente em alguns minutos.',
      tone: 'danger'
    }));
  }
});
