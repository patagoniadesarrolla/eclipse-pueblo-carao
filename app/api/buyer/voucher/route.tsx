import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import QRCode from 'qrcode'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#050508',
    padding: 48,
    fontFamily: 'Helvetica',
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tagline: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#dc2626',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  eventName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  eventSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
  },
  badge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.4)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 8,
    color: '#a78bfa',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  buyerName: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  buyerEmail: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 16,
  },
  infoLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  qrWrapper: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
  },
  qrImage: {
    width: 100,
    height: 100,
  },
  qrText: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  qrDescription: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  qrOrderId: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#a78bfa',
    letterSpacing: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.2)',
  },
})

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orderId = req.nextUrl.searchParams.get('order_id')
  if (!orderId) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('buyer_profiles')
    .select('name, email')
    .eq('user_id', user.id)
    .single()

  const displayName = profile?.name ?? order.buyer_name ?? 'Comprador'
  const displayEmail = profile?.email ?? order.buyer_email ?? ''
  const shortId = orderId.slice(0, 8).toUpperCase()
  const qrUrl = `https://pueblocarao.com/check/${orderId}`

  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#050508', light: '#ffffff' },
  })

  const purchaseDate = new Date(order.created_at).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const doc = (
    <Document title={`Voucher Eclipse Pueblo Carao - ${shortId}`} author="Pueblo Carao">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.tagline}>Evento astronómico</Text>
            <Text style={styles.eventName}>Eclipse Pueblo Carao</Text>
            <Text style={styles.eventSub}>6 de febrero de 2027 · Patagonia, Argentina</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Entrada confirmada</Text>
          </View>
        </View>

        {/* Buyer info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Comprador</Text>
          <Text style={styles.buyerName}>{displayName}</Text>
          <Text style={styles.buyerEmail}>{displayEmail}</Text>
        </View>

        {/* Info grid */}
        <View style={[styles.section, styles.infoGrid]}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha del evento</Text>
            <Text style={styles.infoValue}>6 Feb 2027</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Totalidad</Text>
            <Text style={styles.infoValue}>11:52 hs (local)</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Monto pagado</Text>
            <Text style={styles.infoValue}>USD ${order.amount_usd}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fecha de compra</Text>
            <Text style={styles.infoValue}>{purchaseDate}</Text>
          </View>
        </View>

        {/* QR */}
        <View style={styles.qrSection}>
          <View style={styles.qrWrapper}>
            <Image src={qrDataUrl} style={styles.qrImage} />
          </View>
          <View style={styles.qrText}>
            <Text style={styles.qrTitle}>Código de acceso</Text>
            <Text style={styles.qrDescription}>
              Presentá este código en la entrada del evento. El QR es único e intransferible y
              está vinculado a tu reserva.
            </Text>
            <Text style={styles.qrOrderId}>{shortId}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>pueblocarao.com · hola@pueblocarao.com</Text>
          <Text style={styles.footerText}>Orden #{shortId}</Text>
        </View>
      </Page>
    </Document>
  )

  const buffer = await renderToBuffer(doc)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="voucher-eclipse-${shortId}.pdf"`,
    },
  })
}
