// member-blocks.jsx — Login opsional di Konfirmasi + Member & Poin.
// Implementasi visual handoff (brief visual + state). Semua warna via token
// (makeTheme porcelain). Ikon dari set primitif di ui.jsx — tak ada warna ikon hardcode.

const { useState } = React;

// ── Konstanta netral (bukan token, tapi diturunkan dari token untuk demo) ──
function useT() { return useTheme(); }

// ── Varian collapsed perk (mirror screens-checkout MemberLoginBlock) ──
function DefaultVariant({ v }) {
  const t = useT();
  const wrap = {
    dashed: { background: t.primarySoft, border: '1px dashed ' + hexA(t.primary, 0.4), borderRadius: t.radius, padding: '11px 13px' },
    solid: { background: t.primarySoft, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '11px 13px' },
    inline: { background: 'transparent', border: 'none', padding: '2px 2px' },
    banner: { background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '11px 13px' }
  }[v];
  if (v === 'banner') return (
    <div style={wrap}><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 999, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="gift" size={17} color={t.primary} stroke={2} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, lineHeight: 1.25 }}>Member? Masuk buat kumpulin poin</div>
        <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Opsional · pakai No. HP</div>
      </div>
      <Icon name="chevron" size={17} color={t.faint} style={{ transform: 'rotate(90deg)' }} />
    </div></div>);
  if (v === 'inline') return (
    <div style={wrap}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon name="gift" size={16} color={t.primary} stroke={2} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: t.primary }}>Masuk buat kumpulin poin <span style={{ fontWeight: 500, color: t.faint }}>· opsional</span></span>
      <Icon name="chevron" size={16} color={t.primary} style={{ transform: 'rotate(90deg)' }} />
    </div></div>);
  return (
    <div style={wrap}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="gift" size={19} color={t.primary} stroke={2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.primary, lineHeight: 1.25 }}>Member? Masuk buat kumpulin poin</div>
        <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Opsional · pakai No. HP</div>
      </div>
      <Icon name="chevron" size={17} color={t.primary} style={{ transform: 'rotate(90deg)' }} />
    </div></div>);
}

// ── Redesign concepts — arah baru ───────────────────────────
function RedesignA() { // Poin-forward: jual benefit
  const t = useT();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.primary, borderRadius: t.radius, padding: '13px 15px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.onPrimary, lineHeight: 1.2 }}>Dapat poin tiap pesan</div>
        <div style={{ fontSize: 11.5, color: hexA(t.onPrimary, 0.8), marginTop: 2 }}>Masuk pakai No. HP · opsional</div>
      </div>
      <span style={{ flexShrink: 0, background: t.onPrimary, color: t.primary, borderRadius: 999, padding: '8px 16px', fontSize: 13, fontWeight: 800 }}>Masuk</span>
    </div>);
}
function RedesignB() { // CTA pill tunggal, tanpa kartu
  const t = useT();
  return (
    <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: t.primarySoft, border: 'none', borderRadius: 999, padding: '13px 16px', cursor: 'pointer', fontFamily: t.fontBody }}>
      <Icon name="gift" size={17} color={t.primary} stroke={2} />
      <span style={{ fontSize: 13.5, fontWeight: 700, color: t.primary }}>Masuk & kumpulin poin</span>
      <span style={{ fontSize: 11.5, fontWeight: 500, color: t.muted }}>· opsional</span>
    </button>);
}
function RedesignC() { // Field-first, nol tap ekstra
  const t = useT();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <Icon name="gift" size={15} color={t.primary} stroke={2} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: t.ink }}>Kumpulin poin <span style={{ fontWeight: 500, color: t.faint }}>· opsional, pakai No. HP</span></span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 46, border: '1.5px solid ' + t.line, borderRadius: t.radiusSm, background: t.surface }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, padding: '0 10px 0 13px' }}>+62</span>
          <span style={{ width: 1, alignSelf: 'stretch', margin: '11px 0', background: t.line }} />
          <span style={{ flex: 1, fontSize: 14, padding: '0 12px', color: t.faint, fontVariantNumeric: 'tabular-nums' }}>812 3456 7890</span>
        </div>
        <button style={{ flexShrink: 0, height: 46, padding: '0 20px', borderRadius: t.radiusSm, background: t.primary, border: 'none', color: t.onPrimary, fontFamily: t.fontBody, fontSize: 13.5, fontWeight: 700 }}>Masuk</button>
      </div>
    </div>);
}
function RedesignD() { // Struk/ticket — selaras bahasa visual app
  const t = useT();
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radiusSm, padding: '13px 15px 13px 20px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundImage: `repeating-linear-gradient(180deg, ${t.primary} 0 7px, transparent 7px 13px)` }} />
      <Icon name="gift" size={20} color={t.primary} stroke={2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: t.faint }}>Member</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink, marginTop: 1 }}>Masuk buat kumpulin poin</div>
      </div>
      <span style={{ flexShrink: 0, color: t.primary, fontSize: 13, fontWeight: 700 }}>Masuk ›</span>
    </div>);
}

// ─────────────────────────────────────────────────────────────
// MemberLoginBlock — State: Default | Expanded | Member | NonMember
// ─────────────────────────────────────────────────────────────
function PerkRow({ open }) {
  const t = useT();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name="gift" size={19} color={t.primary} stroke={2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.primary, lineHeight: 1.25 }}>Member? Masuk buat kumpulin poin</div>
        <div style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>Opsional · pakai No. HP</div>
      </div>
      <Icon name="chevron" size={17} color={t.primary} style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform .2s' }} />
    </div>);
}

function PhoneField({ value, active }) {
  const t = useT();
  const filled = !!value;
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', height: 44, border: '1.5px solid ' + ((filled || active) ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, overflow: 'hidden' }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: t.ink, padding: '0 10px 0 13px' }}>+62</span>
      <span style={{ width: 1, alignSelf: 'stretch', margin: '10px 0', background: t.line }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 14, padding: '0 12px', fontVariantNumeric: 'tabular-nums', color: filled ? t.ink : t.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{filled ? value : '812 3456 7890'}</span>
    </div>);
}

function MasukBtn({ disabled }) {
  const t = useT();
  return (
    <button disabled={disabled} style={{ flexShrink: 0, height: 44, padding: '0 20px', borderRadius: t.radiusSm, background: 'transparent', border: '1.5px solid ' + (disabled ? t.line : t.primary), color: disabled ? t.faint : t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, cursor: disabled ? 'default' : 'pointer' }}>Masuk</button>);
}

function MemberLoginBlock({ state, phone }) {
  const t = useT();

  if (state === 'Member') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.primarySoft, borderRadius: t.radius, padding: '11px 13px' }}>
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 999, background: t.primary, color: t.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>BS</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.ink, lineHeight: 1.2 }}>Halo, Budi</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.primary, marginTop: 2 }}>Member · 1.240 poin</div>
        </div>
        <button style={{ flexShrink: 0, border: 'none', background: 'none', padding: 4, cursor: 'pointer', color: t.faint, fontFamily: t.fontBody, fontSize: 12, fontWeight: 600 }}>Keluar</button>
      </div>);
  }

  const open = state === 'Expanded' || state === 'NonMember';
  const nonMember = state === 'NonMember';
  return (
    <div style={{ background: t.primarySoft, border: '1px dashed ' + hexA(t.primary, 0.4), borderRadius: t.radius, padding: '11px 13px' }}>
      <PerkRow open={open} />
      {open &&
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <PhoneField value={nonMember ? phone : ''} active={!nonMember} />
        <MasukBtn disabled={!nonMember} />
      </div>}
      {nonMember &&
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <Icon name="info" size={13} color={t.faint} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.4 }}>Nomor disimpan buat struk. Belum terdaftar sebagai member.</span>
      </div>}
    </div>);
}

// ─────────────────────────────────────────────────────────────
// PointsEarnedBlock — Sukses (member saja)
// ─────────────────────────────────────────────────────────────
function PointsEarnedBlock() {
  const t = useT();
  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed ' + t.line }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: t.primarySoft, borderRadius: t.radius, padding: '12px 14px' }}>
        <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="gift" size={20} color={t.primary} stroke={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.primary, lineHeight: 1.2 }}>+84 poin didapat</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>Saldo baru: 1.324 poin</div>
        </div>
      </div>
    </div>);
}

// ─────────────────────────────────────────────────────────────
// Bagikan Struk — WhatsApp channel, State: Prefilled | Kosong
// ─────────────────────────────────────────────────────────────
function ShareField({ state }) {
  const t = useT();
  const prefilled = state === 'Prefilled';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.muted }}>Nomor WhatsApp</label>
        {prefilled &&
        <span style={{ fontSize: 10.5, fontWeight: 700, color: t.primary, background: t.primarySoft, borderRadius: 999, padding: '2px 8px' }}>dari pesanan</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid ' + (prefilled ? t.primary : t.line), borderRadius: t.radiusSm, background: t.surface, padding: '0 13px', height: 46 }}>
        <Icon name="whatsapp" size={17} color={prefilled ? '#25D366' : t.faint} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontVariantNumeric: 'tabular-nums', color: prefilled ? t.ink : t.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: prefilled ? 600 : 400 }}>
          {prefilled ? '+62 812 3456 7890' : '8xx xxxx xxxx'}
        </span>
        {prefilled &&
        <button style={{ flexShrink: 0, border: 'none', background: 'none', padding: 4, cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 12.5, fontWeight: 700 }}>Ubah</button>}
      </div>
      {!prefilled &&
      <p style={{ margin: '9px 2px 0', fontSize: 12, color: t.faint, lineHeight: 1.45 }}>Isi nomor buat terima struk.</p>}
      <button disabled={!prefilled} style={{ width: '100%', marginTop: 14, height: 50, borderRadius: t.radius, border: 'none', background: prefilled ? t.primary : t.surface2, color: prefilled ? t.onPrimary : t.faint, fontFamily: t.fontBody, fontSize: 15, fontWeight: 700, cursor: prefilled ? 'pointer' : 'default', boxShadow: prefilled ? t.shadow : 'none' }}>Kirim struk</button>
    </div>);
}

// ─────────────────────────────────────────────────────────────
// Kartu pembungkus state — label + swatch mirip body layar (bg screen)
// ─────────────────────────────────────────────────────────────
function StateCard({ label, note, w = 372, children }) {
  const t = useT();
  return (
    <div style={{ width: w, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#EAF3F2' }}>{label}</span>
        {note && <span style={{ fontSize: 11.5, color: '#7E938F' }}>{note}</span>}
      </div>
      <div style={{ background: t.bg, borderRadius: 20, padding: 22, border: '1px solid rgba(255,255,255,0.06)' }}>{children}</div>
    </div>);
}

// ── Mini konteks: potongan atas layar Konfirmasi ────────────
function ConfirmContext() {
  const t = useT();
  return (
    <div style={{ background: t.bg }}>
      <MemberLoginBlock state="Default" />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8, paddingLeft: 2 }}>Ringkasan Pesanan</div>
        <div style={{ background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, padding: '14px 16px' }}>
          {[['2× Nasi Ayam Bakar Madu', 'Rp96.000'], ['1× Es Teh Manis', 'Rp8.000']].map(([n, p], i) =>
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13.5, color: t.ink }}>
            <span style={{ fontWeight: 600 }}>{n}</span><span style={{ fontWeight: 600 }}>{p}</span>
          </div>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: t.ink }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 19, color: t.ink }}>Rp104.000</span>
          </div>
        </div>
      </div>
    </div>);
}

// ── Mini konteks: sheet Sukses dengan PointsEarnedBlock ─────
function SuccessContext({ member }) {
  const t = useT();
  return (
    <div style={{ background: t.bg }}>
      <div style={{ background: t.primary, borderRadius: '18px 18px 0 0', padding: '22px 20px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: 999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Icon name="checkCircle" size={30} color={t.primary} stroke={2} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Pembayaran berhasil</div>
        <div style={{ fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 38, color: '#fff', marginTop: 4 }}>Rp104.000</div>
      </div>
      <div style={{ background: t.surface, borderRadius: '0 0 18px 18px', padding: '16px 18px 20px', boxShadow: t.shadow }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: t.faint, marginBottom: 8 }}>Detail Transaksi</div>
        {[['Metode', 'QRIS'], ['Tanggal', '21 Jul 2026, 14:20'], ['ID Transaksi', 'TX-9F4A21']].map(([k, v], i) =>
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: t.muted }}>
          <span>{k}</span><span style={{ color: t.ink, fontWeight: 600 }}>{v}</span>
        </div>)}
        {member && <PointsEarnedBlock />}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed ' + t.line }}>
          <button style={{ width: '100%', height: 48, borderRadius: t.radius, background: 'transparent', border: '1.5px solid ' + t.line, color: t.ink, fontFamily: t.fontBody, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="share" size={17} color={t.ink} /> Bagikan struk
          </button>
        </div>
      </div>
    </div>);
}

// ─────────────────────────────────────────────────────────────
function Section({ title, desc, children }) {
  return (
    <div style={{ marginBottom: 54 }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 22, fontWeight: 800, color: '#F3F6F5', letterSpacing: -0.2 }}>{title}</h2>
      <p style={{ margin: '0 0 22px', fontSize: 13.5, color: '#8AA09C', maxWidth: 640, lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>{children}</div>
    </div>);
}

function App() {
  const t = React.useMemo(() => makeTheme({ style: 'porcelain', primary: '#1799A5', fonts: 'elegan' }), []);
  return (
    <ThemeCtx.Provider value={t}>
      <div style={{ minHeight: '100vh', background: 'radial-gradient(130% 100% at 50% -10%, #1E2E2D 0%, #162020 45%, #0E1717 100%)', padding: '48px 40px 80px', fontFamily: '"Inter", sans-serif' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.primary, marginBottom: 8 }}>Self Order · Design Handoff</div>
            <h1 style={{ margin: 0, fontFamily: '"Hanken Grotesk", sans-serif', fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Login Opsional di Konfirmasi + Member &amp; Poin</h1>
            <p style={{ margin: '10px 0 0', fontSize: 14.5, color: '#9DB2AE', maxWidth: 680, lineHeight: 1.55 }}>Login opsional, tanpa OTP, tanpa field Nama. Nomor = identitas + poin. Poin sebagai perolehan hanya di Sukses. Semua warna terikat token; CTA utama tunggal (Bayar/Kirim) — "Masuk" ghost.</p>
          </div>

          <Section title="Redesign · arah baru" desc="Empat arah beda buat gantikan blok lama. Pilih satu buat aku pasang ke app.">
            <StateCard label="A · Poin-forward" note="jual benefit, kartu solid primary"><RedesignA /></StateCard>
            <StateCard label="B · Pill CTA" note="satu tombol, tanpa kartu"><RedesignB /></StateCard>
            <StateCard label="C · Field-first" note="nol tap ekstra, langsung isi"><RedesignC /></StateCard>
            <StateCard label="D · Struk/ticket" note="selaras bahasa visual struk"><RedesignD /></StateCard>
          </Section>

          <Section title="Konfirmasi · varian collapsed" desc="Empat gaya perk (tweak Blok Member): Dashed / Solid / Baris / Banner.">
            <StateCard label="Dashed"><DefaultVariant v="dashed" /></StateCard>
            <StateCard label="Solid"><DefaultVariant v="solid" /></StateCard>
            <StateCard label="Baris (inline)"><DefaultVariant v="inline" /></StateCard>
            <StateCard label="Banner"><DefaultVariant v="banner" /></StateCard>
          </Section>

          <Section title="Konfirmasi · MemberLoginBlock" desc="Blok paling atas body Konfirmasi. Bobot ringan (dashed/ghost) supaya jelas opsional. 4 state properti State.">
            <StateCard label="Default" note="guest, belum login"><MemberLoginBlock state="Default" /></StateCard>
            <StateCard label="Expanded" note="baris di-tap"><MemberLoginBlock state="Expanded" /></StateCard>
            <StateCard label="Member" note="nomor cocok member POS"><MemberLoginBlock state="Member" /></StateCard>
            <StateCard label="NonMember" note="nomor bukan member — netral, bukan error"><MemberLoginBlock state="NonMember" phone="877 1122 3344" /></StateCard>
          </Section>

          <Section title="Konfirmasi · dalam konteks" desc="Posisi blok relatif Ringkasan Pesanan. CTA bawah tetap Bayar / Kirim ke Dapur.">
            <StateCard label="Body Konfirmasi (guest)" w={412}><ConfirmContext /></StateCard>
          </Section>

          <Section title="Sukses · PointsEarnedBlock" desc="Setelah Detail Transaksi, sebelum Bagikan struk. Hanya varian member; non-member polos.">
            <StateCard label="Member" note="+poin didapat + saldo baru" w={412}><SuccessContext member /></StateCard>
            <StateCard label="Non-member" note="polos, tanpa blok poin" w={412}><SuccessContext member={false} /></StateCard>
          </Section>

          <Section title="Bagikan Struk · state nomor" desc="Channel WhatsApp. Prefilled dari Konfirmasi vs kosong (guest tak pernah kasih nomor).">
            <StateCard label="Prefilled" note="ada nomor dari pesanan"><ShareField state="Prefilled" /></StateCard>
            <StateCard label="Kosong" note="tombol inaktif sampai diisi"><ShareField state="Kosong" /></StateCard>
          </Section>
        </div>
      </div>
    </ThemeCtx.Provider>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
