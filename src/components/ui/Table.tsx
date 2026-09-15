function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-navy/10">
      <table className="w-full min-w-[560px] text-left text-sm">{children}</table>
    </div>
  );
}

function Head({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-brand-navy/5 text-brand-navy/60">
      <tr>{children}</tr>
    </thead>
  );
}

function HeadCell({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <tr className="border-t border-brand-navy/10 transition-colors hover:bg-brand-navy/[0.02]">{children}</tr>;
}

function Cell({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) {
  return (
    <td className="px-4 py-3" colSpan={colSpan}>
      {children}
    </td>
  );
}

function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-6 text-center text-brand-navy/50">
        {children}
      </td>
    </tr>
  );
}

export default Object.assign(Table, { Head, HeadCell, Row, Cell, Empty });
