export function baseEmail(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Eclipse · Pueblo Carao 2027</title>
</head>
<body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

<!-- HEADER -->
<tr><td style="padding-bottom:28px;text-align:center;">
<table cellpadding="0" cellspacing="0" border="0" align="center">
<tr>
<td style="padding-right:10px;vertical-align:middle;font-size:22px;line-height:1;">🌒</td>
<td style="vertical-align:middle;">
<div style="color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;line-height:1.4;">Eclipse · Pueblo Carao</div>
<div style="color:#dc2626;font-size:11px;font-weight:600;letter-spacing:0.15em;margin-top:2px;">6 DE FEBRERO · 2027</div>
</td>
</tr>
</table>
</td></tr>

<!-- CONTENT -->
<tr><td style="background-color:#0d0d14;border-radius:16px;border:1px solid #1e1e2e;padding:40px 32px;">
${content}
</td></tr>

<!-- FOOTER -->
<tr><td style="padding-top:28px;text-align:center;">
<p style="color:#374151;font-size:12px;margin:0 0 6px;line-height:1.6;">Recibiste este email porque compraste una entrada para Eclipse · Pueblo Carao 2027.</p>
<p style="color:#374151;font-size:12px;margin:0;line-height:1.6;">
<a href="mailto:hola@pueblocarao.com" style="color:#6d28d9;text-decoration:none;">hola@pueblocarao.com</a>
&nbsp;·&nbsp;
<a href="#" style="color:#4b5563;text-decoration:none;">Cancelar suscripción</a>
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export function btn(url: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr><td style="border-radius:8px;background-color:#7c3aed;">
<a href="${url}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.05em;border-radius:8px;">${label}</a>
</td></tr>
</table>`
}

export function divider(): string {
  return `<div style="border-top:1px solid #1e1e2e;margin:28px 0;"></div>`
}

export function h1(text: string): string {
  return `<h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 8px;line-height:1.2;letter-spacing:-0.02em;">${text}</h1>`
}

export function h2(text: string): string {
  return `<h2 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 8px;letter-spacing:0.02em;text-transform:uppercase;">${text}</h2>`
}

export function p(text: string, muted = false): string {
  const color = muted ? '#9ca3af' : '#d1d5db'
  return `<p style="color:${color};font-size:15px;line-height:1.7;margin:0 0 16px;">${text}</p>`
}

export function tag(text: string): string {
  return `<span style="display:inline-block;background-color:rgba(220,38,38,0.12);color:#dc2626;border:1px solid rgba(220,38,38,0.3);border-radius:20px;padding:3px 12px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">${text}</span>`
}

export function infoBox(rows: [string, string][]): string {
  const rowsHtml = rows.map(([k, v]) => `
<tr>
<td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #1e1e2e;width:40%;">${k}</td>
<td style="padding:10px 16px;color:#ffffff;font-size:13px;font-weight:600;border-bottom:1px solid #1e1e2e;">${v}</td>
</tr>`).join('')
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080811;border-radius:10px;border:1px solid #1e1e2e;margin:20px 0;">
${rowsHtml}
</table>`
}

export function credBox(email: string, password: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080811;border-radius:10px;border:1px solid #1e1e2e;margin:20px 0;">
<tr><td style="padding:16px 20px;border-bottom:1px solid #1e1e2e;">
<div style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Email</div>
<div style="color:#ffffff;font-size:14px;font-family:monospace;">${email}</div>
</td></tr>
<tr><td style="padding:16px 20px;">
<div style="color:#6b7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Contraseña temporal</div>
<div style="color:#a78bfa;font-size:18px;font-family:monospace;font-weight:700;letter-spacing:0.1em;">${password}</div>
</td></tr>
</table>`
}
