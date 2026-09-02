"use client";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this document?")) {
      const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete, or 20 mins expired.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-navy/50 transition-colors hover:text-red-500" 
      title="Delete"
    >
      <svg className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
