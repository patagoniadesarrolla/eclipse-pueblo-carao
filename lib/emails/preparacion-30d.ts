import { baseEmail, btn, divider, h1, h2, p, tag, infoBox } from './_base'

export interface Preparacion30dVars {
  nombre: string
  fecha_evento: string
  checklist_url: string
}

export function preparacion30dEmail(v: Preparacion30dVars): { subject: string; html: string } {
  const content = `
${tag('30 días para el eclipse')}
<div style="margin-top:16px;">
${h1('Un mes. El dragón se acerca.')}
${p(`${v.nombre}, falta exactamente un mes.`)}
${p('El 6 de febrero de 2027, la Cabeza del Dragón estará sobre Esquel. Lo que va a pasar en el cielo ese día no vuelve a pasar en el mismo lugar en décadas. Y vos ya tenés tu lugar.')}
</div>

${divider()}

${h2('Tu checklist de preparación')}
${p('En la app encontrás todo lo que necesitás hacer antes del evento: desde la logística del viaje hasta el contexto del eclipse. Hecho para que llegues sabiendo qué va a pasar y por qué importa.')}

${btn(v.checklist_url, 'Ver mi checklist →')}

${divider()}

${h2('Esta semana, leer')}

<table cellpadding="0" cellspacing="0" border="0" width="100%">
${[
  ['🐉', 'El mito del dragón celeste', 'Por qué los babilonios, los indios y los medievales llamaban al nodo lunar "Cabeza del Dragón". La astronomía moderna cambió el mito por la geometría, pero conservó el nombre.'],
  ['🔭', 'La física del eclipse anular', 'Por qué se forma el anillo, por qué dura exactamente lo que dura, qué cambia en el ambiente. La diferencia entre verlo y entenderlo.'],
].map(([icon, title, desc]) => `
<tr>
<td style="padding:10px 0;vertical-align:top;width:32px;font-size:18px;">${icon}</td>
<td style="padding:10px 0;padding-left:8px;vertical-align:top;">
<div style="color:#ffffff;font-size:13px;font-weight:700;margin-bottom:4px;">${title}</div>
<div style="color:#9ca3af;font-size:13px;line-height:1.6;">${desc}</div>
</td>
</tr>`).join('')}
</table>

${divider()}

${infoBox([
  ['Evento', 'Eclipse del Dragón'],
  ['Fecha', v.fecha_evento],
  ['Lugar', 'Pueblo Carao · Esquel, Chubut'],
])}

${p('El siguiente mail llega 7 días antes, con el punto de encuentro y las instrucciones finales.', true)}
`

  return {
    subject: '30 días para el Eclipse del Dragón · Tu checklist de preparación',
    html: baseEmail(content),
  }
}
