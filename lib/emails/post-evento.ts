import { baseEmail, btn, divider, h1, h2, p, tag } from './_base'

export interface PostEventoVars {
  nombre: string
  galeria_url: string
  review_url: string
}

export function postEventoEmail(v: PostEventoVars): { subject: string; html: string } {
  const content = `
${tag('El dragón volvió a dormir')}
<div style="margin-top:16px;">
${h1('Estuviste ahí.')}
${p(`${v.nombre}, el 6 de febrero de 2027 pasó algo que no vuelve a pasar en Esquel en décadas.`)}
${p('Y vos lo viste. El anillo. El frío que llegó de golpe. La luz que cambió. El silencio que acordamos. El dragón de hierro iluminado desde el cielo.')}
${p('No hay palabras exactas para eso. Pero hay algo que se puede intentar.')}
</div>

${divider()}

${h2('Tu archivo de memoria')}
${p('La selección fotográfica del evento ya está lista. No es contenido de redes: es el racconto de lo que viviste, con criterio narrativo.')}

${btn(v.galeria_url, 'Ver galería →')}

${divider()}

${h2('Una última cosa')}
${p('Si el Eclipse del Dragón fue lo que esperabas — o más — nos ayudaría mucho saberlo. Una reseña es la forma más directa de que esto llegue a más gente que debería estar en el próximo.')}

${btn(v.review_url, 'Dejar reseña →')}

${divider()}

<div style="text-align:center;padding:8px 0;">
<p style="color:#6b7280;font-size:22px;margin:0 0 12px;">🌒</p>
${p('Gracias por haber estado. Nos vemos en el próximo dragón.', true)}
</div>
`

  return {
    subject: 'El dragón volvió a dormir · Tu archivo de memoria',
    html: baseEmail(content),
  }
}
