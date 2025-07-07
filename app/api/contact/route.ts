import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
  apiKey: '14840d88f2e170023a15fc4c23fd3c7c',
  apiSecret: '15a104344685950f78fc17de28a3faa1'
});

export async function POST(request: Request) {
  try {
    const { nom, prenom, email, telephone, objet, message, recaptchaToken } = await request.json();

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LeqLG0rAAAAAIEzStfl-hittuwFdmowhmL_w7yJ&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    
    const recaptchaData = await recaptchaResponse.json();
    
    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'Veuillez cocher le captcha !' },
        { status: 400 }
      );
    }

    const emailContent = `
      <h3>Nouveau message depuis le formulaire de contact</h3>
      <p><strong>Nom:</strong> ${nom}</p>
      <p><strong>Prénom:</strong> ${prenom}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${telephone}</p>
      <p><strong>Objet:</strong> ${objet}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'noreply@imagin-action.fr',
            Name: 'Imagin Action'
          },
          To: [
            {
              Email: 'cabinet@cabinet-michou.com',
              Name: 'Alexandre Baboz'
            }
          ],
          Subject: 'Contact site Internet',
          HTMLPart: emailContent,
          TextPart: `
Bonjour,
Un internaute a laissé un message sur le formulaire de contact du site Internet.

Nom: ${nom}
Prénom: ${prenom}
Email: ${email}
Téléphone: ${telephone}
Objet: ${objet}
Message: ${message}
          `
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
