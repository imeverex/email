'use client'

import { useState, useRef } from 'react'
import styles from './page.module.css'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Home() {
  const [to, setTo] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isHtml, setIsHtml] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sentId, setSentId] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !message.trim()) return

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, cc, bcc, subject, message, isHtml }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      setSentId(data.id || '')
      setStatus('success')

      // Reset after 4s
      setTimeout(() => {
        setStatus('idle')
        setTo('')
        setCc('')
        setBcc('')
        setSubject('')
        setMessage('')
        setIsHtml(false)
        setShowCc(false)
        setShowBcc(false)
        setSentId('')
      }, 4000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const isValid = to.trim() && subject.trim() && message.trim()

  return (
    <main className={styles.main}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className={styles.logoText}>send<span className={styles.logoAccent}>mail</span></span>
          <div className={styles.badge}>custom domain</div>
        </header>

        {/* Composer */}
        <div className={styles.composer} ref={formRef}>
          {/* Fields */}
          <div className={styles.fields}>
            {/* To */}
            <div className={styles.fieldRow}>
              <label className={styles.label}>To</label>
              <input
                className={styles.input}
                type="text"
                placeholder="recipient@example.com, another@example.com"
                value={to}
                onChange={e => setTo(e.target.value)}
                disabled={status === 'sending'}
              />
              <div className={styles.fieldActions}>
                {!showCc && (
                  <button className={styles.toggleBtn} onClick={() => setShowCc(true)}>Cc</button>
                )}
                {!showBcc && (
                  <button className={styles.toggleBtn} onClick={() => setShowBcc(true)}>Bcc</button>
                )}
              </div>
            </div>

            {/* CC */}
            {showCc && (
              <div className={styles.fieldRow}>
                <label className={styles.label}>Cc</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="cc@example.com"
                  value={cc}
                  onChange={e => setCc(e.target.value)}
                  disabled={status === 'sending'}
                  autoFocus
                />
                <button className={styles.removeBtn} onClick={() => { setShowCc(false); setCc('') }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* BCC */}
            {showBcc && (
              <div className={styles.fieldRow}>
                <label className={styles.label}>Bcc</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="bcc@example.com"
                  value={bcc}
                  onChange={e => setBcc(e.target.value)}
                  disabled={status === 'sending'}
                  autoFocus
                />
                <button className={styles.removeBtn} onClick={() => { setShowBcc(false); setBcc('') }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Divider */}
            <div className={styles.divider} />

            {/* Subject */}
            <div className={styles.fieldRow}>
              <label className={styles.label}>Subject</label>
              <input
                className={`${styles.input} ${styles.subjectInput}`}
                type="text"
                placeholder="What's this about?"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={status === 'sending'}
              />
            </div>
          </div>

          {/* Message */}
          <div className={styles.messageArea}>
            <textarea
              className={styles.textarea}
              placeholder={isHtml
                ? '<p>Write your <strong>HTML email</strong> here…</p>'
                : 'Write your message here…'
              }
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={status === 'sending'}
            />
          </div>

          {/* Footer toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                className={`${styles.modeToggle} ${isHtml ? styles.modeActive : ''}`}
                onClick={() => setIsHtml(!isHtml)}
                title="Toggle HTML mode"
              >
                <span className={styles.toggleLabel}>
                  {isHtml ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M3 4L1 6.5L3 9M10 4l2 2.5-2 2.5M7.5 2l-2 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      HTML
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 3.5h9M2 6.5h6M2 9.5h7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      Plain
                    </>
                  )}
                </span>
              </button>
            </div>

            <div className={styles.toolbarRight}>
              {status === 'success' && (
                <div className={styles.successMsg}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 3" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sent{sentId && <span className={styles.sentId}> · {sentId.slice(0, 8)}…</span>}
                </div>
              )}

              {status === 'error' && (
                <div className={styles.errorMsg}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="var(--error)" strokeWidth="1.2"/>
                    <path d="M7 4v3.5M7 9.5v.5" stroke="var(--error)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {errorMsg}
                </div>
              )}

              <button
                className={`${styles.sendBtn} ${status === 'sending' ? styles.sending : ''}`}
                onClick={handleSend}
                disabled={!isValid || status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span className={styles.spinner} />
                    Sending…
                  </>
                ) : (
                  <>
                    Send
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className={styles.footerNote}>
          Powered by <a href="https://resend.com" target="_blank" rel="noopener noreferrer">Resend</a>
          {' · '}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a>
        </p>
      </div>
    </main>
  )
}
