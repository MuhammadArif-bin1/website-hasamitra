export interface RegistrationCsvData {
  produk: string;
  nama: string;
  alamat: string;
  email: string;
  pilihanLabel: string;
  pilihanValue: string;
  tanggal: string;
}

/**
 * Generates RFC-4180 compliant CSV text with UTF-8 BOM byte marker (\uFEFF)
 * for maximum compatibility with Microsoft Excel and Google Sheets.
 */
export function generateRegistrationCsvContent(data: RegistrationCsvData): string {
  const headers = [
    "No",
    "Tanggal Pendaftaran",
    "Produk Pilihan",
    "Nama Nasabah",
    "Alamat Domisili",
    "Email Nasabah",
    data.pilihanLabel,
  ];

  const escapeCsv = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

  const row = [
    "1",
    data.tanggal,
    data.produk,
    data.nama,
    data.alamat,
    data.email,
    data.pilihanValue,
  ];

  return "\uFEFF" + headers.map(escapeCsv).join(",") + "\n" + row.map(escapeCsv).join(",");
}

/**
 * Creates a sanitized filename for the CSV download.
 */
export function generateCsvFilename(productName: string, customerName: string): string {
  const cleanProduct = productName.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").toLowerCase();
  const cleanName = customerName.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").toLowerCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `pendaftaran_${cleanProduct}_${cleanName}_${dateStr}.csv`;
}

/**
 * Triggers automatic browser file download for CSV content.
 */
export function downloadCsvFile(csvContent: string, filename: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (error) {
    console.error("Gagal mengunduh file CSV:", error);
    return false;
  }
}
