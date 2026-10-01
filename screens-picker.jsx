// screens-picker.jsx — Item picker sheet: tampil saat user ketuk item yg sudah di keranjang.
// User bisa Edit baris yang sudah ada, atur qty, atau "Customize Another" (kustomisasi baru).
const { useState: useStateP } = React;

// ── Stepper bergaya referensi: − [n] +  (lingkaran outline, berjarak) ──
function PickerStepper({ value, onDec, onInc }) {
  const t = useTheme();
  const circle = (icon, fn, danger) =>
    <button onClick={fn} className="om-press" aria-label={icon} style={{
      width: 30, height: 30, borderRadius: 999, flexShrink: 0,
      border: '1.5px solid ' + t.lineStrong, background: 'transparent',
      color: danger ? '#BE4137' : t.primary, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      WebkitTapHighlightColor: 'transparent'
    }}><Icon name={icon} size={15} stroke={2.4} /></button>;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      {circle('minus', onDec, value <= 1)}
      <span style={{ minWidth: 14, textAlign: 'center', fontWeight: 700, fontSize: 15, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {circle('plus', onInc)}
    </div>);
}

// Figma "Case: Hapus Item dari Keranjang (Qty ke 0)" (1127:8712): qty diturunkan di bawah 1 →
// ConfirmDialog dulu, baru barisnya dihapus. Baris terakhir item itu terhapus → sheet menutup
// sendiri (lihat ItemPickerSheet); item terakhir di keranjang → Keranjang Kosong.
const askRemoveLine = (app, line) => app.askConfirm({
  title: 'Hapus item?', message: 'Item akan dihapus dari keranjang.', confirmLabel: 'Hapus',
  onConfirm: () => app.removeLine(line.uid)
});

// ── Tombol Edit (pill outline + ikon pensil) ──
function EditPill({ onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} className="om-press" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
      height: 30, padding: '0 14px', borderRadius: 999, cursor: 'pointer',
      border: '1.5px solid ' + t.lineStrong, background: 'transparent',
      color: t.ink, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700,
      WebkitTapHighlightColor: 'transparent'
    }}>
      <Icon name="edit" size={14} color={t.ink} stroke={2} /> Edit
    </button>);
}

// ── Variasi A · "Kartu" — kartu + strip aksen kiri (mirip referensi) ──
function LineKartu({ line, onEdit }) {
  const t = useTheme();
  const app = useApp();
  return (
    <div style={{ display: 'flex', background: t.surface, border: '1px solid ' + t.line, borderRadius: t.radius, boxShadow: t.shadow, overflow: 'hidden' }}>
      <div style={{ width: 4, background: t.primary, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0, padding: '13px 15px' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <FoodImg label={line.name.toLowerCase()} h={52} radius={10} style={{ width: 52, flexShrink: 0 }} src={itemById(line.itemId)?.photo} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: t.ink, lineHeight: 1.25 }}>{line.name}</h4>
            <OptLines options={line.options} />
            {line.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{line.notes}"</div>}
          </div>
          <Money value={line.unit * line.qty} style={{ fontSize: 14, fontWeight: 700, color: t.ink, flexShrink: 0, whiteSpace: 'nowrap' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, marginTop: 12 }}>
          <EditPill onClick={onEdit} />
          <QtyStepper size="sm" value={line.qty} onChange={(v) => app.setLineQty(line.uid, v)} onRemove={() => askRemoveLine(app, line)} />
        </div>
      </div>
    </div>);
}

// ── Variasi B · "Ringkas" — baris terbagi pemisah, link Edit, stepper inline ──
function LineRingkas({ line, onEdit, last }) {
  const t = useTheme();
  const app = useApp();
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 2px', borderBottom: last ? 'none' : '1px solid ' + t.line }}>
      <FoodImg label={line.name.toLowerCase()} h={56} radius={10} style={{ width: 56, flexShrink: 0 }} src={itemById(line.itemId)?.photo} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: t.ink, lineHeight: 1.25, flex: 1 }}>{line.name}</h4>
          <Money value={line.unit * line.qty} style={{ fontSize: 14, fontWeight: 700, color: t.ink, flexShrink: 0, whiteSpace: 'nowrap' }} />
        </div>
        <OptLines options={line.options} />
        {line.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{line.notes}"</div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
          <button onClick={onEdit} className="om-press" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', cursor: 'pointer', color: t.primary, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
            <Icon name="edit" size={14} color={t.primary} stroke={2} /> Edit
          </button>
          <span style={{ display: 'inline-flex' }}>
            <QtyStepper size="sm" value={line.qty} onChange={(v) => app.setLineQty(line.uid, v)} onRemove={() => askRemoveLine(app, line)} />
          </span>
        </div>
      </div>
    </div>);
}

// ── Variasi C · "Blok" — blok terisi, ikon edit pojok, stepper bawah ──
function LineBlok({ line, onEdit }) {
  const t = useTheme();
  const app = useApp();
  return (
    <div style={{ position: 'relative', background: t.surface2, border: '1px solid ' + t.line, borderRadius: t.radius, padding: '14px 15px' }}>
      <button onClick={onEdit} className="om-press" aria-label="Edit" style={{ position: 'absolute', top: 11, right: 11, width: 32, height: 32, borderRadius: 999, border: 'none', background: t.surface, boxShadow: t.shadow, color: t.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}>
        <Icon name="edit" size={15} color={t.primary} stroke={2} />
      </button>
      <div style={{ display: 'flex', gap: 12, paddingRight: 40 }}>
        <FoodImg label={line.name.toLowerCase()} h={50} radius={10} style={{ width: 50, flexShrink: 0 }} src={itemById(line.itemId)?.photo} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: t.ink, lineHeight: 1.25 }}>{line.name}</h4>
          <OptLines options={line.options} />
          {line.notes && <div style={{ fontSize: 12, color: t.faint, marginTop: 2, fontStyle: 'italic' }}>"{line.notes}"</div>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid ' + t.line }}>
        <Money value={line.unit * line.qty} style={{ fontSize: 15, fontWeight: 800, color: t.ink }} />
        <PickerStepper value={line.qty} onDec={() => line.qty <= 1 ? askRemoveLine(app, line) : app.setLineQty(line.uid, line.qty - 1)} onInc={() => app.setLineQty(line.uid, line.qty + 1)} />
      </div>
    </div>);
}

// ── Sheet utama ──
function ItemPickerSheet({ params }) {
  const t = useTheme();
  const app = useApp();
  const item = itemById(params.id);
  if (!item) return null;
  const style = app.pickerStyle || 'kartu';

  // baris keranjang non-gratis utk item ini
  const lines = app.cart.filter((l) => l.itemId === item.id && !l.free);
  // kalau semua baris item ini dihapus → tutup sheet otomatis (jangan tampilkan empty state)
  React.useEffect(() => { if (lines.length === 0) app.closeSheet(); }, [lines.length]);

  const editLine = (line) => app.go('item', { id: item.id, edit: line });   // go() menutup sheet
  const customizeAnother = () => app.go('item', { id: item.id });            // detail kosong

  const renderLine = (line, i) =>
    style === 'ringkas' ? <LineRingkas key={line.uid} line={line} onEdit={() => editLine(line)} last={i === lines.length - 1} /> :
    style === 'blok' ? <LineBlok key={line.uid} line={line} onEdit={() => editLine(line)} /> :
    <LineKartu key={line.uid} line={line} onEdit={() => editLine(line)} />;

  // Figma ManageCustomizationSheet: label selalu "Buat kustomisasi baru", juga untuk barang tanpa modifier
  const ctaLabel = 'Buat kustomisasi baru';

  if (lines.length === 0) return null; // sedang menutup; jangan flash empty state

  return (
    <Sheet onClose={app.closeSheet} maxH="80%" footer={
      <Button full onClick={customizeAnother}>{ctaLabel}</Button>
    }>
      {/* header — nama item + harga dasar + tutup */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '6px 0 16px' }}>
        <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontStyle: t.displayItalic ? 'italic' : 'normal', fontWeight: t.displayWeight, fontSize: 23, color: t.ink, lineHeight: 1.15, minWidth: 0, flex: 1 }}>{item.name}</h3>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <Money value={item.price} style={{ fontSize: 19, fontWeight: 800, color: t.ink, display: 'block', lineHeight: 1.1 }} />
          <div style={{ fontSize: 11.5, color: t.faint, fontWeight: 600, marginTop: 2 }}>Harga Dasar</div>
        </div>
        <button onClick={app.closeSheet} aria-label="Tutup" style={{ flexShrink: 0, border: 'none', background: t.primarySoft, width: 34, height: 34, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}><Icon name="close" size={18} color={t.primary} /></button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: style === 'ringkas' ? 0 : 12 }}>
        {lines.map(renderLine)}
      </div>
    </Sheet>);
}

Object.assign(window, { ItemPickerSheet });
