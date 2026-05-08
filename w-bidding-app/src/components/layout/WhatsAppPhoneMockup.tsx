import { Smartphone } from 'lucide-react'

interface WhatsAppPhoneMockupProps {
  body?: string
  footer?: string
  accountName?: string
  buttons?: string[]
}

export function WhatsAppPhoneMockup({
  body,
  footer,
  accountName = 'Test - WABA Account',
  buttons,
}: WhatsAppPhoneMockupProps) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      width: 200,
      flexShrink: 0,
      borderRadius: 32,
      border: '7px solid #1c1c1e',
      background: '#1c1c1e',
      boxShadow: '0 24px 56px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 64, height: 20, background: '#1c1c1e',
        borderRadius: '0 0 14px 14px', zIndex: 10,
      }} />

      {/* Screen */}
      <div style={{
        borderRadius: 26, overflow: 'hidden', height: 420,
        display: 'flex', flexDirection: 'column', background: 'white',
      }}>
        {/* WhatsApp header */}
        <div style={{ background: '#075E54', paddingTop: 24, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 10px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)', flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 10, fontWeight: 600, color: 'white',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{accountName}</p>
              <p style={{ fontSize: 8, color: '#a7f3d0' }}>online</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, background: '#ECE5DD', padding: 8, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          justifyContent: body ? 'flex-start' : 'center',
          alignItems: body ? 'flex-start' : 'center',
        }}>
          {body ? (
            <div style={{
              background: 'white', borderRadius: '0 8px 8px 8px',
              padding: '6px 8px', maxWidth: '90%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}>
              <p style={{ fontSize: 10, color: '#111', lineHeight: 1.45, wordBreak: 'break-word' }}>
                {body}
              </p>
              {footer && (
                <p style={{ fontSize: 9, color: '#888', marginTop: 3 }}>{footer}</p>
              )}
              {buttons && buttons.length > 0 && (
                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 5, paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {buttons.map((btn, i) => (
                    <p key={i} style={{ fontSize: 9, color: '#53bdeb', fontWeight: 500, textAlign: 'center', padding: '1px 0' }}>
                      {btn}
                    </p>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 8, color: '#aaa', textAlign: 'right', marginTop: 3 }}>{time} ✓✓</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.3 }}>
              <Smartphone style={{ width: 22, height: 22 }} />
              <span style={{ fontSize: 9 }}>Preview appears here</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{
          background: '#f0f2f5', padding: '6px 8px',
          display: 'flex', alignItems: 'center', gap: 6,
          borderTop: '1px solid #e5e7eb', flexShrink: 0,
        }}>
          <div style={{
            flex: 1, background: 'white', borderRadius: 20,
            padding: '4px 10px', fontSize: 9, color: '#bbb',
          }}>
            Type a message
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: '#25D366', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 11 }}>🎤</span>
          </div>
        </div>
      </div>
    </div>
  )
}
