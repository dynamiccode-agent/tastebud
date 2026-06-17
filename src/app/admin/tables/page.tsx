import { db } from '@/db'
import { tables } from '@/db/schema'
import { eq } from 'drizzle-orm'

const VENUE_ID = '11111111-1111-1111-1111-111111111111'

export default async function AdminTablesPage() {
  const allTables = await db.select().from(tables).where(eq(tables.venueId, VENUE_ID))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tables & QR Codes</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3">Table</th>
              <th className="text-left px-4 py-3">QR URL</th>
              <th className="text-center px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allTables.map(table => (
              <tr key={table.id}>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900">Table {table.tableNumber}</p>
                  {table.label && <p className="text-xs text-gray-400">{table.label}</p>}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    /venue/{VENUE_ID}/table/{table.tableNumber}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${table.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {table.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <p className="font-medium text-orange-800 mb-2">How to generate QR codes</p>
        <p className="text-sm text-orange-700">
          Use any QR code generator with the URL above. Point it to your deployed app URL, e.g.:
          <br />
          <code className="block mt-1 text-xs bg-white rounded px-2 py-1">
            https://your-app.vercel.app/venue/{VENUE_ID}/table/1
          </code>
        </p>
      </div>
    </div>
  )
}
