import { baseEmail, btn, divider, h1, h2, p, tag, credBox, infoBox } from './_base'

export interface BienvenidaVars {
  nombre: string
  email: string
  password_temporal: string
  fecha_evento: string
  url_app: string
}

export function bienvenidaEmail(v: BienvenidaVars): { subject: string; html: string } {
  const content = `
${tag('Confirmación de compra')}
<div style="margin-top:16px;">
${h1(`Bienvenid@, ${v.nombre}.`)}
${p('Tu lugar está confirmado. El 6 de febrero de 2027, la Cabeza del Dragón estará sobre Esquel — y vos vas a estar ahí.')}
</div>

${divider()}

${h2('Tu acceso a la app')}
${p('Creamos tu cuenta en <strong style="color:#ffffff;">Mi Experiencia</strong>, donde vas a encontrar toda la información del evento, la checklist de preparación y las actualizaciones previas.')}

${credBox(v.email, v.password_temporal)}

${btn(v.url_app, 'Ingresar a Mi Experiencia →')}

<p style="color:#6b7280;font-size:12px;margin:0 0 24px;">Podés cambiar la contraseña desde la app en cualquier momento.</p>

${divider()}

${h2('Qué viene ahora')}

<table cellpadding="0" cellspacing="0" border="0" width="100%">
${[
  ['📬', 'Mail de bienvenida', 'Este que estás leyendo. El primero de cinco.'],
  ['📖', '4 entregas de contenido', 'Una pieza por mes: el mito, la física, la historia, las instrucciones.'],
  ['📋', 'Brief del evento', '7 días antes: hora exacta, punto de encuentro, qué llevar.'],
  ['🌑', 'El 6 de febrero', 'Los 7 minutos del anillo de fuego. El dragón de hierro. El silencio acordado.'],
  ['📷', 'Archivo de memoria', '48 horas después: un texto y una selección fotográfica.'],
].map(([icon, title, desc]) => `
<tr>
<td style="padding:8px 0;vertical-align:top;width:32px;font-size:18px;">${icon}</td>
<td style="padding:8px 0;padding-left:8px;vertical-align:top;">
<div style="color:#ffffff;font-size:13px;font-weight:700;margin-bottom:2px;">${title}</div>
<div style="color:#9ca3af;font-size:13px;line-height:1.5;">${desc}</div>
</td>
</tr>`).join('')}
</table>

${divider()}

${infoBox([
  ['Evento', 'Eclipse del Dragón'],
  ['Lugar', 'Pueblo Carao · Esquel, Patagonia'],
  ['Fecha', v.fecha_evento],
  ['Cupos', '40 personas máximo'],
])}

${p('Cualquier pregunta, respondé este email.', true)}
`

  return {
    subject: 'Bienvenid@ al Eclipse del Dragón · Tu acceso está listo',
    html: baseEmail(content),
  }
}
