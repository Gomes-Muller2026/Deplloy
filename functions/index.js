const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

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
