export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Analytics</h1>
        <p className="text-[#777777] mt-1 text-sm">Deep dive into store performance metrics.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm p-12 text-center">
        <h2 className="text-xl font-serif font-bold text-[#111111] mb-2">Insufficient Data</h2>
        <p className="text-sm text-[#777777] max-w-md mx-auto">
          We need more transaction history to generate meaningful analytics reports. Continue processing orders to unlock insights.
        </p>
      </div>
    </div>
  );
}
