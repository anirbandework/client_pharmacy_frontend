import { useState, useEffect } from 'react';
import { superAdminApi } from '../services/adminApi';

export default function AllStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    try {
      const data = await superAdminApi.getAllStaff();
      setStaff(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupByShop = () => {
    return staff.reduce((acc, s) => {
      const key = `${s.shop_name} (${s.organization_id})`;
      if (!acc[key]) acc[key] = { shop: s.shop_name, org: s.organization_id, staff: [] };
      acc[key].staff.push(s);
      return acc;
    }, {});
  };

  const groupedStaff = groupByShop();

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-800">📊 Read-only view • Total: {staff.length} staff members</p>
      </div>

      {Object.entries(groupedStaff).map(([key, data]) => (
        <div key={key} className="bg-white p-4 rounded-xl shadow-md border border-primary-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-gray-800">{data.shop}</span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">{data.org}</span>
            <span className="text-sm text-gray-500">({data.staff.length} staff)</span>
          </h3>
          <div className="grid gap-3">
            {data.staff.map(s => (
              <div key={s.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{s.name}</h4>
                    <p className="text-sm text-gray-500 font-mono">UUID: {s.uuid}</p>
                    <p className="text-sm text-gray-600">Code: {s.staff_code}</p>
                    <p className="text-sm text-gray-600">Phone: {s.phone}</p>
                    {s.email && <p className="text-sm text-gray-600">Email: {s.email}</p>}
                    <p className="text-sm text-gray-600">Role: <span className="font-semibold capitalize">{s.role}</span></p>
                    {s.monthly_salary > 0 && <p className="text-sm text-gray-600">Salary: ₹{s.monthly_salary}</p>}
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
