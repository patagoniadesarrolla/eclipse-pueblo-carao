import { baseEmail, btn, divider, h1, h2, p, tag, infoBox } from './_base'

export interface Preparacion7dVars {
  nombre: string
  fecha_evento: string
  hora_encuentro: string
  punto_encuentro: string
  checklist_url: string
}

export function preparacion7dEmail(v: Preparacion7dVars): { subject: string; html: string } {
  const content = `
${tag('7 días · Instrucciones finales')}
<div style="margin-top:16px;">
${h1('Última semana.')}
${p(`${v.nombre}, en 7 días el anillo de fuego pasa sobre Esquel.`)}
${p('Este es el mail de las instrucciones concretas. Dónde, cuándo, qué traer.')}
</div>

${divider()}

${h2('Punto de encuentro')}

${infoBox([
  ['Fecha', v.fecha_evento],
  ['Hora de encuentro', v.hora_encuentro],
  ['Lugar', v.punto_encuentro],
  ['Duración estimada', 'Desde el desayuno hasta el Sol Fest (~6 horas)'],
])}

${divider()}

${h2('Qué llevar')}

<table cellpadding="0" cellspacing="0" border="0" width="100%">
${[
  ['☀️', 'Anteojos de eclipse certificados', 'Obligatorios para la fase parcial. Los proveemos en el kit del asistente.'],
  ['🧥', 'Abrigo de montaña', 'El frío llega con la sombra del eclipse. Incluso en verano, la temperatura baja varios grados en segundos.'],
  ['🎒', 'Mochila ligera', 'Agua, snacks, artículos personales. El desayuno y la comida principal están incluidos.'],
  ['📵', 'Teléfono cargado, pero en modo contemplación', 'Podés fotografiar el eclipse, pero los 7 minutos del anillo son para estar presente.'],
].map(([icon, item, note]) => `
<tr>
<td style="padding:8px 0;vertical-align:top;width:32px;font-size:18px;">${icon}</td>
<td style="padding:8px 0;padding-left:8px;vertical-align:top;">
<div style="color:#ffffff;font-size:13px;font-weight:700;margin-bottom:2px;">${item}</div>
<div style="color:#9ca3af;font-size:13px;line-height:1.5;">${note}</div>
</td>
</tr>`).join('')}
</table>

${divider()}

${h2('Clima esperado')}
${p('Esquel en febrero tiene días despejados. El pronóstico pico del eclipse es cielo abierto. Aun así, la Patagonia cambia rápido: el abrigo es siempre necesario después del anillo.')}

${divider()}

${h2('Tu checklist completa')}
${p('En la app encontrás el detalle completo: mapa del lugar, horarios exactos del eclipse, protocolo del día.')}

${btn(v.checklist_url, 'Ver checklist completa →')}

${p('Cualquier duda antes del evento, respondé este mail.', true)}
`

  return {
    subject: '7 días · Punto de encuentro e instrucciones finales — Eclipse del Dragón',
    html: baseEmail(content),
  }
}
