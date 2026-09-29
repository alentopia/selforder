// screens-auth.jsx — Entry (scan sim), Phone login (at checkout), OTP. Exported to window.
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

// ── Numeric keypad ─────────────────────────────────────────
function NumPad({ onKey, onBack }) {
  const t = useTheme();
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '8px 18px calc(14px + env(safe-area-inset-bottom))' }}>
      {keys.map((k, i) => {
        if (k === '') return <div key={i} />;
        const isDel = k === 'del';
        return (
          <button key={i} onClick={() => isDel ? onBack() : onKey(k)} style={{
            height: 56, borderRadius: 16, border: 'none', cursor: 'pointer',
            background: t.surface, boxShadow: t.shadow, color: t.ink,
            fontFamily: t.fontBody, fontSize: 24, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent'
          }}>
            {isDel ? <Icon name="back" size={22} /> : k}
          </button>);

      })}
    </div>);

}

// ── Entry / scan simulation ────────────────────────────────
function EntryScreen() {
  const t = useTheme();
  const app = useApp();
  // MVP: hanya QR Statis. Kartu ini = stiker QR di meja (Figma node 1605:37560);
  // ketuk kartu untuk mensimulasikan scan. Nomor meja dari QR_TABLE (data.jsx).
  const fira = "'Fira Sans', " + t.fontBody;
  const line = <img src="assets/qr-card-line.svg" alt="" width={240} height={1} style={{ display: 'block' }} />;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bgTint }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 8px' }}>
        <button onClick={() => app.startSession('static', 'Meja ' + QR_TABLE)} aria-label={'Scan QR meja ' + QR_TABLE} style={{
          width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0',
          background: '#fff', border: '1px dashed #000', borderRadius: 8, cursor: 'pointer',
          fontFamily: fira, textAlign: 'center', WebkitTapHighlightColor: 'transparent'
        }}>
          <div style={{ width: '100%', fontSize: 12, color: '#303030' }}>Scan QR Code</div>
          <img src="assets/qr-meja.png" alt="" width={180} height={180} style={{ display: 'block', borderRadius: 4 }} />
          <div style={{ width: '100%', paddingBottom: 16, fontSize: 16, fontWeight: 500, color: '#0b0b0b' }}>Table : {QR_TABLE.replace('-', ' - ')}</div>
          {line}
          <div style={{ width: '100%', padding: '8px 0', fontSize: 12, color: '#303030' }}>{BRAND.name}</div>
          {line}
          <div style={{ width: '100%', paddingTop: 24, fontSize: 12, color: '#303030' }}>Powered by Accurate POS</div>
        </button>
      </div>
      <div style={{ textAlign: 'center', padding: '4px 0 calc(14px + env(safe-area-inset-bottom))', color: t.faint, fontSize: 11 }}>Prototype · ketuk kartu QR untuk mensimulasikan scan</div>
    </div>);

}

// ── Phone — shown at checkout, not at entry ─────────────────
// params.next        : screen to go after OTP ('processing' | 'submitAndBill')
// params.nextParams  : extra params forwarded to that screen (e.g. { settle, amount })
function PhoneScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const [num, setNum] = useStateA('');
  const valid = num.length >= 9;

  const next = params && params.next || 'processing';
  const nextParams = params && params.nextParams || {};

  const fmt = (s) => {
    const a = s.slice(0, 3),b = s.slice(3, 7),c = s.slice(7, 12);
    return [a, b, c].filter(Boolean).join(' ');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar onBack={app.back} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: t.primarySoft, color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <Icon name="phone" size={26} />
        </div>
        <h1 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 30, color: t.ink, lineHeight: 1.12 }}>Nomor HP kamu</h1>
        <p style={{ color: t.muted, fontSize: 14.5, margin: '10px 0 26px', lineHeight: 1.5 }}>Digunakan untuk menerima struk &amp; notifikasi pesanan via WhatsApp.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid ' + (valid ? t.primary : t.lineStrong), borderRadius: t.radius, padding: '0 16px', height: 60, background: t.surface, transition: 'border-color .2s' }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: t.ink }}>+62</span>
          <div style={{ width: 1, height: 26, background: t.line }} />
          <div style={{ flex: 1, fontSize: 19, fontWeight: 600, color: num ? t.ink : t.faint, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
            {num ? fmt(num) : '812 3456 7890'}
            <span style={{ display: 'inline-block', width: 2, height: 22, background: t.primary, marginLeft: 2, verticalAlign: -4, animation: 'om-blink 1s step-end infinite' }} />
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ padding: '8px 24px 4px' }}>
        <Button full disabled={!valid} onClick={() => {
          app.setPhone(num);
          app.go('otp', { next, nextParams });
        }}>Kirim Kode</Button>
        <p style={{ textAlign: 'center', color: t.faint, fontSize: 11.5, margin: '12px 0 6px', lineHeight: 1.5 }}>Dengan lanjut, kamu setuju dengan Syarat &amp; Kebijakan Privasi {BRAND.name}.</p>
      </div>
      <NumPad onKey={(k) => setNum((n) => n.length < 12 ? n + k : n)} onBack={() => setNum((n) => n.slice(0, -1))} />
    </div>);

}

// ── OTP ────────────────────────────────────────────────────
// params.next        : 'processing' | 'submitAndBill'
// params.nextParams  : forwarded to target screen
function OtpScreen({ params }) {
  const t = useTheme();
  const app = useApp();
  const [code, setCode] = useStateA('');
  const [secs, setSecs] = useStateA(28);
  const [err, setErr] = useStateA(false);
  const len = 5;

  const next = params && params.next || 'processing';
  const nextParams = params && params.nextParams || {};

  useEffectA(() => {
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);

  useEffectA(() => {
    if (code.length === len) {
      const id = setTimeout(() => {
        app.login(app.phone);
        if (next === 'submitAndBill') {
          app.submitOrder(); // navigates to 'bill' internally
        } else {
          app.go(next, { replace: true, ...nextParams });
        }
      }, 350);
      return () => clearTimeout(id);
    }
  }, [code]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <TopBar onBack={app.back} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
        <h1 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 30, color: t.ink, lineHeight: 1.12 }}>Masukkan kode</h1>
        <p style={{ color: t.muted, fontSize: 14.5, margin: '10px 0 30px', lineHeight: 1.5 }}>
          Kode 5 digit dikirim ke WhatsApp <b style={{ color: t.ink }}>+62 {app.phoneHint}</b>.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {Array.from({ length: len }).map((_, i) => {
            const filled = i < code.length;
            const active = i === code.length;
            return (
              <div key={i} style={{
                flex: 1, height: 62, borderRadius: t.radiusSm, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: t.surface, border: '1.5px solid ' + (err ? '#BE4137' : active ? t.primary : filled ? t.lineStrong : t.line),
                fontSize: 26, fontWeight: 700, color: t.ink, transition: 'border-color .15s'
              }}>
                {filled ? '•' : ''}
              </div>);

          })}
        </div>
        {err && <p style={{ color: '#BE4137', fontSize: 13, marginTop: 12 }}>Kode salah, coba lagi.</p>}

        <div style={{ marginTop: 22, fontSize: 13.5, color: t.muted }}>
          {secs > 0 ?
          <span>Kirim ulang dalam <b style={{ color: t.ink, fontVariantNumeric: 'tabular-nums' }}>0:{String(secs).padStart(2, '0')}</b></span> :
          <button onClick={() => setSecs(28)} style={{ border: 'none', background: 'none', color: t.primary, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', padding: 0 }}>Kirim ulang kode</button>}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <NumPad
        onKey={(k) => {setErr(false);setCode((c) => c.length < len ? c + k : c);}}
        onBack={() => setCode((c) => c.slice(0, -1))} />
      
    </div>);

}

// ── WhatsApp login — just-in-time gate at "Lihat Keranjang" ──
// params.next : screen to go to after success (e.g. 'cart'); omit to just close
const WA_GREEN = '#25D366';
const WA_DARK = '#0B8043';

function WhatsAppLoginSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const [phase, setPhase] = useStateA('intro'); // intro | waiting | verifying | done
  const code = useRefA(String(Math.floor(1000 + Math.random() * 9000))).current;
  const next = params && params.next;

  const msg = `Halo ${BRAND.name}! Saya mau mulai pesan mandiri. Kode verifikasi saya: ${code}`;
  const waUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;

  const openWa = () => {
    // prototype: jangan benar-benar buka WhatsApp, cukup lanjut ke tahap simulasi
    setPhase('waiting');
  };

  const confirmSent = () => {
    setPhase('verifying');
    setTimeout(() => setPhase('done'), 1200);
  };

  useEffectA(() => {
    if (phase !== 'done') return;
    const id = setTimeout(() => {
      app.login('81380012025');
      if (next) app.go(next);else app.closeSheet();
    }, 950);
    return () => clearTimeout(id);
  }, [phase]);

  const Steps = () =>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0 4px' }}>
      {[
    ['Buka WhatsApp', 'Pesan verifikasi sudah otomatis terisi — tinggal kirim.'],
    ['Kirim pesannya', 'Cukup tekan kirim di WhatsApp, tanpa ketik apa pun.'],
    ['Otomatis masuk', 'Akun kamu langsung dibuat dan kamu kembali ke sini.']].
    map(([title, sub], i) =>
    <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: hexA(WA_GREEN, 0.14), color: WA_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, fontFamily: t.fontBody }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: t.muted, marginTop: 2, lineHeight: 1.45 }}>{sub}</div>
          </div>
        </div>
    )}
    </div>;


  return (
    <Sheet onClose={app.closeSheet}>
      <div style={{ padding: '2px 2px 8px', textAlign: 'center' }}>
        {/* WA badge */}
        <div style={{
          margin: '6px auto 0', width: 72, height: 72, borderRadius: 22,
          background: phase === 'done' ? WA_GREEN : hexA(WA_GREEN, 0.12), color: phase === 'done' ? '#fff' : WA_GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: phase === 'done' ? '0 12px 30px ' + hexA(WA_GREEN, 0.4) : 'none',
          transition: 'background .3s, color .3s',
          animation: phase === 'waiting' ? 'om-pulse 1.4s ease-in-out infinite' : phase === 'done' ? 'om-pop .4s cubic-bezier(.2,.9,.3,1)' : 'none'
        }}>
          <Icon name={phase === 'done' ? 'check' : 'whatsapp'} size={phase === 'done' ? 40 : 38} color="currentColor" stroke={3} />
        </div>

        {phase === 'intro' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink, lineHeight: 1.1 }}>Masuk lewat WhatsApp</h3>
            <p style={{ margin: '8px 22px 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Simpan pesananmu &amp; terima status pesanan langsung di WhatsApp. Tanpa kata sandi.</p>
            <div style={{ textAlign: 'left' }}><Steps /></div>
          </>
        }

        {phase === 'waiting' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink, lineHeight: 1.1 }}>Tinggal kirim pesannya</h3>
            <p style={{ margin: '8px 18px 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>WhatsApp sudah terbuka dengan pesan siap kirim ke <b style={{ color: t.ink }}>{BRAND.name}</b>. Setelah terkirim, ketuk tombol di bawah.</p>
            <div style={{ margin: '18px 0 2px', padding: '12px 14px', background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radiusSm, textAlign: 'left', fontSize: 12.5, color: t.muted, lineHeight: 1.5 }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: t.faint, marginBottom: 4 }}>Pesan kamu</span>
              {msg}
            </div>
          </>
        }

        {phase === 'verifying' &&
        <>
            <div style={{ margin: '20px auto 0', width: 30, height: 30, borderRadius: 999, border: '3px solid ' + hexA(WA_GREEN, 0.2), borderTopColor: WA_GREEN, animation: 'om-spin .8s linear infinite' }} />
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 23, color: t.ink }}>Memverifikasi…</h3>
            <p style={{ margin: '6px 0 14px', fontSize: 13.5, color: t.muted }}>Membuat akunmu</p>
          </>
        }

        {phase === 'done' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink }}>Berhasil masuk!</h3>
            <p style={{ margin: '6px 0 14px', fontSize: 13.5, color: t.muted }}>Lanjut ke keranjangmu…</p>
          </>
        }
      </div>

      {phase === 'intro' &&
      <button onClick={openWa} style={{ width: '100%', border: 'none', cursor: 'pointer', background: WA_GREEN, color: '#fff', borderRadius: t.radius, padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: t.fontBody, fontSize: 15.5, fontWeight: 700, boxShadow: '0 10px 26px ' + hexA(WA_GREEN, 0.36), WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="whatsapp" size={22} color="#fff" /> Buka WhatsApp
        </button>
      }
      {phase === 'waiting' &&
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={confirmSent} style={{ width: '100%', border: 'none', cursor: 'pointer', background: WA_GREEN, color: '#fff', borderRadius: t.radius, padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: t.fontBody, fontSize: 15.5, fontWeight: 700, boxShadow: '0 10px 26px ' + hexA(WA_GREEN, 0.36), WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="check" size={20} color="#fff" stroke={2.6} /> Saya sudah kirim
          </button>
          <button onClick={openWa} style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', color: t.muted, padding: '4px', fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 600, WebkitTapHighlightColor: 'transparent' }}>Buka WhatsApp lagi</button>
        </div>
      }
      {phase === 'intro' &&
      <p style={{ textAlign: 'center', color: t.faint, fontSize: 11.5, margin: '12px 4px 2px', lineHeight: 1.5 }}>Dengan lanjut, kamu setuju dengan Syarat &amp; Kebijakan Privasi.</p>
      }
    </Sheet>);

}

// ── OTP login — same overlay as WhatsApp, beda isi (No. HP + kode) ──
function OtpLoginSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const next = params && params.next;
  const [phase, setPhase] = useStateA('phone'); // phone | otp | verifying | done
  const [num, setNum] = useStateA('');
  const [code, setCode] = useStateA('');
  const [secs, setSecs] = useStateA(28);
  const [err, setErr] = useStateA(false);
  const len = 5;
  const valid = num.length >= 9;

  const fmt = (s) => [s.slice(0, 3), s.slice(3, 7), s.slice(7, 12)].filter(Boolean).join(' ');

  useEffectA(() => {
    if (phase !== 'otp' || secs <= 0) return;
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, secs]);

  useEffectA(() => {
    if (phase === 'otp' && code.length === len) {
      const id = setTimeout(() => setPhase('verifying'), 250);
      return () => clearTimeout(id);
    }
  }, [code, phase]);

  useEffectA(() => {
    if (phase !== 'verifying') return;
    const id = setTimeout(() => setPhase('done'), 1100);
    return () => clearTimeout(id);
  }, [phase]);

  useEffectA(() => {
    if (phase !== 'done') return;
    const id = setTimeout(() => {
      app.login(num);
      if (next) app.go(next);else app.closeSheet();
    }, 850);
    return () => clearTimeout(id);
  }, [phase]);

  const sendCode = () => {app.setPhone(num);setSecs(28);setCode('');setErr(false);setPhase('otp');};

  return (
    <Sheet onClose={app.closeSheet}>
      <div style={{ padding: '2px 2px 4px', textAlign: 'center' }}>
        <div style={{
          margin: '6px auto 0', width: 72, height: 72, borderRadius: 22,
          background: phase === 'done' ? t.primary : t.primarySoft, color: phase === 'done' ? t.onPrimary : t.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: phase === 'done' ? '0 12px 30px ' + hexA(t.primary, 0.4) : 'none',
          transition: 'background .3s, color .3s',
          animation: phase === 'done' ? 'om-pop .4s cubic-bezier(.2,.9,.3,1)' : 'none'
        }}>
          <Icon name={phase === 'done' ? 'check' : phase === 'otp' ? 'whatsapp' : 'phone'} size={phase === 'done' ? 40 : 34} color="currentColor" stroke={phase === 'done' ? 3 : 2} />
        </div>

        {phase === 'phone' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink, lineHeight: 1.1 }}>Masuk dengan No. HP</h3>
            <p style={{ margin: '8px 18px 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Kami kirim kode verifikasi via WhatsApp untuk menyimpan pesanan &amp; status pesananmu.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid ' + (valid ? t.primary : t.lineStrong), borderRadius: t.radius, padding: '0 16px', height: 58, background: t.surface, transition: 'border-color .2s', margin: '18px 0 2px', textAlign: 'left' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: t.ink }}>+62</span>
              <div style={{ width: 1, height: 24, background: t.line }} />
              <div style={{ flex: 1, fontSize: 18, fontWeight: 600, color: num ? t.ink : t.faint, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>
                {num ? fmt(num) : '812 3456 7890'}
                <span style={{ display: 'inline-block', width: 2, height: 20, background: t.primary, marginLeft: 2, verticalAlign: -3, animation: 'om-blink 1s step-end infinite' }} />
              </div>
            </div>
          </>
        }

        {phase === 'otp' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink, lineHeight: 1.1 }}>Masukkan kode</h3>
            <p style={{ margin: '8px 18px 0', fontSize: 13.5, color: t.muted, lineHeight: 1.5 }}>Kode 5 digit dikirim ke <b style={{ color: t.ink }}>+62 {fmt(num)}</b>.</p>
            <div style={{ display: 'flex', gap: 9, justifyContent: 'space-between', margin: '18px 0 0' }}>
              {Array.from({ length: len }).map((_, i) => {
              const filled = i < code.length;
              const active = i === code.length;
              return (
                <div key={i} style={{ flex: 1, height: 58, borderRadius: t.radiusSm, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.surface, border: '1.5px solid ' + (err ? '#BE4137' : active ? t.primary : filled ? t.lineStrong : t.line), fontSize: 24, fontWeight: 700, color: t.ink, transition: 'border-color .15s' }}>{filled ? '•' : ''}</div>);

            })}
            </div>
            <div style={{ marginTop: 14, fontSize: 13, color: t.muted }}>
              {secs > 0 ?
            <span>Kirim ulang dalam <b style={{ color: t.ink, fontVariantNumeric: 'tabular-nums' }}>0:{String(secs).padStart(2, '0')}</b></span> :
            <button onClick={() => {setSecs(28);}} style={{ border: 'none', background: 'none', color: t.primary, fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0 }}>Kirim ulang kode</button>}
            </div>
          </>
        }

        {phase === 'verifying' &&
        <>
            <div style={{ margin: '20px auto 0', width: 30, height: 30, borderRadius: 999, border: '3px solid ' + t.primarySoft, borderTopColor: t.primary, animation: 'om-spin .8s linear infinite' }} />
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 23, color: t.ink }}>Memverifikasi…</h3>
            <p style={{ margin: '6px 0 14px', fontSize: 13.5, color: t.muted }}>Membuat akunmu</p>
          </>
        }

        {phase === 'done' &&
        <>
            <h3 style={{ margin: '16px 0 0', fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 25, color: t.ink }}>Berhasil masuk!</h3>
            <p style={{ margin: '6px 0 6px', fontSize: 13.5, color: t.muted }}>Lanjut ke keranjangmu…</p>
          </>
        }
      </div>

      {phase === 'phone' &&
      <>
          <Button full disabled={!valid} onClick={sendCode}>Kirim Kode</Button>
          <NumPad onKey={(k) => setNum((n) => n.length < 12 ? n + k : n)} onBack={() => setNum((n) => n.slice(0, -1))} />
          <p style={{ textAlign: 'center', color: t.faint, fontSize: 11.5, margin: '4px 4px 0', lineHeight: 1.5 }}>Dengan lanjut, kamu setuju dengan Syarat &amp; Kebijakan Privasi.</p>
        </>
      }
      {phase === 'otp' &&
      <NumPad onKey={(k) => {setErr(false);setCode((c) => c.length < len ? c + k : c);}} onBack={() => setCode((c) => c.slice(0, -1))} />
      }
    </Sheet>);

}

// ── Login dispatcher — pilih overlay sesuai tweak authMethod ──
function LoginSheet({ params }) {
  const app = useApp();
  return app.authMethod === 'otp' ? <OtpLoginSheet params={params} /> : <WhatsAppLoginSheet params={params} />;
}

Object.assign(window, { NumPad, EntryScreen, PhoneScreen, OtpScreen, WhatsAppLoginSheet, OtpLoginSheet, LoginSheet });