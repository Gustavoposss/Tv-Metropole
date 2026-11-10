export default function FonteNoticia({ publicadoEm }) {
  return (
    <p className="font-label text-label-sm text-on-surface/70">
      <span className="font-bold uppercase tracking-wider text-secondary">G1</span>
      {publicadoEm ? <span> · {publicadoEm}</span> : null}
    </p>
  );
}
