import { baseEmail, divider, h1, h2, p, tag, infoBox } from './_base'

export interface DiaEventoVars {
  nombre: string
  hora_encuentro: string
  punto_encuentro: string
  contacto_emergencia: string
}

export function diaEventoEmail(v: DiaEventoVars): { subject: string; html: string } {
  const content = `
${tag('Hoy es el día')}
<div style="margin-top:16px;">
${h1('El dragón celeste devora el sol hoy.')}
${p(`${v.nombre}, hoy es el 6 de febrero de 2027.`)}
${p('En pocas horas, la Cabeza del Dragón estará exactamente sobre Esquel. Y en Pueblo Carao, el dragón de hierro va a estar ahí, mirando arriba.')}
</div>

${divider()}

${h2('Dónde y cuándo')}

${infoBox([
  ['Hora de encuentro', v.hora_encuentro],
  ['Punto de encuentro', v.punto_encuentro],
  ['Anillo de fuego', '11:52 hs (exacto)'],
  ['Duración del anillo', '7 minutos'],
])}

${divider()}

${h2('Lo que va a pasar')}

<table cellpadding="0" cellspacing="0" border="0" width="100%">
${[
  ['9:00', 'Bienvenida y kit del asistente'],
  ['9:30', 'Desayuno · Galletas Eclipse'],
  ['10:15', 'Presentación de 20 minutos'],
  ['11:30', 'Inicio de la fase parcial'],
  ['11:52', '🌑 El anillo de fuego — 7 minutos'],
  ['12:10', 'Sol Fest · Celebración'],
].map(([time, event]) => `
<tr>
<td style="padding:8px 0;vertical-align:top;color:${time.includes('11:52') ? '#dc2626' : '#6b7280'};font-size:13px;font-weight:700;width:60px;font-family:monospace;border-bottom:1px solid #1e1e2e;">${time}</td>
<td style="padding:8px 0;padding-left:12px;vertical-align:top;color:${time.includes('11:52') ? '#ffffff' : '#d1d5db'};font-size:13px;border-bottom:1px solid #1e1e2e;font-weight:${time.includes('11:52') ? '700' : '400'};">${event}</td>
</tr>`).join('')}
</table>

${divider()}

${h2('Contacto del día')}
${p(`Si necesitás comunicarte durante el evento, el número de referencia es <strong style="color:#ffffff;">${v.contacto_emergencia}</strong>.`)}

${divider()}

<div style="background-color:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2);border-radius:10px;padding:20px;margin:0;">
${p('<strong style="color:#ffffff;">Recordatorio esencial:</strong> Los 7 minutos del anillo son el momento. Sin teléfono, sin fotos obligatorias, sin conversación. Solo mirar.')}
</div>

<div style="margin-top:24px;">
${p('Nos vemos en Pueblo Carao.', true)}
</div>
`

  return {
    subject: 'Hoy es el día · Eclipse del Dragón 2027',
    html: baseEmail(content),
  }
}
