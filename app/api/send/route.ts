import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, cc, bcc, subject, message, isHtml } = body

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      )
    }

    const fromEmail = process.env.FROM_EMAIL
    const fromName = process.env.FROM_NAME

    if (!fromEmail) {
      return NextResponse.json(
        { error: 'FROM_EMAIL environment variable not configured' },
        { status: 500 }
      )
    }

    const fromField = fromName ? `${fromName} <${fromEmail}>` : fromEmail

    // Parse comma-separated emails
    const toAddresses = to.split(',').map((e: string) => e.trim()).filter(Boolean)
    const ccAddresses = cc ? cc.split(',').map((e: string) => e.trim()).filter(Boolean) : undefined
    const bccAddresses = bcc ? bcc.split(',').map((e: string) => e.trim()).filter(Boolean) : undefined

    const emailPayload: Record<string, unknown> = {
      from: fromField,
      to: toAddresses,
      subject,
      ...(isHtml ? { html: message } : { text: message }),
      ...(ccAddresses?.length ? { cc: ccAddresses } : {}),
      ...(bccAddresses?.length ? { bcc: bccAddresses } : {}),
    }

    const { data, error } = await resend.emails.send(emailPayload as never)

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
