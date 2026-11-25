export default function Receipt({ order }) {
  if (!order) return null;

  return (
    <div
      id="thermal-receipt"
      className="hidden bg-white text-black print:block print:shadow-none"
    >
      {/* Restaurant Header */}
      <div className="border-b border-dashed border-black pb-2 text-center">
        <h2 className="text-base font-bold uppercase tracking-wide">
          The Spice Kitchen
        </h2>
        <p className="text-[11px]">Koramangala, Bengaluru - 560034</p>
        <p className="text-[11px]">GSTIN: 29AABCT1332L1Z5</p>
        <p className="text-[11px]">FSSAI: 11223344556677</p>
      </div>

      {/* Bill Metadata */}
      <div className="space-y-0.5 border-b border-dashed border-black py-2 text-[11px]">
        <div className="flex justify-between">
          <span>Bill No: {order.id}</span>
          <span>{order.table}</span>
        </div>
        <div className="flex justify-between">
          <span>Guest: {order.customer}</span>
          <span>{order.time}</span>
        </div>
      </div>

      {/* Itemized Table */}
      <table className="my-2 w-full border-b border-dashed border-black text-[11px]">
        <thead>
          <tr className="border-b border-dashed border-black text-left">
            <th className="py-1">Item</th>
            <th className="py-1 text-center">Qty</th>
            <th className="py-1 text-right">Rate</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {order.lineItems.map((item) => (
            <tr key={item._id}>
              <td className="py-1 pr-1">{item.name}</td>
              <td className="py-1 text-center">{item.qty}</td>
              <td className="py-1 text-right">{item.price.toFixed(2)}</td>
              <td className="py-1 text-right">
                {(item.qty * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals & GST Breakdown */}
      <div className="space-y-1 border-b border-dashed border-black pb-2 text-[11px]">
        <div className="flex justify-between">
          <span>Sub Total:</span>
          <span>₹{order.subTotal.toFixed(2)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-₹{order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>CGST:</span>
          <span>₹{(order.taxTotal / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST:</span>
          <span>₹{(order.taxTotal / 2).toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-dashed border-black pt-1 text-sm font-bold">
          <span>GRAND TOTAL:</span>
          <span>₹{order.amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-0.5 pt-2 text-center text-[11px]">
        <p>Payment Mode: {order.payment}</p>
        <p className="font-bold">Thank You! Visit Again</p>
      </div>
    </div>
  );
}